import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, LifeBuoy, Mail, MessageSquare, Phone, Users, BookOpen, HeartPulse } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Help & Support | Brain.ai",
  description: "Get help, read our FAQs, and learn how to get the most out of the Brain.ai platform",
};

export default function HelpPage() {
  const faqs = [
    {
      question: "How do the brain training games help improve cognitive function?",
      answer: "Our brain training games target specific cognitive domains like memory, attention, and processing speed. Regular practice creates new neural connections and strengthens existing ones, improving overall brain function and resilience."
    },
    {
      question: "How accurate is the stroke risk assessment?",
      answer: "Our stroke risk assessment is based on established medical risk factors and validated prediction models. While it provides a good indication of relative risk, it should be used as a conversation starter with healthcare professionals rather than a definitive diagnosis."
    },
    {
      question: "Is my health data secure and private?",
      answer: "Yes, we take data privacy seriously. All health information is encrypted, stored securely, and never shared with third parties without explicit consent. You can read our complete privacy policy for more details."
    },
    {
      question: "How often should I use the brain training tools?",
      answer: "For optimal results, we recommend using the tools for 10-15 minutes daily. Consistent practice is more effective than occasional longer sessions."
    },
    {
      question: "Can brain training prevent dementia or Alzheimer's disease?",
      answer: "While research suggests that cognitive stimulation may help reduce risk or delay onset of cognitive decline, brain training alone cannot prevent conditions like dementia. A holistic approach including physical exercise, proper nutrition, social engagement, and cognitive stimulation offers the best protection."
    },
    {
      question: "How do I track my progress?",
      answer: "Your progress is automatically tracked in the 'Progress' section of your dashboard. You can view trends over time, see improvements in different cognitive areas, and get personalized recommendations based on your performance."
    },
    {
      question: "Can I use Brain.ai on my mobile device?",
      answer: "Yes, Brain.ai is fully responsive and works on smartphones and tablets. For the best experience with our cognitive games, we recommend using a tablet or desktop computer."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your account settings. Navigate to 'Profile' > 'Subscription' and click on 'Cancel Subscription'. Your access will continue until the end of your current billing period."
    }
  ];

  const gettingStartedGuides = [
    {
      title: "Complete Your Profile",
      description: "Set up your personal details and health information to get personalized recommendations.",
      icon: <Users className="h-5 w-5" />,
      link: "/profile"
    },
    {
      title: "Take Your First Assessment",
      description: "Complete a cognitive assessment to establish your baseline scores.",
      icon: <BookOpen className="h-5 w-5" />,
      link: "/tools"
    },
    {
      title: "Try Brain Training Games",
      description: "Start with beginner-friendly games to improve attention and memory.",
      icon: <HeartPulse className="h-5 w-5" />,
      link: "/cognitive-games"
    }
  ];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Find answers to common questions and learn how to get the most out of Brain.ai
          </p>
        </div>

        <Tabs defaultValue="faq" className="w-full">
          <div className="flex justify-center overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="mb-8">
              <TabsTrigger value="faq" className="text-sm sm:text-base px-3 sm:px-4">
                <MessageSquare className="h-4 w-4 mr-1.5" />
                <span>FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-sm sm:text-base px-3 sm:px-4">
                <Mail className="h-4 w-4 mr-1.5" />
                <span>Contact Us</span>
              </TabsTrigger>
              <TabsTrigger value="guides" className="text-sm sm:text-base px-3 sm:px-4">
                <LifeBuoy className="h-4 w-4 mr-1.5" />
                <span>Getting Started</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="faq" className="space-y-6">
            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <h2 className="text-2xl font-semibold tracking-tight mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-lg font-medium text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Support
                  </CardTitle>
                  <CardDescription>
                    Send us an email and we&apos;ll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">For general inquiries, technical issues, or account questions</p>
                  <Link href="/contact" className="w-full">
                    <Button variant="default" className="w-full">
                      Contact Form
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Or email us directly at: <span className="font-medium">support@brain-ai.com</span></p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Phone Support
                  </CardTitle>
                  <CardDescription>
                    Available Monday to Friday, 9am - 5pm EST
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">For urgent issues or if you prefer to speak with a team member</p>
                  <div className="text-center py-4">
                    <p className="font-semibold text-lg">1-800-BRAIN-AI</p>
                    <p className="text-sm text-muted-foreground mt-1">(1-800-272-4624)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <h2 className="text-2xl font-semibold tracking-tight mb-4">Getting Started with Brain.ai</h2>
                <p className="text-muted-foreground mb-6">
                  Follow these steps to get the most out of our platform and establish your brain health routine.
                </p>
                
                <div className="grid gap-6 md:grid-cols-3">
                  {gettingStartedGuides.map((guide, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {guide.icon}
                          {guide.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
                        <Link href={guide.link}>
                          <Button variant="outline" size="sm" className="w-full">
                            Get Started
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-lg bg-muted">
                  <h3 className="font-medium mb-2">Need more help?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check out our detailed video tutorials and in-depth guides in our knowledge base.
                  </p>
                  <Link href="/faq">
                    <Button variant="secondary" size="sm">
                      View Knowledge Base
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 