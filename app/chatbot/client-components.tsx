"use client";

import React from "react";
import { Brain, Heart, Activity, BookOpen, Zap, Pill, Clock } from "lucide-react";

// Define a type for the question prop
interface Question {
  iconName: string;
  text: string;
}

// Define props interface with proper types
interface SampleQuestionButtonProps {
  question: Question;
}

// Create client components for any interactive elements
export function SampleQuestionButton({ question }: SampleQuestionButtonProps) {
  // Render the icon based on the name
  const renderIcon = () => {
    switch (question.iconName) {
      case "Brain":
        return <Brain className="h-4 w-4 flex-shrink-0" />;
      case "Heart":
        return <Heart className="h-4 w-4 flex-shrink-0" />;
      case "Activity":
        return <Activity className="h-4 w-4 flex-shrink-0" />;
      case "BookOpen":
        return <BookOpen className="h-4 w-4 flex-shrink-0" />;
      case "Zap":
        return <Zap className="h-4 w-4 flex-shrink-0" />;
      case "Pill":
        return <Pill className="h-4 w-4 flex-shrink-0" />;
      case "Clock":
        return <Clock className="h-4 w-4 flex-shrink-0" />;
      default:
        return null;
    }
  };
  
  // Add a proper onClick handler inside the client component
  const handleClick = () => {
    // Find the textarea in the Chatbot component
    const textArea = document.querySelector('#message-input') as HTMLTextAreaElement;
    
    if (textArea) {
      // Set the value to the question text
      textArea.value = question.text;
      
      // Trigger a change event so React state updates
      const event = new Event('input', { bubbles: true });
      textArea.dispatchEvent(event);
      
      // Optional: Submit the form
      const submitButton = textArea.form?.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.click();
      }
    }
  };
  
  return (
    <button 
      className="text-left py-2 px-3 text-sm rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors w-full flex items-start gap-2"
      onClick={handleClick}
    >
      <span className="mt-0.5">{renderIcon()}</span>
      <span>{question.text}</span>
    </button>
  );
} 