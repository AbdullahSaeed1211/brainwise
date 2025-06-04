"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircledIcon } from "@radix-ui/react-icons";

// Form validation schema
const formSchema = z.object({
  age: z
    .number()
    .min(18, { message: "Age must be at least 18" })
    .max(120, { message: "Age must be less than 120" }),
  gender: z.enum(["male", "female"]),
  systolicBP: z
    .number()
    .min(70, { message: "Systolic BP must be at least 70 mmHg" })
    .max(250, { message: "Systolic BP must be less than 250 mmHg" }),
  diabetes: z.enum(["yes", "no"]),
  smoker: z.enum(["never", "former", "current"]),
  priorStroke: z.enum(["yes", "no"]),
  atrialFibrillation: z.enum(["yes", "no"]),
  physicalActivity: z.enum(["inactive", "moderate", "active"]),
  bmi: z
    .number()
    .min(15, { message: "BMI must be at least 15" })
    .max(50, { message: "BMI must be less than 50" }),
  cholesterolLevel: z.enum(["normal", "borderline", "high"]),
});

type FormValues = z.infer<typeof formSchema>;

export function StrokeRiskCalculator() {
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [riskCategory, setRiskCategory] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Default form values
  const defaultValues: Partial<FormValues> = {
    age: 40,
    gender: "male",
    systolicBP: 120,
    diabetes: "no",
    smoker: "never",
    priorStroke: "no",
    atrialFibrillation: "no",
    physicalActivity: "moderate",
    bmi: 25,
    cholesterolLevel: "normal",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Calculate risk score based on form values
  function calculateRiskScore(data: FormValues): number {
    let score = 0;
    
    // Age factor (higher age = higher risk)
    if (data.age <= 45) score += 0;
    else if (data.age <= 55) score += 1;
    else if (data.age <= 65) score += 2;
    else if (data.age <= 75) score += 3;
    else score += 4;
    
    // Gender factor (men have slightly higher risk)
    score += data.gender === "male" ? 1 : 0;
    
    // Blood pressure
    if (data.systolicBP < 120) score += 0;
    else if (data.systolicBP < 140) score += 1;
    else if (data.systolicBP < 160) score += 2;
    else score += 3;
    
    // Diabetes
    score += data.diabetes === "yes" ? 2 : 0;
    
    // Smoking status
    if (data.smoker === "never") score += 0;
    else if (data.smoker === "former") score += 1;
    else score += 3;
    
    // Prior stroke or TIA
    score += data.priorStroke === "yes" ? 4 : 0;
    
    // Atrial fibrillation
    score += data.atrialFibrillation === "yes" ? 3 : 0;
    
    // Physical activity
    if (data.physicalActivity === "active") score += 0;
    else if (data.physicalActivity === "moderate") score += 1;
    else score += 2;
    
    // BMI
    if (data.bmi < 25) score += 0;
    else if (data.bmi < 30) score += 1;
    else score += 2;
    
    // Cholesterol
    if (data.cholesterolLevel === "normal") score += 0;
    else if (data.cholesterolLevel === "borderline") score += 1;
    else score += 2;
    
    return score;
  }

  // Determine risk category and recommendations
  function interpretRiskScore(score: number, data: FormValues) {
    let category: string;
    const personRecommendations: string[] = [];
    
    // Categorize risk
    if (score <= 5) {
      category = "Low";
    } else if (score <= 10) {
      category = "Moderate";
    } else if (score <= 15) {
      category = "High";
    } else {
      category = "Very High";
    }
    
    // Generate personalized recommendations
    if (data.systolicBP >= 140) {
      personRecommendations.push("Work with your healthcare provider to lower your blood pressure. Consider monitoring at home regularly.");
    }
    
    if (data.smoker === "current") {
      personRecommendations.push("Quitting smoking is one of the most effective ways to reduce stroke risk. Consider smoking cessation programs or aids.");
    }
    
    if (data.diabetes === "yes") {
      personRecommendations.push("Maintain tight blood sugar control. Regular A1C testing and medication adherence are crucial.");
    }
    
    if (data.bmi >= 30) {
      personRecommendations.push("A weight loss of just 5-10% can significantly reduce stroke risk. Focus on a balanced diet and regular exercise.");
    }
    
    if (data.physicalActivity === "inactive") {
      personRecommendations.push("Aim for at least 150 minutes of moderate activity per week. Even short walks can make a difference.");
    }
    
    if (data.cholesterolLevel === "high") {
      personRecommendations.push("Discuss cholesterol management with your doctor. Diet changes, exercise, and possibly medication may be needed.");
    }
    
    if (data.atrialFibrillation === "yes") {
      personRecommendations.push("AFib increases stroke risk significantly. Ensure you follow your prescribed treatment plan, including anticoagulation if recommended.");
    }
    
    // Add general recommendation for all
    if (personRecommendations.length === 0) {
      personRecommendations.push("Maintain your healthy lifestyle choices. Regular check-ups are still important for prevention.");
    } else {
      personRecommendations.push("Schedule a comprehensive check-up with your healthcare provider to discuss these risk factors in detail.");
    }
    
    return { category, recommendations: personRecommendations };
  }

  function onSubmit(data: FormValues) {
    const score = calculateRiskScore(data);
    const { category, recommendations } = interpretRiskScore(score, data);
    
    setRiskScore(score);
    setRiskCategory(category);
    setRecommendations(recommendations);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Stroke Risk Assessment</h2>
        <p className="text-muted-foreground">
          Estimate your stroke risk based on personal health factors.
        </p>
      </div>

      <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>Important Disclaimer</AlertTitle>
        <AlertDescription>
          This calculator provides an estimate only and is not a diagnostic tool. 
          Always consult with healthcare professionals for medical advice.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Enter your health details to calculate your estimated risk.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Enter your age in years.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="systolicBP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Systolic Blood Pressure (mmHg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        The top number in your blood pressure reading.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="diabetes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diabetes</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smoker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Smoking Status</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never Smoked</SelectItem>
                              <SelectItem value="former">Former Smoker</SelectItem>
                              <SelectItem value="current">Current Smoker</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priorStroke"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prior Stroke or TIA</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="atrialFibrillation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Atrial Fibrillation</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="physicalActivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Physical Activity Level</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inactive">Inactive (Less than 30 min/week)</SelectItem>
                            <SelectItem value="moderate">Moderate (30-150 min/week)</SelectItem>
                            <SelectItem value="active">Active (150+ min/week)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Mass Index (BMI)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Calculate BMI: weight (kg) / [height (m)]²
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cholesterolLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cholesterol Level</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="borderline">Borderline High</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">Calculate Risk</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Risk Assessment</CardTitle>
            <CardDescription>
              Results are based on the information you provided.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {riskScore !== null ? (
              <>
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Risk Category</h3>
                  <div className={`text-3xl font-bold ${
                    riskCategory === "Low" 
                      ? "text-green-600 dark:text-green-400" 
                      : riskCategory === "Moderate" 
                      ? "text-yellow-600 dark:text-yellow-400" 
                      : riskCategory === "High" 
                      ? "text-orange-600 dark:text-orange-400" 
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {riskCategory}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Score: {riskScore} out of 20
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
                  <ul className="space-y-2">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-sm text-muted-foreground mt-6 italic">
                    Remember that this risk assessment is simplified and does not replace medical advice. 
                    Many other factors can influence stroke risk.
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-lg text-muted-foreground mb-6">
                  Complete the form and click &quot;Calculate Risk&quot; to see your assessment.
                </p>
                <div className="relative w-full h-12 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                    Waiting for your data...
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              form.reset(defaultValues);
              setRiskScore(null);
              setRiskCategory(null);
              setRecommendations([]);
            }}>
              Reset
            </Button>
            {riskScore !== null && (
              <Button variant="outline" onClick={() => window.print()}>
                Print Results
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 