import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/mongodb";
import { withAuth, createErrorResponse } from "@/lib/auth";
import mongoose, { Model, Document } from "mongoose";

// Define interface for HealthMetric document
interface IHealthMetric extends Document {
  userId: string;
  name: string;
  value: string | number;
  unit: string;
  status: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Helper to get the HealthMetric model dynamically
const getHealthMetricModel = async (): Promise<Model<IHealthMetric>> => {
  await db.connect();
  try {
    return mongoose.model<IHealthMetric>('HealthMetric');
  } catch {
    // If model doesn't exist yet, create it with a simple schema
    const HealthMetricSchema = new mongoose.Schema({
      userId: String,
      name: String,
      value: mongoose.Schema.Types.Mixed,
      unit: String,
      status: String,
      date: Date
    }, { timestamps: true });
    
    return mongoose.model<IHealthMetric>('HealthMetric', HealthMetricSchema);
  }
};

export const GET = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    
    await db.connect();
    const HealthMetric = await getHealthMetricModel();
    
    const total = await HealthMetric.countDocuments({ userId });
    const metrics = await HealthMetric.find({ userId })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-__v");
    
    return NextResponse.json({
      status: "success",
      data: metrics,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error("Error retrieving health metrics:", error);
    return createErrorResponse("Failed to retrieve health metrics", 500);
  }
});

export const POST = withAuth(async (req: NextRequest, userId: string) => {
  try {
    const body = await req.json();
    
    if (!body.name || !body.value || !body.unit) {
      return createErrorResponse("Missing required fields: name, value, unit", 400);
    }
    
    await db.connect();
    const HealthMetric = await getHealthMetricModel();
    
    // Determine status based on metric type and value
    let status = "normal";
    if (body.name === "Blood Pressure") {
      status = Number(body.value) > 140 ? "warning" : 
              Number(body.value) > 160 ? "critical" : "normal";
    } else if (body.name === "Glucose") {
      status = Number(body.value) > 100 ? "warning" : 
              Number(body.value) > 140 ? "critical" : "normal";
    } else if (body.name === "BMI") {
      status = Number(body.value) > 25 ? "warning" : 
              Number(body.value) > 30 ? "critical" : "normal";
    }
    
    const metric = await HealthMetric.create({
      userId,
      name: body.name,
      value: body.value,
      unit: body.unit,
      status,
      date: new Date(),
    });
    
    return NextResponse.json({
      status: "success",
      data: metric,
    });
    
  } catch (error) {
    console.error("Error saving health metric:", error);
    return createErrorResponse("Failed to save health metric", 500);
  }
}); 