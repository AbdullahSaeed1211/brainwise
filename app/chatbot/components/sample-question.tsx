"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

// Define the proper type for the question prop
interface QuestionProps {
  question: {
    icon: LucideIcon;
    text: string;
  };
}

export function SampleQuestionButton({ question }: QuestionProps) {
  const Icon = question.icon;
  
  // Handle the click entirely within the client component
  const handleClick = () => {
    // You can modify this to handle the question in whatever way you need
    console.log("Question clicked:", question.text);
    
    // For example, you might want to add the question to the chat
    // This depends on how your chatbot component works
    const messageInput = document.querySelector('#message-input') as HTMLInputElement;
    if (messageInput) {
      messageInput.value = question.text;
      // Optional: Submit the form if needed
      messageInput.form?.requestSubmit();
    }
  };
  
  return (
    <button 
      className="inline-flex items-center px-3 py-1.5 text-sm rounded-full bg-secondary/50 hover:bg-secondary/70 transition-colors"
      onClick={handleClick}
    >
      {Icon && <Icon className="mr-1 h-3.5 w-3.5" />}
      {question.text}
    </button>
  );
} 