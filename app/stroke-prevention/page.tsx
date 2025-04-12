import React from "react";
import { Metadata } from "next";
import { 
  Heart,  
  Salad, 
  Dumbbell, 
  Ban, 
  Brain
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stroke Prevention | Brainwise",
  description: "Learn about evidence-based strategies to prevent strokes through lifestyle changes, diet, exercise, and health monitoring.",
  keywords: "stroke prevention, brain health, lifestyle changes, diet, exercise, health monitoring",
};

export default function StrokePreventionPage() {
  return (
    <div className="container py-8 px-4 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Stroke Prevention Strategies
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Evidence-based approaches to reduce your risk of stroke through lifestyle modifications and health management.
          </p>
        </div>

        <Tabs defaultValue="lifestyle" className="w-full">
          <div className="flex justify-center overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="mb-8">
              <TabsTrigger value="lifestyle" className="text-sm sm:text-base px-3 sm:px-4">
                <Dumbbell className="h-4 w-4 mr-1.5" />
                <span>Lifestyle</span>
              </TabsTrigger>
              <TabsTrigger value="diet" className="text-sm sm:text-base px-3 sm:px-4">
                <Salad className="h-4 w-4 mr-1.5" />
                <span>Diet</span>
              </TabsTrigger>
              <TabsTrigger value="medical" className="text-sm sm:text-base px-3 sm:px-4">
                <Heart className="h-4 w-4 mr-1.5" />
                <span>Medical</span>
              </TabsTrigger>
              <TabsTrigger value="risk" className="text-sm sm:text-base px-3 sm:px-4">
                <Ban className="h-4 w-4 mr-1.5" />
                <span>Risk Factors</span>
              </TabsTrigger>
              <TabsTrigger value="assessment" className="text-sm sm:text-base px-3 sm:px-4">
                <Brain className="h-4 w-4 mr-1.5" />
                <span>Assessment</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Lifestyle Tab */}
          <TabsContent value="lifestyle" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Physical Activity</CardTitle>
                  <CardDescription>Regular exercise reduces stroke risk by up to 30%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Aim for at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity aerobic activity per week.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Brisk walking, swimming, or cycling</li>
                    <li>Strength training 2-3 times per week</li>
                    <li>Balance and flexibility exercises</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Smoking Cessation</CardTitle>
                  <CardDescription>Quitting smoking reduces stroke risk to near-normal within 5 years</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Smoking damages blood vessels, increases clot formation, and reduces oxygen in the blood.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Set a quit date and stick to it</li>
                    <li>Consider nicotine replacement therapy</li>
                    <li>Join support groups for better success</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stress Management</CardTitle>
                  <CardDescription>Chronic stress contributes to hypertension and inflammation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Stress management techniques can improve cardiovascular health and reduce stroke risk.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Daily meditation or mindfulness practice</li>
                    <li>Deep breathing exercises</li>
                    <li>Regular leisure activities and hobbies</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sleep Quality</CardTitle>
                  <CardDescription>Poor sleep is linked to increased stroke risk</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Aim for 7-8 hours of quality sleep per night to reduce inflammation and blood pressure.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Maintain a consistent sleep schedule</li>
                    <li>Create a restful sleep environment</li>
                    <li>Screen for sleep apnea if you snore heavily</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Diet Tab */}
          <TabsContent value="diet" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mediterranean Diet</CardTitle>
                <CardDescription>Reduces stroke risk by up to 40%</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>The Mediterranean diet emphasizes plant-based foods, healthy fats, and limited red meat.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Components:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Olive oil as primary fat source</li>
                      <li>Abundant fruits and vegetables</li>
                      <li>Whole grains and legumes</li>
                      <li>Fish and poultry</li>
                      <li>Limited red meat</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Benefits:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Lowers blood pressure</li>
                      <li>Reduces inflammation</li>
                      <li>Improves cholesterol levels</li>
                      <li>Supports healthy blood vessel function</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sodium Reduction</CardTitle>
                  <CardDescription>High sodium intake is linked to hypertension</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Limit sodium to less than 2,300mg per day (about 1 teaspoon of salt).</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Read food labels for sodium content</li>
                    <li>Cook at home to control salt</li>
                    <li>Use herbs and spices for flavor</li>
                    <li>Limit processed and restaurant foods</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hydration</CardTitle>
                  <CardDescription>Proper hydration improves blood flow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Staying well-hydrated helps maintain blood volume and reduces clot formation.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Aim for 8-10 cups of water daily</li>
                    <li>Limit alcohol consumption</li>
                    <li>Monitor urine color (pale yellow is ideal)</li>
                    <li>Increase intake during exercise or hot weather</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blood Pressure Management</CardTitle>
                  <CardDescription>Hypertension is the #1 stroke risk factor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Maintain blood pressure below 120/80 mmHg for optimal brain health.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Monitor blood pressure regularly</li>
                    <li>Take medications as prescribed</li>
                    <li>Adopt the DASH diet</li>
                    <li>Reduce sodium intake</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cholesterol Management</CardTitle>
                  <CardDescription>High LDL increases risk of ischemic stroke</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Maintain healthy cholesterol levels to prevent plaque buildup in arteries.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Target LDL below 100 mg/dL</li>
                    <li>Increase HDL through exercise</li>
                    <li>Consider statins if prescribed</li>
                    <li>Get annual cholesterol screenings</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Regular Medical Check-ups</CardTitle>
                <CardDescription>Early detection of risk factors is crucial</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Schedule regular health screenings to monitor and manage stroke risk factors.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Screenings:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Blood pressure (every 6-12 months)</li>
                      <li>Cholesterol (annually)</li>
                      <li>Blood glucose (annually)</li>
                      <li>Carotid artery ultrasound (as recommended)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">When to Seek Help:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Unexplained headaches</li>
                      <li>Changes in vision</li>
                      <li>Numbness or weakness</li>
                      <li>Speech difficulties</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Factors Tab */}
          <TabsContent value="risk" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Modifiable Risk Factors</CardTitle>
                <CardDescription>Factors you can control to reduce stroke risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Lifestyle Factors:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Smoking</li>
                        <li>Physical inactivity</li>
                        <li>Poor diet</li>
                        <li>Excessive alcohol consumption</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Medical Conditions:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Hypertension</li>
                        <li>High cholesterol</li>
                        <li>Diabetes</li>
                        <li>Atrial fibrillation</li>
                        <li>Sleep apnea</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Non-Modifiable Factors:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Age (risk doubles each decade after 55)</li>
                        <li>Sex (men have higher risk until age 75)</li>
                        <li>Race (African Americans have higher risk)</li>
                        <li>Family history of stroke</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <p className="font-medium mb-2">Risk Reduction Strategy:</p>
                      <p>Focus on modifiable factors while being aware of your non-modifiable risk profile.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-4">
              <Button size="lg" className="micro-bounce" asChild>
                <Link href="/stroke-prediction">
                  Assess Your Stroke Risk
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Stroke Risk Assessment</CardTitle>
                <CardDescription>Use our tools to understand your personal risk profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Brainwise offers comprehensive tools to help you understand and monitor your stroke risk factors.
                  Regular assessment is key to prevention and early intervention.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Stroke Prediction Tool</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm mb-4">Input your health data to receive a personalized stroke risk assessment.</p>
                      <Button size="sm" className="w-full micro-bounce" asChild>
                        <Link href="/stroke-prediction">
                          Get Your Risk Score
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Brain Health Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm mb-4">Take our comprehensive cognitive assessment to monitor your brain health.</p>
                      <Button size="sm" className="w-full micro-bounce" asChild>
                        <Link href="/assessment-report">
                          Start Assessment
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Health Metrics Tracking</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm mb-4">Monitor key health indicators that impact your stroke risk.</p>
                      <Button size="sm" className="w-full micro-bounce" asChild>
                        <Link href="/health-metrics">
                          Track Your Metrics
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 