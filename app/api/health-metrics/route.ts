import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { withAuth, createErrorResponse } from "@/lib/auth.mock";
import { HealthMetric, MetricType } from "@/lib/models/HealthMetric";

interface MetricQuery {
  userId: string;
  type?: MetricType;
  date?: {
    $gte?: Date;
    $lte?: Date;
  };
}

// Get metrics for the authenticated user
export const GET = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const type = url.searchParams.get("type") as MetricType | null;
    
    await dbConnect();
    
    // Build query
    const query: MetricQuery = { userId };
    if (type) query.type = type;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const [metrics, total] = await Promise.all([
      HealthMetric.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      HealthMetric.countDocuments(query)
    ]);
    
    return NextResponse.json({
      metrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error("Error fetching health metrics:", error);
    return createErrorResponse("Internal server error", 500);
  }
});

// Create a new metric for the authenticated user
export const POST = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.type || !body.value) {
      return createErrorResponse("Type and value are required fields", 400);
    }
    
    // Validate metric type
    const validTypes: MetricType[] = [
      'blood_pressure',
      'heart_rate',
      'weight',
      'sleep',
      'cholesterol',
      'glucose',
      'activity',
      'water',
      'meditation',
      'stress'
    ];
    
    if (!validTypes.includes(body.type)) {
      return createErrorResponse(`Invalid metric type. Must be one of: ${validTypes.join(', ')}`, 400);
    }
    
    await dbConnect();
    
    const healthMetric = await HealthMetric.create({
      userId,
      type: body.type,
      value: body.value,
      date: body.date ? new Date(body.date) : new Date(),
      notes: body.notes || ""
    });
    
    return NextResponse.json({ 
      success: true,
      healthMetric 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating health metric:", error);
    return createErrorResponse("Internal server error", 500);
  }
});

// Delete a health metric
export const DELETE = withAuth(async (request: NextRequest, userId: string) => {
  try {
    const url = new URL(request.url);
    const metricId = url.searchParams.get("id");
    
    if (!metricId) {
      return createErrorResponse("Metric ID is required", 400);
    }
    
    await dbConnect();
    
    // Find the metric and check if it belongs to the user
    const metric = await HealthMetric.findById(metricId);
    
    if (!metric) {
      return createErrorResponse("Metric not found", 404);
    }
    
    if (metric.userId !== userId) {
      return createErrorResponse("Not authorized to delete this metric", 403);
    }
    
    await HealthMetric.findByIdAndDelete(metricId);
    
    return NextResponse.json({ 
      success: true,
      message: "Health metric deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting health metric:", error);
    return createErrorResponse("Internal server error", 500);
  }
}); 