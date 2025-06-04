"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const healthMetricSchema = z.object({
  type: z.enum(["blood_pressure", "heart_rate", "weight", "sleep", "cholesterol", "glucose"]),
  date: z.date(),
  value: z.string().min(1, "Value is required"),
  notes: z.string().optional(),
});

type HealthMetricFormValues = z.infer<typeof healthMetricSchema>;

interface HealthMetricsFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function HealthMetricsForm({ onClose, onSuccess }: HealthMetricsFormProps) {
  const { toast } = useToast();
  const form = useForm<HealthMetricFormValues>({
    resolver: zodResolver(healthMetricSchema),
    defaultValues: {
      type: "blood_pressure",
      date: new Date(),
      value: "",
      notes: "",
    },
  });

  const metricTypeOptions = [
    { value: "blood_pressure", label: "Blood Pressure", unit: "mmHg", placeholder: "120/80" },
    { value: "heart_rate", label: "Heart Rate", unit: "bpm", placeholder: "70" },
    { value: "weight", label: "Weight", unit: "kg", placeholder: "75" },
    { value: "sleep", label: "Sleep Duration", unit: "hours", placeholder: "7.5" },
    { value: "cholesterol", label: "Cholesterol", unit: "mg/dL", placeholder: "180" },
    { value: "glucose", label: "Blood Glucose", unit: "mg/dL", placeholder: "95" },
  ];

  const selectedMetricType = form.watch("type");
  const selectedOption = metricTypeOptions.find(option => option.value === selectedMetricType);

  function onSubmit(data: HealthMetricFormValues) {
    // In a real implementation, you would send this data to your API
    console.log({ ...data });
    
    toast({
      title: "Measurement added",
      description: `Your ${selectedOption?.label} measurement has been recorded.`,
      variant: "default",
    });
    
    // Note: In this demo version, data is only stored in memory and will be lost on refresh
    // A production version would save this data to a database
    
    onSuccess();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Health Measurement</CardTitle>
        <CardDescription>
          Record a new health metric to track your progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {metricTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of health metric you want to track
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value{selectedOption?.unit ? ` (${selectedOption.unit})` : ""}</FormLabel>
                  <FormControl>
                    <Input placeholder={selectedOption?.placeholder} {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the measured value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Any additional details..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Add any relevant context about this measurement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          <Plus className="mr-2 h-4 w-4" /> Add Measurement
        </Button>
      </CardFooter>
    </Card>
  );
} 