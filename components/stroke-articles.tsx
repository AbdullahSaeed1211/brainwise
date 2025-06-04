"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Articles data
const articles = [
  {
    id: "prevention",
    title: "Stroke Prevention: Key Strategies",
    description: "Practical ways to reduce your risk of stroke",
    content: `
      <h3>Understanding Stroke Prevention</h3>
      <p>Up to 80% of strokes are preventable through lifestyle changes and medical interventions. The key is to address risk factors early and consistently.</p>
      
      <h4>Manage Blood Pressure</h4>
      <p>High blood pressure is the leading cause of stroke. Aim to keep your blood pressure below 120/80 mm Hg. Regular monitoring, medication if prescribed, and lifestyle changes can help maintain healthy blood pressure levels.</p>
      
      <h4>Adopt a Brain-Healthy Diet</h4>
      <p>The Mediterranean diet has been shown to reduce stroke risk by up to 20%. Focus on:</p>
      <ul>
        <li>Fruits and vegetables (5+ servings daily)</li>
        <li>Whole grains instead of refined carbohydrates</li>
        <li>Lean proteins, especially fish rich in omega-3 fatty acids</li>
        <li>Healthy fats like olive oil, avocados, and nuts</li>
        <li>Limiting sodium to less than 2,300mg daily</li>
        <li>Reducing processed foods and added sugars</li>
      </ul>
      
      <h4>Exercise Regularly</h4>
      <p>Physical activity reduces stroke risk by improving circulation, helping control blood pressure, and maintaining healthy weight. Aim for at least 150 minutes of moderate-intensity exercise per week, such as brisk walking, swimming, or cycling.</p>
      
      <h4>Quit Smoking</h4>
      <p>Smoking doubles the risk of stroke. Quitting can reduce your risk to that of a nonsmoker within 5 years. Seek support through cessation programs, nicotine replacement therapy, or medications.</p>
      
      <h4>Limit Alcohol Consumption</h4>
      <p>Excessive alcohol intake raises blood pressure and can increase stroke risk. If you drink, limit consumption to no more than one drink per day for women and two for men.</p>
      
      <h4>Manage Other Health Conditions</h4>
      <p>Conditions like diabetes, high cholesterol, and atrial fibrillation significantly increase stroke risk. Work with your healthcare provider to manage these conditions effectively.</p>
      
      <h4>Regular Health Check-ups</h4>
      <p>Regular medical check-ups can identify risk factors before they lead to stroke. Don't skip appointments, and follow your doctor's recommendations for screenings and tests.</p>
    `,
    author: "Dr. Sarah Johnson",
    publishDate: "February 15, 2023",
    readTime: "6 min read"
  },
  {
    id: "signs",
    title: "Recognizing Stroke Signs: Act FAST",
    description: "How to identify a stroke and respond quickly",
    content: `
      <h3>The Importance of Quick Recognition</h3>
      <p>During a stroke, every minute counts. For each minute a stroke goes untreated, approximately 1.9 million brain cells die. Recognizing the signs and acting quickly can mean the difference between recovery and permanent disability.</p>
      
      <h4>The FAST Method</h4>
      <p>The FAST acronym is an easy way to remember the most common stroke symptoms:</p>
      <ul>
        <li><strong>F - Face Drooping:</strong> Does one side of the face droop or is it numb? Ask the person to smile. Is the smile uneven or lopsided?</li>
        <li><strong>A - Arm Weakness:</strong> Is one arm weak or numb? Ask the person to raise both arms. Does one arm drift downward?</li>
        <li><strong>S - Speech Difficulty:</strong> Is speech slurred? Is the person unable to speak or hard to understand? Ask the person to repeat a simple sentence like "The sky is blue." Can they repeat it correctly?</li>
        <li><strong>T - Time to Call Emergency Services:</strong> If someone shows any of these symptoms, even if they go away, call emergency services immediately and note the time when symptoms first appeared.</li>
      </ul>
      
      <h4>Additional Warning Signs</h4>
      <p>While FAST covers the most common signs, other stroke symptoms can include:</p>
      <ul>
        <li>Sudden numbness or weakness of the leg</li>
        <li>Sudden confusion or trouble understanding</li>
        <li>Sudden trouble seeing in one or both eyes</li>
        <li>Sudden trouble walking, dizziness, loss of balance or coordination</li>
        <li>Sudden severe headache with no known cause</li>
      </ul>
      
      <h4>Types of Stroke</h4>
      <p>There are three main types of stroke, and recognizing the differences can help in understanding treatment approaches:</p>
      <ol>
        <li><strong>Ischemic Stroke:</strong> Caused by a clot blocking blood flow to the brain (87% of strokes)</li>
        <li><strong>Hemorrhagic Stroke:</strong> Caused by a ruptured blood vessel bleeding into the brain (13% of strokes)</li>
        <li><strong>Transient Ischemic Attack (TIA):</strong> Often called a "mini-stroke," caused by a temporary clot that resolves on its own but serves as a warning sign</li>
      </ol>
      
      <h4>What to Do if You Suspect a Stroke</h4>
      <ol>
        <li>Call emergency services immediately (911 in the US)</li>
        <li>Note the time when symptoms started</li>
        <li>Perform CPR if the person is unconscious and not breathing normally</li>
        <li>Do not give the person anything to eat or drink</li>
        <li>Do not give aspirin as it can worsen hemorrhagic strokes</li>
      </ol>
    `,
    author: "Dr. Michael Chen",
    publishDate: "March 21, 2023",
    readTime: "5 min read"
  },
  {
    id: "treatment",
    title: "Modern Stroke Treatment Approaches",
    description: "Current medical interventions for stroke patients",
    content: `
      <h3>The Evolution of Stroke Treatment</h3>
      <p>Stroke treatment has evolved dramatically in recent decades, with new technologies and approaches significantly improving outcomes for patients.</p>
      
      <h4>Emergency Treatments for Ischemic Stroke</h4>
      <p>When blood flow to the brain is blocked by a clot, quick action is essential:</p>
      <ul>
        <li><strong>IV thrombolysis (tPA):</strong> A clot-busting medication that can be given up to 4.5 hours after symptom onset for eligible patients</li>
        <li><strong>Mechanical thrombectomy:</strong> A catheter-based procedure to physically remove large clots, which can be effective up to 24 hours after stroke onset in selected patients</li>
      </ul>
      
      <h4>Treatments for Hemorrhagic Stroke</h4>
      <p>When a blood vessel ruptures in the brain:</p>
      <ul>
        <li><strong>Blood pressure control:</strong> Careful management to prevent further bleeding</li>
        <li><strong>Surgery:</strong> In some cases, procedures to repair blood vessels or reduce pressure on the brain</li>
        <li><strong>Coiling and clipping:</strong> Techniques to close off ruptured aneurysms</li>
      </ul>
      
      <h4>Post-Stroke Care and Rehabilitation</h4>
      <p>Recovery begins as soon as the stroke is treated:</p>
      <ul>
        <li><strong>Early mobilization:</strong> Getting patients moving as soon as medically possible</li>
        <li><strong>Physical therapy:</strong> To restore movement and strength</li>
        <li><strong>Occupational therapy:</strong> To relearn daily activities and adapt to new limitations</li>
        <li><strong>Speech therapy:</strong> For language and swallowing difficulties</li>
        <li><strong>Cognitive therapy:</strong> To address memory, attention, and problem-solving issues</li>
      </ul>
      
      <h4>Medications for Secondary Prevention</h4>
      <p>Preventing another stroke is crucial:</p>
      <ul>
        <li><strong>Antiplatelet medications:</strong> Like aspirin, to prevent clots from forming</li>
        <li><strong>Anticoagulants:</strong> For patients with atrial fibrillation or other clotting disorders</li>
        <li><strong>Statins:</strong> To manage cholesterol levels</li>
        <li><strong>Antihypertensives:</strong> To control blood pressure</li>
      </ul>
      
      <h4>Emerging Treatments</h4>
      <p>Research continues to advance stroke care:</p>
      <ul>
        <li><strong>Neuroprotective agents:</strong> Medications that may help protect brain cells during a stroke</li>
        <li><strong>Stem cell therapy:</strong> Experimental treatments to regenerate damaged brain tissue</li>
        <li><strong>Brain-computer interfaces:</strong> To help severely disabled patients communicate</li>
        <li><strong>Virtual reality rehabilitation:</strong> Interactive technology to enhance traditional therapy</li>
      </ul>
      
      <h4>The Future of Stroke Care</h4>
      <p>Advances in telemedicine, artificial intelligence, and mobile stroke units are transforming how quickly and effectively stroke care can be delivered, particularly in rural areas.</p>
    `,
    author: "Dr. Elizabeth Park, Neurologist",
    publishDate: "April 10, 2023",
    readTime: "8 min read"
  },
  {
    id: "recovery",
    title: "Life After Stroke: Recovery and Adaptation",
    description: "Understanding the recovery process and how to adapt",
    content: `
      <h3>The Recovery Journey</h3>
      <p>Recovery from stroke is a highly individualized process that can continue for months or years after the initial event. Understanding this journey can help patients and caregivers set realistic expectations and maintain hope.</p>
      
      <h4>Phases of Recovery</h4>
      <ol>
        <li><strong>Acute Phase (0-7 days):</strong> Medical stabilization in a hospital setting</li>
        <li><strong>Early Recovery (1-3 months):</strong> Period of fastest neurological recovery and intensive rehabilitation</li>
        <li><strong>Late Recovery (3-6 months):</strong> Continued improvement but typically at a slower pace</li>
        <li><strong>Maintenance Phase (6+ months):</strong> Focus on maintaining gains and adapting to permanent changes</li>
      </ol>
      
      <h4>The Neuroplasticity Window</h4>
      <p>The brain has an amazing ability to reorganize itself after injury, known as neuroplasticity. The first 3-6 months after a stroke offer a critical window when the brain is most receptive to rehabilitation efforts, but improvements can continue for years with consistent effort.</p>
      
      <h4>Emotional and Psychological Recovery</h4>
      <p>Up to one-third of stroke survivors experience depression, and many others face anxiety, frustration, and grief. These emotional challenges are a normal part of recovery and should be addressed as part of a comprehensive treatment plan. Consider:</p>
      <ul>
        <li>Individual or group counseling</li>
        <li>Support groups specific to stroke survivors</li>
        <li>Mindfulness practices and stress reduction techniques</li>
        <li>Appropriate medication when recommended</li>
      </ul>
      
      <h4>Adapting to New Realities</h4>
      <p>Many stroke survivors face some level of permanent change. Successful adaptation involves:</p>
      <ul>
        <li><strong>Home modifications:</strong> Ramps, grab bars, adjusted counter heights</li>
        <li><strong>Assistive devices:</strong> Mobility aids, communication devices, adaptive utensils</li>
        <li><strong>Daily routine adjustments:</strong> Allowing extra time, breaking tasks into smaller steps</li>
        <li><strong>Role changes:</strong> Redefining relationships and responsibilities within families</li>
      </ul>
      
      <h4>Returning to Life Activities</h4>
      <p>With appropriate support, many stroke survivors can return to meaningful activities:</p>
      <ul>
        <li><strong>Work:</strong> 55% of stroke survivors under 65 return to some form of employment</li>
        <li><strong>Driving:</strong> Many can return to driving after evaluation and possibly vehicle modification</li>
        <li><strong>Recreation:</strong> Adaptive sports and hobbies can provide enjoyment and purpose</li>
        <li><strong>Intimacy:</strong> Relationships can continue with open communication and adaptation</li>
      </ul>
      
      <h4>For Caregivers</h4>
      <p>Supporting a stroke survivor can be both rewarding and challenging. Remember:</p>
      <ul>
        <li>Take care of your own health and well-being</li>
        <li>Accept help from others when offered</li>
        <li>Connect with caregiver support groups</li>
        <li>Learn about respite care options</li>
        <li>Celebrate small victories in the recovery process</li>
      </ul>
    `,
    author: "Dr. Robert Wilson and Maria Sanchez, OT",
    publishDate: "May 7, 2023",
    readTime: "7 min read"
  }
];

export function StrokeArticles() {
  const [activeTab, setActiveTab] = useState(articles[0].id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Stroke Education Resources</h2>
        <p className="text-muted-foreground">
          Learn about stroke prevention, recognition, and treatment options.
        </p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          {articles.map((article) => (
            <TabsTrigger key={article.id} value={article.id}>
              {article.title.split(':')[0]}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {articles.map((article) => (
          <TabsContent key={article.id} value={article.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <span>{article.author}</span>
                  <span className="mx-2">•</span>
                  <span>{article.publishDate}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => window.print()}>
                  Print Article
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
        <h3 className="font-medium mb-2">Important Note</h3>
        <p className="text-sm text-muted-foreground">
          This information is provided for educational purposes only and is not a substitute for professional medical advice. 
          Always consult with qualified healthcare providers for personalized guidance related to stroke prevention, 
          diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
} 