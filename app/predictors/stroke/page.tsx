"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  gender: z.string().min(1, { message: "Please select your gender." }),
  age: z.coerce.number().min(1, { message: "Age must be at least 1 year." }).max(120, { message: "Age must not exceed 120 years." }),
  hypertension: z.boolean().default(false),
  heart_disease: z.boolean().default(false),
  ever_married: z.string().min(1, { message: "Please select your marital status." }),
  work_type: z.string().min(1, { message: "Please select your work type." }),
  Residence_type: z.string().min(1, { message: "Please select your residence type." }),
  avg_glucose_level: z.coerce.number().min(50, { message: "Glucose level should be at least 50 mg/dL." }).max(400, { message: "Glucose level should not exceed 400 mg/dL." }),
  bmi: z.coerce.number().min(10, { message: "BMI should be at least 10." }).max(50, { message: "BMI should not exceed 50." }),
  smoking_status: z.string().min(1, { message: "Please select your smoking status." }),
});

interface StrokePredictionResult {
  probability: number;
  prediction: string;
  stroke_prediction: number;
  using_model?: boolean;
  risk_factors?: string[];
  execution_time_ms?: number;
  model_version?: string;
  error?: string;
}

export default function StrokePredictorPage() {
  const [result, setResult] = useState<StrokePredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "",
      age: 45,
      hypertension: false,
      heart_disease: false,
      ever_married: "",
      work_type: "",
      Residence_type: "",
      avg_glucose_level: 100,
      bmi: 25,
      smoking_status: "",
    },
  });

  // Verify all form data is complete
  function verifyFormData(values: z.infer<typeof formSchema>): boolean {
    if (!values.gender || !values.ever_married || !values.work_type || 
        !values.Residence_type || !values.smoking_status) {
      return false;
    }
    
    if (!values.age || values.age <= 0 || values.age > 120) {
      return false;
    }
    
    if (!values.avg_glucose_level || values.avg_glucose_level <= 0) {
      return false;
    }
    
    if (!values.bmi || values.bmi <= 0 || values.bmi > 100) {
      return false;
    }
    
    return true;
  }

  // Add back the calculateClientRiskFactors function
  function calculateClientRiskFactors(values: z.infer<typeof formSchema>): string[] {
    const riskFactors: string[] = [];
    
    // Age is a major risk factor
    if (values.age > 75) {
      riskFactors.push("Advanced age (75+)");
    } else if (values.age > 65) {
      riskFactors.push("Senior age (65+)");
    } else if (values.age > 55) {
      riskFactors.push("Higher age risk (55+)");
    }
    
    // Medical conditions
    if (values.hypertension) {
      riskFactors.push("Hypertension");
    }
    
    if (values.heart_disease) {
      riskFactors.push("Heart disease");
    }
    
    // High glucose level
    if (values.avg_glucose_level > 180) {
      riskFactors.push("Very high glucose levels");
    } else if (values.avg_glucose_level > 140) {
      riskFactors.push("Elevated glucose levels");
    }
    
    // BMI
    if (values.bmi > 35) {
      riskFactors.push("Class II obesity (BMI > 35)");
    } else if (values.bmi > 30) {
      riskFactors.push("Class I obesity (BMI > 30)");
    } else if (values.bmi > 25) {
      riskFactors.push("Overweight (BMI > 25)");
    }
    
    // Smoking status
    if (values.smoking_status === "smokes") {
      riskFactors.push("Current smoker");
    } else if (values.smoking_status === "formerly smoked") {
      riskFactors.push("Former smoker");
    }
    
    // Other factors
    if (values.gender === "Male") {
      riskFactors.push("Male gender");
    }
    
    return riskFactors;
  }

  // Fix onSubmit function to properly format data for the API
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    
    console.group("🧠 Stroke Risk Assessment Process");
    console.log("🚀 Starting stroke risk analysis...");
    
    try {
      // Verify all form data is complete
      if (!verifyFormData(values)) {
        setError("Please fill in all required fields with valid values");
        console.error("❌ Form validation failed");
        setLoading(false);
        return;
      }
      
      console.log("📋 User form data:", values);
      
      // Format payload for the API - Convert boolean values to 0/1 integers
      const payload = {
        gender: values.gender,
        age: Number(values.age),
        hypertension: values.hypertension ? 1 : 0,
        heart_disease: values.heart_disease ? 1 : 0,
        ever_married: values.ever_married,
        work_type: values.work_type,
        Residence_type: values.Residence_type,
        avg_glucose_level: Number(values.avg_glucose_level),
        bmi: Number(values.bmi),
        smoking_status: values.smoking_status
      } as const;
      
      console.log("🚀 Sending payload to API:", payload);
      
      // Update the API call to format data correctly for the server
      const apiUrl = 'https://abdullah1211-ml-stroke.hf.space/api/predict';
      console.log(`🔗 API URL: ${apiUrl}`);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(payload).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });
      
      // Log what we're sending
      console.log("📤 Query params:", queryParams.toString());
      
      const requestStartTime = Date.now();
      
      try {
        // Try direct GET request with query parameters first (most compatible with FastAPI)
        const getUrl = `${apiUrl}?${queryParams.toString()}`;
        console.log("🔄 Attempting GET request with URL parameters:", getUrl);
        
        const getResponse = await fetch(getUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (getResponse.ok) {
          console.log("✅ GET request with URL parameters succeeded");
          const getResponseDuration = ((Date.now() - requestStartTime) / 1000).toFixed(2);
          console.log(`⚡ API response received in ${getResponseDuration}s`);
          console.log(`📡 Response status: ${getResponse.status} ${getResponse.statusText}`);
          console.log(`📡 Response headers:`, Object.fromEntries([...getResponse.headers.entries()]));
          
          const data = await getResponse.json();
          console.log("📦 API Response data:", data);
          
          // Handle response as before
          processApiResponse(data, values);
          return;
        } else {
          console.log("⚠️ GET request failed, trying POST with form data...");
        }
        
        // Create FormData for POST approach
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });
        
        console.log("📤 Form data being sent:", Array.from(formData.entries()).map(([k, v]) => `${k}=${v}`).join(', '));
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Origin': window.location.origin,
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: formData,
        });
        
        const requestDuration = ((Date.now() - requestStartTime) / 1000).toFixed(2);
        console.log(`⚡ API response received in ${requestDuration}s`);
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        console.log(`📡 Response headers:`, Object.fromEntries([...response.headers.entries()]));
        
        if (!response.ok) {
          let errorText = "";
          try {
            const responseText = await response.text();
            // Check if it's HTML and extract just the status code if it is
            if (responseText.includes('<!DOCTYPE html>')) {
              errorText = `Server error: ${response.status} ${response.statusText}`;
            } else {
              errorText = responseText.substring(0, 150) + (responseText.length > 150 ? '...' : '');
            }
          } catch {
            errorText = `Error ${response.status}`;
          }
          
          console.log("❌ API Error Details:", errorText);
          throw new Error(errorText);
        }
        
        const data = await response.json();
        console.log("📦 API Response data:", data);
        
        processApiResponse(data, values);
      } catch (networkErr) {
        console.log("❌ Network error:", networkErr);
        throw networkErr; // Re-throw to be handled by the outer catch
      }
    } catch (err: unknown) {
      console.error("❌ Error predicting stroke risk:", err);
      
      // Provide a more user-friendly error message
      let errorMessage = "We're temporarily unable to complete the analysis. Please try again in a moment.";
      
      if (err instanceof Error) {
        console.error("❌ Error details:", err.message);
        
        if (err.message.includes("404") || err.message.includes("Not Found")) {
          errorMessage = "The analysis service is currently being updated. Please try again shortly.";
        } else if (err.message.includes("Network") || err.message.includes("connection")) {
          errorMessage = "Please check your internet connection and try again.";
        } else if (err.message.includes("timeout") || err.message.includes("timed out")) {
          errorMessage = "The analysis is taking longer than expected. Please try again.";
        } else if (err.message.includes("Server error")) {
          errorMessage = "Our analysis service is experiencing high demand. Please try again in a moment.";
        }
      }
      
      setError(errorMessage);
      
      // Still provide a basic analysis for the user
      const basicResult: StrokePredictionResult = {
        probability: 0.05,
        prediction: "Analysis Unavailable",
        stroke_prediction: 0,
        using_model: false,
        risk_factors: calculateClientRiskFactors(values)
      };
      
      setResult(basicResult);
    } finally {
      setLoading(false);
      console.log("🏁 Analysis process completed");
      console.groupEnd();
    }
  }

  // Extract response handling to a separate function for reuse
  function processApiResponse(data: StrokePredictionResult, values: z.infer<typeof formSchema>) {
    // Ensure we have valid prediction data
    if (!data.prediction || data.probability === undefined) {
      throw new Error("Invalid prediction data received");
    }
    
    // Enhance the result with our risk factors if needed
        if (!data.risk_factors || data.risk_factors.length === 0) {
          const clientRiskFactors = calculateClientRiskFactors(values);
          data.risk_factors = clientRiskFactors;
      console.log("📊 Enhanced result with additional risk factors");
    }
    
    console.log("✅ Stroke risk assessment completed successfully");
    setResult(data);
  }

  function getRiskColor(prediction: string) {
    if (prediction.includes('High')) return 'text-red-500';
    if (prediction.includes('Moderate')) return 'text-orange-500';
    if (prediction.includes('Low')) return 'text-green-500';
    return 'text-blue-500';
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">Stroke Risk Predictor</h1>
        </div>
        <p className="text-muted-foreground">
          Assess your risk of stroke by filling out the form below. Our AI model will analyze 
          your data and provide a personalized risk assessment. This tool is for informational 
          purposes only and is not a substitute for professional medical advice.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Stroke Risk Assessment</CardTitle>
            <CardDescription>
              Based on the information you provided, our AI model has assessed your stroke risk.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted">
              <h3 className="text-xl font-semibold mb-2">Risk Level: <span className={getRiskColor(result.prediction)}>{result.prediction}</span></h3>
              <div className="text-sm text-muted-foreground">
                <p>Probability score: {(result.probability * 100).toFixed(2)}%</p>
                <p className="mt-1">Analysis powered by: {result.using_model ? "Machine Learning Model" : "Basic Risk Assessment"}</p>
              </div>
            </div>
            
            {/* Display risk factors when available */}
            {result.risk_factors && result.risk_factors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Risk Factors:</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {result.risk_factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="font-medium">What this means:</h4>
              <p className="text-sm text-muted-foreground">
                {result.prediction.includes('High') 
                  ? "Your risk factors suggest a higher than average risk of stroke. We recommend consulting with a healthcare provider."
                  : result.prediction.includes('Moderate')
                  ? "You have some risk factors for stroke. Consider discussing prevention strategies with your doctor."
                  : "Your risk factors suggest a lower risk of stroke. Continue maintaining a healthy lifestyle."}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setResult(null)} className="w-full">
              Reassess
            </Button>
          </CardFooter>
        </Card>
      )}

      {result === null && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (years)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hypertension"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Hypertension</FormLabel>
                      <FormDescription>Do you have high blood pressure?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heart_disease"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Heart Disease</FormLabel>
                      <FormDescription>Do you have any heart condition?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ever_married"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Married</SelectItem>
                        <SelectItem value="No">Never Married</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="work_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Private">Private</SelectItem>
                        <SelectItem value="Self-employed">Self-employed</SelectItem>
                        <SelectItem value="Govt_job">Government</SelectItem>
                        <SelectItem value="children">Child/Student</SelectItem>
                        <SelectItem value="Never_worked">Never worked</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Residence_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residence Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select residence type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Urban">Urban</SelectItem>
                        <SelectItem value="Rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avg_glucose_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Glucose Level (mg/dL): {field.value}</FormLabel>
                    <FormControl>
                      <Slider 
                        defaultValue={[field.value]} 
                        min={50} 
                        max={400} 
                        step={1} 
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>Normal fasting glucose: 70-100 mg/dL</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bmi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BMI (Body Mass Index): {field.value}</FormLabel>
                    <FormControl>
                      <Slider 
                        defaultValue={[field.value]} 
                        min={10} 
                        max={50} 
                        step={0.1} 
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormDescription>Normal BMI range: 18.5-24.9</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smoking_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Smoking Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select smoking status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="never smoked">Never Smoked</SelectItem>
                        <SelectItem value="formerly smoked">Former Smoker</SelectItem>
                        <SelectItem value="smokes">Current Smoker</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Analyzing..." : "Calculate Stroke Risk"}
            </Button>
          </form>
        </Form>
      )}

      <div className="mt-12 p-6 border rounded-lg bg-muted">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Important Notice
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          This tool is for informational purposes only and does not provide medical advice. 
          The predictions are based on statistical models and should not be used to make 
          medical decisions without consulting a healthcare professional.
        </p>
        <p className="text-sm text-muted-foreground">
          If you&apos;re concerned about your stroke risk or are experiencing medical symptoms, 
          please contact a healthcare provider immediately.
        </p>
      </div>
    </div>
  );
} 