import { Chatbot } from "@/components/chatbot";
import { SampleQuestionButton } from "./client-components";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Brain Health Chatbot | Brainwise",
  description: "Chat with our AI assistant about brain health, neurological conditions, and cognitive wellness.",
};

// Define the sample questions with string identifiers instead of component functions
const sampleQuestions = [
  { iconName: "Brain", text: "What are the best foods for brain health?" },
  { iconName: "Heart", text: "How does sleep affect brain health?" },
  { iconName: "Activity", text: "What exercises benefit the brain most?" },
  { iconName: "BookOpen", text: "How can I improve memory and focus?" },
  { iconName: "Zap", text: "What are early signs of cognitive decline?" },
  { iconName: "Pill", text: "What supplements are good for brain health?" },
  { iconName: "Brain", text: "What causes strokes and how can I prevent them?" },
  { iconName: "Clock", text: "How can I maintain brain health as I age?" }
];

export default function ChatbotPage() {
  return (
    <div className="container py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">Brain Health Assistant</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Ask questions about brain health, neurological conditions, and cognitive wellness
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="lg:w-3/4">
          <Chatbot />
        </div>
        
        <div className="lg:w-1/4">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4 pb-2 border-b">Popular Questions</h2>
              <div className="flex flex-col gap-2">
                {sampleQuestions.map((question, index) => (
                  <SampleQuestionButton 
                    key={index} 
                    question={question} 
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto border-t border-border pt-6">
        <p>
          This AI assistant provides educational information only and is not a substitute for professional medical advice.
          Always consult with healthcare professionals for medical concerns.
        </p>
      </div>
    </div>
  );
} 