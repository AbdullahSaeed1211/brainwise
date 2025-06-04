"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Home, Settings } from "lucide-react";

interface GestureHandlerProps {
  children: React.ReactNode;
}

export function MobileGestureHandler({ children }: GestureHandlerProps) {
  const router = useRouter();
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  
  // Navigation paths in order
  const navigationPaths = [
    "/",
    "/tools",
    "/tools/memory-game",
    "/tools/cognitive-assessment",
    "/tools/mood-tracker",
    "/tools/meditation-timer",
    "/stroke-prediction",
    "/dashboard",
    "/profile"
  ];
  
  // Determine if we're running on a mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Get current path
  const [currentPath, setCurrentPath] = useState("");
  
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  
  // Handle navigation
  const navigateToNext = () => {
    const currentIndex = navigationPaths.indexOf(currentPath);
    if (currentIndex !== -1 && currentIndex < navigationPaths.length - 1) {
      router.push(navigationPaths[currentIndex + 1]);
      setCurrentPath(navigationPaths[currentIndex + 1]);
    }
  };
  
  const navigateToPrevious = () => {
    const currentIndex = navigationPaths.indexOf(currentPath);
    if (currentIndex !== -1 && currentIndex > 0) {
      router.push(navigationPaths[currentIndex - 1]);
      setCurrentPath(navigationPaths[currentIndex - 1]);
    }
  };
  
  const navigateToHome = () => {
    router.push("/");
    setCurrentPath("/");
  };
  
  const navigateToSettings = () => {
    router.push("/profile");
    setCurrentPath("/profile");
  };
  
  // Handle touch gestures
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isMobile) {
        navigateToNext();
      }
    },
    onSwipedRight: () => {
      if (isMobile) {
        navigateToPrevious();
      }
    },
    onSwipedUp: () => {
      if (isMobile) {
        navigateToHome();
      }
    },
    onSwipedDown: () => {
      if (isMobile) {
        navigateToSettings();
      }
    },
    // Show indicators during swiping
    onSwipeStart: (eventData) => {
      if (isMobile) {
        if (eventData.dir === "Left") {
          setShowRightIndicator(true);
        } else if (eventData.dir === "Right") {
          setShowLeftIndicator(true);
        }
      }
    },
    onSwiped: () => {
      if (isMobile) {
        setShowLeftIndicator(false);
        setShowRightIndicator(false);
      }
    },
    // Configure swipe parameters
    delta: 50,                     // Minimum swipe distance before active
    preventScrollOnSwipe: false,   // Don't prevent scrolling
    trackTouch: true,             // Track touch events
    trackMouse: false,            // Don't track mouse events
    rotationAngle: 0,              // Rotation angle
  });
  
  if (!isMobile) {
    // If not on mobile, just render children without the gesture handler
    return <>{children}</>;
  }
  
  return (
    <div {...handlers} className="relative w-full h-full">
      {/* Left Navigation Indicator */}
      <AnimatePresence>
        {showLeftIndicator && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.7, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-1/2 left-2 z-50 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Right Navigation Indicator */}
      <AnimatePresence>
        {showRightIndicator && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.7, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-1/2 right-2 z-50 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Render children */}
      {children}
      
      {/* Gesture guide - shown first time */}
      <div className="hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
        <div className="bg-card rounded-xl p-6 max-w-md w-full shadow-xl">
          <h2 className="text-xl font-bold mb-4">Swipe Navigation</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <ChevronLeft className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Swipe Right</div>
                <div className="text-sm text-muted-foreground">Go to previous screen</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Swipe Left</div>
                <div className="text-sm text-muted-foreground">Go to next screen</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Swipe Up</div>
                <div className="text-sm text-muted-foreground">Go to home</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Swipe Down</div>
                <div className="text-sm text-muted-foreground">Go to profile</div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <button className="w-full py-2 bg-primary text-white rounded-md">
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 