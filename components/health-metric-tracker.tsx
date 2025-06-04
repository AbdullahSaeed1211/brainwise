"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";

// Types for health metrics
type MetricType = 
  | 'blood_pressure' 
  | 'heart_rate' 
  | 'weight' 
  | 'sleep' 
  | 'cholesterol' 
  | 'glucose' 
  | 'activity'
  | 'water'
  | 'meditation'
  | 'stress';

interface HealthMetric {
  _id: string;
  userId: string;
  type: MetricType;
  value: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Format helper functions
function formatMetricType(type: MetricType): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatMetricValue(metric: HealthMetric): string {
  switch (metric.type) {
    case 'blood_pressure':
      return metric.value; // Already in format like "120/80"
    case 'heart_rate':
      return `${metric.value} bpm`;
    case 'weight':
      return `${metric.value} kg`;
    case 'sleep':
      return `${metric.value} hours`;
    case 'cholesterol':
      return `${metric.value} mg/dL`;
    case 'glucose':
      return `${metric.value} mg/dL`;
    case 'activity':
      return `${metric.value} mins`;
    case 'water':
      return `${metric.value} glasses`;
    case 'meditation':
      return `${metric.value} mins`;
    case 'stress':
      return `${metric.value}/10`;
    default:
      return metric.value;
  }
}

export function HealthMetricTracker() {
  // State
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<MetricType | "">("");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null);

  // Fetch metrics from API using useCallback to memoize the function
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/health-metrics?page=${pagination.page}&limit=${pagination.limit}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch health metrics");
      }
      
      const data = await response.json();
      setMetrics(data.metrics);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      toast.error("Failed to load health metrics");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  // Fetch metrics on component mount
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Add new health metric
  const addHealthMetric = async () => {
    if (!selectedType) {
      toast.error("Please select a metric type");
      return;
    }
    
    if (!value) {
      toast.error("Please enter a value");
      return;
    }
    
    try {
      const response = await fetch("/api/health-metrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedType,
          value,
          notes,
          date: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add health metric");
      }
      
      // Reset form and refresh data
      setSelectedType("");
      setValue("");
      setNotes("");
      toast.success("Health metric added successfully");
      fetchMetrics();
    } catch (error) {
      console.error("Error adding health metric:", error);
      toast.error("Failed to add health metric");
    }
  };

  // Handle metric deletion
  const deleteMetric = async (id: string) => {
    try {
      const response = await fetch(`/api/health-metrics?id=${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete health metric");
      }
      
      setDialogOpen(false);
      setSelectedMetric(null);
      toast.success("Health metric deleted successfully");
      fetchMetrics();
    } catch (error) {
      console.error("Error deleting health metric:", error);
      toast.error("Failed to delete health metric");
    }
  };

  // View metric details
  const viewMetricDetails = (metric: HealthMetric) => {
    setSelectedMetric(metric);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Health Metrics Tracker</CardTitle>
          <CardDescription>
            Monitor your health metrics to track progress and correlations with cognitive health.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="metric-type">Metric Type</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as MetricType)}
              >
                <SelectTrigger id="metric-type">
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blood_pressure">Blood Pressure</SelectItem>
                  <SelectItem value="heart_rate">Heart Rate</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="cholesterol">Cholesterol</SelectItem>
                  <SelectItem value="glucose">Glucose</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="water">Water Intake</SelectItem>
                  <SelectItem value="meditation">Meditation</SelectItem>
                  <SelectItem value="stress">Stress Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., 120/80, 72, 8.5"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional context about this measurement"
                className="h-9"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={addHealthMetric}>Add Metric</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Health Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent text-primary" />
            </div>
          ) : metrics.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No health metrics recorded yet. Start tracking above!
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.map((metric) => (
                    <TableRow key={metric._id}>
                      <TableCell>{formatMetricType(metric.type)}</TableCell>
                      <TableCell>{formatMetricValue(metric)}</TableCell>
                      <TableCell>
                        {format(new Date(metric.date), "MMM dd, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewMetricDetails(metric)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination.pages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Metric Details Dialog */}
      {selectedMetric && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {formatMetricType(selectedMetric.type)} Details
              </DialogTitle>
              <DialogDescription>
                Recorded on {format(new Date(selectedMetric.date), "MMM dd, yyyy h:mm a")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium">Value</h4>
                <p>{formatMetricValue(selectedMetric)}</p>
              </div>
              {selectedMetric.notes && (
                <div className="space-y-2">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedMetric.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => deleteMetric(selectedMetric._id)}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 