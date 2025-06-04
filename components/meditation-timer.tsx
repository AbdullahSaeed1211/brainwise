"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, RotateCcw, Volume2, VolumeX, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Preset {
  name: string;
  duration: number;
  description?: string;
}

const presets: Preset[] = [
  { name: "Quick Focus", duration: 2, description: "A brief mindfulness moment" },
  { name: "Brain Break", duration: 5, description: "Short rest between tasks" },
  { name: "Stress Relief", duration: 10, description: "Reduce anxiety and tension" },
  { name: "Deep Focus", duration: 15, description: "Extended concentration session" },
  { name: "Full Practice", duration: 20, description: "Complete meditation practice" }
];

const backgroundSounds = [
  { id: "rain", name: "Rainfall", src: "/sounds/rain.mp3" },
  { id: "forest", name: "Forest", src: "/sounds/forest.mp3" },
  { id: "waves", name: "Ocean Waves", src: "/sounds/waves.mp3" },
  { id: "white-noise", name: "White Noise", src: "/sounds/white-noise.mp3" }
];

export function MeditationTimer() {
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("timer");
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle timer start/pause
  const toggleTimer = () => {
    setIsRunning(!isRunning);
    
    if (!isRunning && timeLeft === 0) {
      // Reset timer if it's finished
      setTimeLeft(duration * 60);
    }
  };
  
  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setShowCompletionMessage(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  // Apply a preset
  const applyPreset = (preset: Preset) => {
    setDuration(preset.duration);
    setTimeLeft(preset.duration * 60);
    resetTimer();
    
    // Add brief loading state when applying preset
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };
  
  // Toggle background sound
  const toggleSound = (soundId: string) => {
    if (activeSound === soundId) {
      setActiveSound(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    } else {
      setActiveSound(soundId);
      const sound = backgroundSounds.find(s => s.id === soundId);
      
      if (sound && typeof window !== "undefined") {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        // In a real app, we'd have actual audio files
        // Here we're simulating the audio
        audioRef.current = new Audio(sound.src);
        audioRef.current.loop = true;
        audioRef.current.volume = volume / 100;
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
      }
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
    
    if (vol === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (!isMuted) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = volume / 100;
      }
    }
    
    setIsMuted(!isMuted);
  };
  
  // Update timer based on duration selection
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);
  
  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer completed
            setIsRunning(false);
            setCompletedSessions(prev => prev + 1);
            setShowCompletionMessage(true);
            
            // Play completion sound
            const completionSound = new Audio("/sounds/bell.mp3");
            completionSound.play().catch(e => console.error("Audio playback failed", e));
            
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft]);
  
  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Calculate progress percentage
  const progressPercentage = duration > 0 ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;
  
  // Get total meditation minutes
  const totalMinutes = completedSessions * duration;
  
  const renderTimerSkeleton = () => (
    <div className="space-y-4 pt-4">
      <div className="relative">
        <div className="w-48 h-48 mx-auto relative">
          <Skeleton className="w-48 h-48 rounded-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mt-6">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-full rounded-full" />
      </div>
    </div>
  );
  
  const renderPresetsSkeleton = () => (
    <div className="space-y-3 py-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16 w-full mx-2" />
      ))}
    </div>
  );
  
  const renderSoundsSkeleton = () => (
    <div className="p-6 space-y-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
        
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
        
        <div className="mt-4 px-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-5 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Meditation Timer
          </CardTitle>
          <CardDescription>
            Mindfulness meditation to improve focus and reduce stress
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 border-b">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="timer" className="flex-1">Timer</TabsTrigger>
                <TabsTrigger value="presets" className="flex-1">Presets</TabsTrigger>
                <TabsTrigger value="sounds" className="flex-1">Sounds</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="timer" className="p-6 space-y-4">
              {isLoading ? (
                renderTimerSkeleton()
              ) : showCompletionMessage ? (
                <div className="text-center py-6">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Session Complete!</h3>
                  <p className="text-muted-foreground mb-4">
                    Great job! You&apos;ve completed a {duration}-minute meditation session.
                  </p>
                  <Button onClick={resetTimer}>Start Another Session</Button>
                </div>
              ) : (
                <>
                  <div className="relative pt-4">
                    {/* Timer circle */}
                    <div className="w-48 h-48 mx-auto relative">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="var(--muted)"
                          strokeWidth="2"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={283} // Circumference of circle with r=45
                          strokeDashoffset={283 - (283 * progressPercentage / 100)}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-medium">{formatTime(timeLeft)}</span>
                        <span className="text-xs text-muted-foreground">{duration} min session</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetTimer}
                      disabled={isRunning && timeLeft === duration * 60}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={toggleTimer}
                      size="lg"
                      className="px-8"
                    >
                      {isRunning ? 
                        <Pause className="h-4 w-4 mr-2" /> : 
                        <Play className="h-4 w-4 mr-2" />
                      }
                      {isRunning ? "Pause" : timeLeft === 0 ? "Restart" : "Start"}
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Session Duration</span>
                      <span className="text-sm">{duration} minutes</span>
                    </div>
                    <Slider
                      value={[duration]}
                      min={1}
                      max={30}
                      step={1}
                      onValueChange={(value: number[]) => setDuration(value[0])}
                      disabled={isRunning}
                    />
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="presets" className="space-y-1 py-2">
              {isLoading ? (
                renderPresetsSkeleton()
              ) : (
                presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="w-full text-left px-6 py-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">{preset.description}</div>
                      </div>
                      <Badge variant="outline">{preset.duration} min</Badge>
                    </div>
                  </button>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="sounds" className="p-6 space-y-4">
              {isLoading ? (
                renderSoundsSkeleton()
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium">Background Sounds</span>
                    <button
                      onClick={toggleMute}
                      className="p-1 rounded-md hover:bg-muted"
                    >
                      {isMuted ? 
                        <VolumeX className="h-4 w-4 text-muted-foreground" /> : 
                        <Volume2 className="h-4 w-4 text-primary" />
                      }
                    </button>
                  </div>
                  
                  {backgroundSounds.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => toggleSound(sound.id)}
                      className={`flex items-center justify-between w-full p-3 rounded-md transition-colors ${
                        activeSound === sound.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                      }`}
                    >
                      <span>{sound.name}</span>
                      {activeSound === sound.id && (
                        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                  ))}
                  
                  <div className="mt-4 px-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        value={[volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t p-6 flex justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Meditation Stats</span>
            <span className="font-medium">{completedSessions} sessions completed</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Total Time</span>
            <span className="font-medium">{totalMinutes} minutes</span>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-sm">
        <h3 className="font-medium mb-2">Brain Health Benefits</h3>
        <ul className="space-y-1 text-muted-foreground">
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
            <span>Reduces stress hormones that can damage brain cells</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
            <span>Increases gray matter in regions involved in memory and attention</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
            <span>Improves focus and cognitive flexibility</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
            <span>Enhances creativity and problem-solving abilities</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 