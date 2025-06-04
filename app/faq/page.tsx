import React from "react";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Brainwise",
  description: "Find answers to common questions about brain health, cognitive training, and using the Brainwise platform.",
  keywords: "FAQ, brain health questions, cognitive training help, brain exercises, stroke prevention",
};

export default function FAQPage() {
  return (
    <div className="container py-8 px-4 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto">
            Find answers to common questions about brain health, cognitive training, and using the Brainwise platform.
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <div className="flex justify-center overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="mb-8">
              <TabsTrigger value="general" className="text-sm sm:text-base px-3 sm:px-4">General</TabsTrigger>
              <TabsTrigger value="account" className="text-sm sm:text-base px-3 sm:px-4">Account</TabsTrigger>
              <TabsTrigger value="tools" className="text-sm sm:text-base px-3 sm:px-4">Tools & Features</TabsTrigger>
              <TabsTrigger value="health" className="text-sm sm:text-base px-3 sm:px-4">Brain Health</TabsTrigger>
              <TabsTrigger value="data" className="text-sm sm:text-base px-3 sm:px-4">Data & Privacy</TabsTrigger>
            </TabsList>
          </div>
          
          {/* General Questions */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Brainwise</CardTitle>
                <CardDescription>General information about our platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="what-is-brainwise">
                    <AccordionTrigger>What is Brainwise?</AccordionTrigger>
                    <AccordionContent>
                      Brainwise is a comprehensive brain health platform that combines cognitive assessment, brain training exercises, stroke risk prediction, and educational resources. Our mission is to help users understand, monitor, and improve their cognitive health through scientifically-backed tools and information.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="who-can-use">
                    <AccordionTrigger>Who can benefit from using Brainwise?</AccordionTrigger>
                    <AccordionContent>
                      Brainwise is designed for adults of all ages who are interested in maintaining or improving their cognitive health. This includes:
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Adults seeking to maintain cognitive function as they age</li>
                        <li>Individuals with risk factors for stroke or cognitive decline</li>
                        <li>People recovering from brain injuries or strokes</li>
                        <li>Anyone interested in optimizing their brain health</li>
                        <li>Healthcare providers looking for resources for their patients</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="scientific-backing">
                    <AccordionTrigger>Is Brainwise scientifically validated?</AccordionTrigger>
                    <AccordionContent>
                      Yes, Brainwise is built on evidence-based approaches to cognitive assessment and training. Our tools and content are developed with input from neuroscientists, neuropsychologists, and healthcare professionals. Our stroke risk prediction model is based on established risk factors validated in large-scale studies. We regularly update our platform based on the latest research findings.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="get-started">
                    <AccordionTrigger>How do I get started with Brainwise?</AccordionTrigger>
                    <AccordionContent>
                      Getting started is simple:
                      <ol className="list-decimal pl-6 mt-2 space-y-1">
                        <li>Create a free account</li>
                        <li>Complete the initial brain health assessment to establish your baseline</li>
                        <li>Explore our cognitive training tools and educational resources</li>
                        <li>Track your progress over time through your personalized dashboard</li>
                      </ol>
                      <div className="mt-4">
                        <Button asChild className="micro-bounce">
                          <Link href="/sign-up">Sign Up Now</Link>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account & Billing */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Managing your account</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="free-vs-premium">
                    <AccordionTrigger>What features are included in Brainwise?</AccordionTrigger>
                    <AccordionContent>
                      <p>Brainwise is completely free and includes all of these features:</p>
                      <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
                        <li>Comprehensive cognitive assessments</li>
                        <li>Full access to all brain training exercises</li>
                        <li>Stroke risk calculator</li>
                        <li>Personalized brain health recommendations</li>
                        <li>Advanced progress tracking and data visualization</li>
                        <li>Educational content and resources</li>
                        <li>Customer support</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="delete-account">
                    <AccordionTrigger>Can I delete my account and data?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can delete your account and all associated data at any time. Go to Account Settings, scroll to the bottom, and select &quot;Delete Account.&quot; Please note that this action is irreversible, and all your data will be permanently removed from our systems after the mandatory retention period required by applicable laws.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tools & Features */}
          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tools & Features</CardTitle>
                <CardDescription>Information about using our cognitive tools</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="how-often-train">
                    <AccordionTrigger>How often should I use the cognitive training exercises?</AccordionTrigger>
                    <AccordionContent>
                      For optimal results, we recommend using the cognitive training exercises 3-5 times per week, for about 15-20 minutes per session. Consistency is more important than duration. Regular, shorter sessions are more effective than occasional longer ones. Our daily challenges feature is designed to help you maintain a consistent training schedule.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="track-progress">
                    <AccordionTrigger>How can I track my progress?</AccordionTrigger>
                    <AccordionContent>
                      Your progress is automatically tracked in your personalized dashboard and the Progress Tracker section. You can view:
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Performance trends across different cognitive domains</li>
                        <li>Comparison to your baseline assessment</li>
                        <li>Achievement of personal goals and milestones</li>
                        <li>Activity calendar showing your consistency</li>
                      </ul>
                      We recommend taking a full cognitive assessment every 3-6 months to track more comprehensive changes in your cognitive function.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="stroke-prediction">
                    <AccordionTrigger>How accurate is the stroke risk prediction?</AccordionTrigger>
                    <AccordionContent>
                      Our stroke risk prediction model is based on established risk factors from large epidemiological studies. While it provides a good estimate of relative risk, it&apos;s important to understand that it&apos;s a statistical tool and not a medical diagnosis. The prediction should be used as one part of a comprehensive approach to health management, and we always recommend discussing your results with a healthcare provider for personalized medical advice.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="cognitive-assessment">
                    <AccordionTrigger>What does the cognitive assessment measure?</AccordionTrigger>
                    <AccordionContent>
                      Our comprehensive cognitive assessment evaluates multiple domains of cognitive function, including:
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Memory (working memory, short-term recall)</li>
                        <li>Attention (sustained attention, selective attention)</li>
                        <li>Processing speed</li>
                        <li>Executive function (planning, decision-making)</li>
                        <li>Verbal fluency</li>
                      </ul>
                      The assessment takes about 15-20 minutes to complete and provides a detailed breakdown of your performance across these domains, compared to age-matched norms when available.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Brain Health */}
          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brain Health</CardTitle>
                <CardDescription>Questions about cognitive health and function</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="improve-cognition">
                    <AccordionTrigger>Can cognitive training really improve brain function?</AccordionTrigger>
                    <AccordionContent>
                      Research suggests that targeted cognitive training can improve performance on specific cognitive tasks. There is evidence for near transfer (improvement in similar tasks to those trained) and some evidence for far transfer (improvement in untrained tasks) in certain conditions. 
                      
                      <p className="mt-2">The most effective approach combines cognitive training with:</p>
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>Regular physical exercise</li>
                        <li>Proper nutrition</li>
                        <li>Good sleep hygiene</li>
                        <li>Stress management</li>
                        <li>Social engagement</li>
                      </ul>
                      
                      <p className="mt-2">Our Brain Health Library provides comprehensive information on all these factors that contribute to optimal brain health.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="prevent-dementia">
                    <AccordionTrigger>Can brain training prevent dementia or Alzheimer&apos;s disease?</AccordionTrigger>
                    <AccordionContent>
                      While cognitive training alone has not been definitively proven to prevent dementia or Alzheimer&apos;s disease, there is evidence that a multifaceted approach to brain health may reduce risk or delay onset. The concept of &quot;cognitive reserve&quot; suggests that mentally stimulating activities throughout life can help the brain better cope with pathological changes associated with dementia.
                      
                      <p className="mt-2">Brainwise promotes a comprehensive approach to brain health that incorporates multiple evidence-based strategies for maintaining cognitive function as you age. However, we caution against any claims of &quot;preventing&quot; neurodegenerative diseases, as these conditions have complex, multifactorial causes that are still being researched.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="stroke-factors">
                    <AccordionTrigger>What are the main risk factors for stroke?</AccordionTrigger>
                    <AccordionContent>
                      <p>The main modifiable risk factors for stroke include:</p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>High blood pressure (hypertension)</li>
                        <li>Smoking</li>
                        <li>Diabetes</li>
                        <li>High cholesterol</li>
                        <li>Physical inactivity</li>
                        <li>Obesity</li>
                        <li>Excessive alcohol consumption</li>
                        <li>Atrial fibrillation (irregular heartbeat)</li>
                      </ul>
                      
                      <p className="mt-2">Non-modifiable risk factors include:</p>
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>Age (risk increases with age)</li>
                        <li>Sex (risk varies between males and females)</li>
                        <li>Family history</li>
                        <li>Prior stroke or TIA (transient ischemic attack)</li>
                      </ul>
                      
                      <p className="mt-2">Our Stroke Prevention page provides detailed information on these risk factors and strategies to address the modifiable ones.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="normal-aging">
                    <AccordionTrigger>What cognitive changes are normal with aging?</AccordionTrigger>
                    <AccordionContent>
                      <p>Some cognitive changes are a normal part of aging and don&apos;t necessarily indicate disease:</p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Slightly slower processing speed</li>
                        <li>Mild difficulties with multitasking</li>
                        <li>Occasional word-finding difficulties</li>
                        <li>Needing more time to learn new information</li>
                        <li>Mild decline in attention in complex environments</li>
                      </ul>
                      
                      <p className="mt-2">Importantly, these changes are usually mild and don&apos;t significantly impact daily functioning. Many cognitive abilities remain stable or even improve with age, including:</p>
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>Vocabulary and language comprehension</li>
                        <li>Emotional regulation</li>
                        <li>Wisdom and expertise in familiar domains</li>
                        <li>Pattern recognition based on experience</li>
                      </ul>
                      
                      <p className="mt-2">The Brain Health Library section on Brain Aging provides more detailed information on normal cognitive aging versus concerning changes.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Data & Privacy */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>How we handle your information</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="data-collection">
                    <AccordionTrigger>What data does Brainwise collect?</AccordionTrigger>
                    <AccordionContent>
                      <p>Brainwise collects several types of data to provide our services:</p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Account information (name, email, demographic information)</li>
                        <li>Assessment results and cognitive performance data</li>
                        <li>Health information you provide (for the stroke risk calculator)</li>
                        <li>Usage data (how you interact with our platform)</li>
                        <li>Device and browser information</li>
                      </ul>
                      
                      <p className="mt-2">You can review all the data we collect in our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="data-use">
                    <AccordionTrigger>How is my data used?</AccordionTrigger>
                    <AccordionContent>
                      <p>We use your data to:</p>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Provide personalized cognitive assessments and training</li>
                        <li>Track your progress and generate insights</li>
                        <li>Calculate your stroke risk based on provided health factors</li>
                        <li>Improve our platform and develop new features</li>
                        <li>For research purposes (only with anonymized data and your consent)</li>
                      </ul>
                      
                      <p className="mt-2">We never sell your personal data to third parties. Any research use of data is strictly anonymized and aggregated.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="data-security">
                    <AccordionTrigger>How is my health data secured?</AccordionTrigger>
                    <AccordionContent>
                      We take data security very seriously, especially for health-related information:
                      
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>All data is encrypted both in transit and at rest</li>
                        <li>We implement industry-standard security protocols</li>
                        <li>Access to personal data is strictly limited and logged</li>
                        <li>Regular security audits and compliance reviews</li>
                        <li>Secure authentication with options for two-factor authentication</li>
                      </ul>
                      
                      <p className="mt-2">While we are not a healthcare provider and not subject to HIPAA, we still maintain high standards for data protection that align with best practices for health-related applications.</p>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="data-download">
                    <AccordionTrigger>Can I download or delete my data?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you have control over your data:
                      
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>You can download a copy of your data from your Account Settings</li>
                        <li>You can request deletion of specific data points</li>
                        <li>You can delete your entire account and associated data</li>
                      </ul>
                      
                      <p className="mt-2">Data deletion requests are processed within 30 days. Note that some data may be retained for legal and regulatory purposes, but it will no longer be associated with your identity.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="text-center space-y-4 pt-6">
          <p className="text-muted-foreground">Don&apos;t see your question answered here?</p>
          <Button asChild className="micro-bounce">
            <Link href="/contact">Contact Our Support Team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 