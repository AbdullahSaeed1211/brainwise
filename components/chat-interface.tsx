"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your Brain Health Assistant. How can I help you today?",
    role: "assistant",
    timestamp: new Date(),
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages when new messages are added
  // But maintain scroll position when user is scrolling up
  useEffect(() => {
    // Get the container and check if user is at or near the bottom
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const isAtBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 100;
    
    // Only auto-scroll if user is already at the bottom
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // In a real app, this would call an API endpoint
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Sample responses based on keywords
      let responseContent = "I'm not sure how to respond to that. Could you please ask about stroke prevention, risk factors, or brain health?";
      
      const lowerCaseInput = input.toLowerCase();
      
      if (lowerCaseInput.includes("stroke") && lowerCaseInput.includes("prevent")) {
        responseContent = "To prevent strokes, consider these key strategies: maintain a healthy blood pressure, exercise regularly, eat a balanced diet low in salt and saturated fats, avoid smoking, limit alcohol consumption, and manage conditions like diabetes and high cholesterol. Regular check-ups with your healthcare provider are also essential.";
      } else if (lowerCaseInput.includes("risk factor")) {
        responseContent = "Major risk factors for stroke include high blood pressure, smoking, diabetes, high cholesterol, obesity, physical inactivity, heart disease, family history of stroke, age (risk increases with age), and previous stroke or TIA (transient ischemic attack). Some of these factors can be controlled through lifestyle changes and medication.";
      } else if (lowerCaseInput.includes("symptom")) {
        responseContent = "Common stroke symptoms include sudden numbness or weakness in the face, arm, or leg (especially on one side), confusion, trouble speaking or understanding speech, vision problems, dizziness or loss of balance, and severe headache with no known cause. Remember the acronym FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services.";
      } else if (lowerCaseInput.includes("treatment")) {
        responseContent = "Stroke treatment depends on the type of stroke. For ischemic strokes (caused by blood clots), treatments include clot-dissolving drugs like tPA if administered within 4.5 hours, and mechanical thrombectomy to physically remove large clots. For hemorrhagic strokes (bleeding in the brain), treatment focuses on controlling bleeding and reducing pressure in the brain. Rehabilitation is crucial for recovery after any stroke.";
      } else if (lowerCaseInput.includes("diet") || lowerCaseInput.includes("food")) {
        responseContent = "A brain-healthy diet includes foods rich in omega-3 fatty acids (like fatty fish), antioxidants (found in colorful fruits and vegetables), and whole grains. The Mediterranean and DASH diets are particularly beneficial for brain health and stroke prevention. Limit salt, saturated fats, and processed foods, which can contribute to high blood pressure and other stroke risk factors.";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col h-[600px]">
      <div className="p-4 border-b">
        <h3 className="font-medium">Chat with Brain Health Assistant</h3>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        tabIndex={0} // Make container focusable for keyboard accessibility
        aria-live="polite" // Announce new messages
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex flex-col max-w-[80%] rounded-lg p-4",
              message.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            )}
            role="article"
            aria-label={`${message.role} message`}
          >
            <p>{message.content}</p>
            <span className="text-xs mt-2 opacity-70">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        
        {isLoading && (
          <div 
            className="flex items-center space-x-2 max-w-[80%] rounded-lg p-4 bg-muted"
            aria-live="assertive"
            role="status"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce delay-75" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce delay-150" />
            </div>
            <span className="text-sm text-muted-foreground">Thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question about brain health..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
            <span className="sr-only">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
} 