"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { predictStroke, type StrokeRiskInput } from "@/lib/stroke-model";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, HeartPulse, Activity } from "lucide-react";

interface FormData {
  gender: string;
  age: number;
  hypertension: number;
  heartDisease: number;
  everMarried: string;
  workType: string;
  residenceType: string;
  avgGlucoseLevel: number;
  bmi: number;
  smokingStatus: string;
}

interface PredictionResult {
  prediction: string;
  probability: number;
}

export function StrokeForm() {
  const [formData, setFormData] = useState<FormData>({
    gender: "male",
    age: 30,
    hypertension: 0,
    heartDisease: 0,
    everMarried: "no",
    workType: "Private",
    residenceType: "Urban",
    avgGlucoseLevel: 90,
    bmi: 25,
    smokingStatus: "never smoked",
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string | number) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add a small delay to simulate processing
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      // Use our model to predict stroke risk
      const modelInput: StrokeRiskInput = {
        gender: formData.gender === "male" ? "Male" : formData.gender === "female" ? "Female" : "Other",
        age: formData.age,
        hypertension: formData.hypertension as 0 | 1,
        heartDisease: formData.heartDisease as 0 | 1,
        everMarried: formData.everMarried === "yes" ? "Yes" : "No",
        workType: formData.workType as 'Private' | 'Self-employed' | 'Govt_job' | 'children' | 'Never_worked',
        residenceType: formData.residenceType as "Urban" | "Rural",
        avgGlucoseLevel: formData.avgGlucoseLevel,
        bmi: formData.bmi,
        smokingStatus: formData.smokingStatus as 'formerly smoked' | 'never smoked' | 'smokes' | 'Unknown'
      };
      
      const prediction = await predictStroke(modelInput);
      
      setResult(prediction);
    } catch (error) {
      console.error("Error making prediction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-md border-2 border-muted/30 dark:bg-gray-950/50 bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          Risk Assessment Form
        </CardTitle>
        <CardDescription className="text-center">Fill in your information to calculate stroke risk</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TooltipProvider>
            {/* Personal Information Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-sm font-medium text-primary">Personal Information</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => handleChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                  />
                </div>

                {/* Ever Married */}
                <div className="space-y-2">
                  <Label htmlFor="everMarried">
                    Marital Status
                  </Label>
                  <Select 
                    value={formData.everMarried} 
                    onValueChange={(value) => handleChange('everMarried', value)}
                  >
                    <SelectTrigger id="everMarried">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Ever Married</SelectItem>
                      <SelectItem value="no">Never Married</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Residence Type */}
                <div className="space-y-2">
                  <Label htmlFor="residenceType">Residence Type</Label>
                  <Select 
                    value={formData.residenceType} 
                    onValueChange={(value) => handleChange('residenceType', value)}
                  >
                    <SelectTrigger id="residenceType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urban">Urban</SelectItem>
                      <SelectItem value="Rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Work Type */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="workType">Work Type</Label>
                  <Select 
                    value={formData.workType} 
                    onValueChange={(value) => handleChange('workType', value)}
                  >
                    <SelectTrigger id="workType">
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="Self-employed">Self-employed</SelectItem>
                      <SelectItem value="Govt_job">Government Job</SelectItem>
                      <SelectItem value="children">Children</SelectItem>
                      <SelectItem value="Never_worked">Never Worked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Health Metrics Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-sm font-medium text-primary">Health Information</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Hypertension */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="hypertension">Hypertension</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        High blood pressure, typically considered as readings consistently above 130/80 mmHg
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select 
                    value={formData.hypertension.toString()} 
                    onValueChange={(value) => handleChange('hypertension', parseInt(value))}
                  >
                    <SelectTrigger id="hypertension">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Heart Disease */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="heartDisease">Heart Disease</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        Any condition affecting the heart, including coronary artery disease, heart failure, arrhythmias, etc.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select 
                    value={formData.heartDisease.toString()} 
                    onValueChange={(value) => handleChange('heartDisease', parseInt(value))}
                  >
                    <SelectTrigger id="heartDisease">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No</SelectItem>
                      <SelectItem value="1">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Average Glucose Level */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="avgGlucoseLevel">Avg. Glucose Level (mg/dL)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        Normal fasting glucose is typically between 70-100 mg/dL
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="avgGlucoseLevel"
                    type="number"
                    min="0"
                    value={formData.avgGlucoseLevel}
                    onChange={(e) => handleChange('avgGlucoseLevel', parseFloat(e.target.value))}
                  />
                </div>

                {/* BMI */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="bmi">BMI</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        Body Mass Index - Normal range is 18.5-24.9
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="bmi"
                    type="number"
                    min="0"
                    value={formData.bmi}
                    onChange={(e) => handleChange('bmi', parseFloat(e.target.value))}
                  />
                </div>

                {/* Smoking Status */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="smokingStatus">Smoking Status</Label>
                  <Select 
                    value={formData.smokingStatus} 
                    onValueChange={(value) => handleChange('smokingStatus', value)}
                  >
                    <SelectTrigger id="smokingStatus">
                      <SelectValue placeholder="Select smoking status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never smoked">Never Smoked</SelectItem>
                      <SelectItem value="formerly smoked">Formerly Smoked</SelectItem>
                      <SelectItem value="smokes">Currently Smokes</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TooltipProvider>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-6 text-lg font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Predict Stroke Risk
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>

      {result && (
        <CardFooter className="flex flex-col space-y-4 border-t p-6 mt-8">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-center">Assessment Result</h3>
            <div className={cn(
              "mt-4 p-4 rounded-lg text-center",
              result.prediction === "1" 
                ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800" 
                : "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            )}>
              <p className="text-lg font-semibold mb-2">
                {result.prediction === "1"
                  ? "Higher Risk of Stroke Detected"
                  : "Lower Risk of Stroke Detected"}
              </p>
              <p className={cn(
                "text-sm",
                result.prediction === "1" ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"
              )}>
                Probability: {(result.probability * 100).toFixed(2)}%
              </p>
            </div>
          </div>
          
          <div className="w-full p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Recommendations:</h4>
            <ul className="list-disc pl-5 text-sm space-y-1 text-blue-700 dark:text-blue-200">
              {result.prediction === "1" ? (
                <>
                  <li>Consult with a healthcare professional to discuss your risk factors</li>
                  <li>Consider lifestyle modifications such as diet and exercise</li>
                  <li>Monitor your blood pressure and glucose levels regularly</li>
                  <li>If you smoke, consider cessation programs</li>
                </>
              ) : (
                <>
                  <li>Continue with healthy lifestyle habits</li>
                  <li>Regular health check-ups are still recommended</li>
                  <li>Maintain a balanced diet and regular exercise routine</li>
                  <li>Monitor your health metrics annually</li>
                </>
              )}
            </ul>
          </div>
          
          <Button onClick={() => setResult(null)} variant="outline" className="mt-4">
            Make Another Assessment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 