"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Brain, 
  Trophy, 
  Clock, 
  SmileIcon, 
  Target, 
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  name: string;
  path: string;
  icon: React.ReactElement;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: "memory-game",
    name: "Memory Game",
    path: "/tools/memory-game",
    icon: <Trophy className="h-5 w-5" />,
    color: "bg-indigo-500 hover:bg-indigo-600"
  },
  {
    id: "meditation",
    name: "Meditation",
    path: "/tools/meditation-timer",
    icon: <Clock className="h-5 w-5" />,
    color: "bg-purple-500 hover:bg-purple-600"
  },
  {
    id: "cognitive-assessment",
    name: "Cognitive Test",
    path: "/tools/cognitive-assessment",
    icon: <Target className="h-5 w-5" />,
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    id: "mood-tracker",
    name: "Mood Tracker",
    path: "/tools/mood-tracker",
    icon: <SmileIcon className="h-5 w-5" />,
    color: "bg-green-500 hover:bg-green-600"
  }
];

export function QuickLaunchWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [recentTools, setRecentTools] = useState<QuickAction[]>([]);
  
  // Load recently used tools from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTools = localStorage.getItem('recentTools');
      if (savedTools) {
        try {
          const parsedTools: string[] = JSON.parse(savedTools);
          const recentToolsData = parsedTools
            .map(id => quickActions.find(action => action.id === id))
            .filter((tool): tool is QuickAction => tool !== undefined)
            .slice(0, 3);
          
          setRecentTools(recentToolsData);
        } catch (error) {
          console.error('Error parsing recent tools:', error);
        }
      }
    }
  }, []);
  
  // Add a tool to recently used
  const addToRecentTools = (id: string) => {
    if (typeof window !== 'undefined') {
      const savedTools = localStorage.getItem('recentTools') || '[]';
      try {
        let parsedTools: string[] = JSON.parse(savedTools);
        
        // Remove the tool if it already exists
        parsedTools = parsedTools.filter(toolId => toolId !== id);
        
        // Add the tool at the beginning
        parsedTools.unshift(id);
        
        // Keep only the 3 most recent tools
        parsedTools = parsedTools.slice(0, 3);
        
        localStorage.setItem('recentTools', JSON.stringify(parsedTools));
        
        // Update the state
        const recentToolsData = parsedTools
          .map(id => quickActions.find(action => action.id === id))
          .filter((tool): tool is QuickAction => tool !== undefined);
        
        setRecentTools(recentToolsData);
      } catch (error) {
        console.error('Error updating recent tools:', error);
      }
    }
  };
  
  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-2 flex flex-col gap-2"
          >
            {quickActions.map((action) => (
              <Link
                key={action.id}
                href={action.path}
                onClick={() => addToRecentTools(action.id)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg text-white shadow-lg",
                    action.color
                  )}
                >
                  {action.icon}
                  <span className="font-medium">{action.name}</span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={toggleWidget}
        className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              className="relative"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Brain className="h-6 w-6" />
              {recentTools.length > 0 && (
                <motion.div 
                  className="absolute top-0 right-0 -mr-1 -mt-1 w-3 h-3 bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {/* Recent tools drawer - only visible when the main menu is closed */}
      <AnimatePresence>
        {!isOpen && recentTools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 mb-2 border"
          >
            <div className="text-xs text-muted-foreground mb-2 px-2">Recent Tools</div>
            <div className="flex flex-col gap-1.5">
              {recentTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  onClick={() => addToRecentTools(tool.id)}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tool.color.split(' ')[0]}`}>
                      {tool.icon}
                    </div>
                    <span className="text-sm font-medium">{tool.name}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 