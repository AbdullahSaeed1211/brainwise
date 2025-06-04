"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import {
  Menu,
  ChevronDown,
  Library,
  ScrollText,
  Heart,
  MessagesSquare,
  Gamepad2,
  LineChart,
  FileText,
  Target,
  MessageSquare,
  CalendarClock,
  Blocks,
  Shield,
  Stethoscope,
  BrainCircuit,
  Home,
  LayoutDashboard,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { 
  Brain, 
  X, 
  BarChart3, 
  HelpCircle,
  Mail,
 
} from "lucide-react";

// Replace the flat nav items with categorized items
const mainNavItems = [
  { name: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
  { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: "AI Chatbot", href: "/chatbot", icon: <MessagesSquare className="h-4 w-4" /> }, 
];

// Group related tools in dropdown
const toolItems = [
  { name: "All Tools", href: "/tools", icon: <Gamepad2 className="h-4 w-4 mr-2" /> },
  { name: "Visual Attention", href: "/tools/visual-attention", icon: <Target className="h-4 w-4 mr-2" /> },
  { name: "Memory Games", href: "/tools/memory-game", icon: <Brain className="h-4 w-4 mr-2" /> },
  { name: "Pattern Recognition", href: "/tools/pattern-recognition-test", icon: <Blocks className="h-4 w-4 mr-2" /> },
  { name: "Verbal Fluency", href: "/tools/verbal-fluency-test", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  { name: "Word Memory", href: "/tools/word-memory-test", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  { name: "Sequence Memory", href: "/tools/sequence-memory-test", icon: <Brain className="h-4 w-4 mr-2" /> },
  { name: "Mental Math", href: "/tools/mental-math", icon: <Target className="h-4 w-4 mr-2" /> },
  { name: "Cognitive Assessment", href: "/tools/cognitive-assessment", icon: <Brain className="h-4 w-4 mr-2" /> },
  { name: "Meditation Timer", href: "/tools/meditation-timer", icon: <CalendarClock className="h-4 w-4 mr-2" /> },
  { name: "Mood Tracker", href: "/tools/mood-tracker", icon: <Heart className="h-4 w-4 mr-2" /> },
  { name: "Daily Challenges", href: "/daily-challenges", icon: <CalendarClock className="h-4 w-4 mr-2" /> },
];

// Add predictors items
const predictorItems = [
  { name: "Stroke Predictor", href: "/predictors/stroke", icon: <Heart className="h-4 w-4 mr-2" /> },
  { name: "Brain Tumor Detection", href: "/predictors/tumor", icon: <BrainCircuit className="h-4 w-4 mr-2" /> },
  { name: "Alzheimer's Detection", href: "/predictors/alzheimers", icon: <Activity className="h-4 w-4 mr-2" /> },
];

// Group analytics and health info
const insightItems = [
  { name: "Progress Tracker", href: "/progress", icon: <LineChart className="h-4 w-4 mr-2" /> },
  { name: "Goals", href: "/progress/goals", icon: <Target className="h-4 w-4 mr-2" /> },
  { name: "Brain Health Library", href: "/brain-health", icon: <Library className="h-4 w-4 mr-2" /> },
  { name: "Research", href: "/research", icon: <ScrollText className="h-4 w-4 mr-2" /> },
  { name: "Stroke Prevention", href: "/stroke-prevention", icon: <Heart className="h-4 w-4 mr-2" /> },
  { name: "Health Metrics", href: "/health-metrics", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
];

// Group support and help items
const supportItems = [
  { name: "Chatbot", href: "/chatbot", icon: <MessagesSquare className="h-4 w-4 mr-2" /> },
  { name: "Help Center", href: "/help", icon: <HelpCircle className="h-4 w-4 mr-2" /> },
  { name: "Contact", href: "/contact", icon: <Mail className="h-4 w-4 mr-2" /> },
  { name: "FAQ", href: "/faq", icon: <FileText className="h-4 w-4 mr-2" /> },
  { name: "Terms", href: "/terms", icon: <ScrollText className="h-4 w-4 mr-2" /> },
  { name: "Privacy", href: "/privacy", icon: <Shield className="h-4 w-4 mr-2" /> },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold">Brainwise</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {/* Main nav items without dropdown */}
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          {/* Predictors Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "flex items-center gap-1 px-2",
                  pathname.startsWith("/predictors") 
                  ? "text-primary" : "text-muted-foreground"
                )}
              >
                Predictors <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="flex items-center gap-2 text-primary mb-1">
                <Stethoscope className="h-4 w-4" />
                <span>ML Models</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mb-2" />
              <DropdownMenuGroup>
                {predictorItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild className="py-2 cursor-pointer">
                    <Link 
                      href={item.href}
                      className="flex items-center rounded-md w-full"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "flex items-center gap-1 px-2",
                  pathname.startsWith("/tools") || pathname === "/daily-challenges" || pathname.includes("/memory-game") || pathname.includes("/visual-attention") || pathname.includes("/pattern-recognition") || pathname.includes("/verbal-fluency") || pathname.includes("/reaction-test") || pathname.includes("/word-memory")
                  ? "text-primary" : "text-muted-foreground"
                )}
              >
                Tools <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="flex items-center gap-2 text-primary mb-1">
                <Brain className="h-4 w-4" />
                <span>Cognitive Tools</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mb-2" />
              <DropdownMenuGroup>
                {toolItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild className="py-2 cursor-pointer">
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md w-full",
                        pathname === item.href ? "bg-primary/10 text-primary font-medium" : ""
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Insights Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "flex items-center gap-1 px-2",
                  pathname.startsWith("/progress") || 
                  pathname.startsWith("/brain-health") || pathname.startsWith("/research") || 
                  pathname.startsWith("/stroke-prevention") || pathname.startsWith("/health-metrics")
                  ? "text-primary" : "text-muted-foreground"
                )}
              >
                Insights <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="flex items-center gap-2 text-primary mb-1">
                <BarChart3 className="h-4 w-4" />
                <span>Health & Data</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mb-2" />
              <DropdownMenuGroup>
                {insightItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild className="py-2 cursor-pointer">
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md w-full",
                        pathname === item.href ? "bg-primary/10 text-primary font-medium" : ""
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Support Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "flex items-center gap-1 px-2",
                  pathname.startsWith("/chatbot") || pathname.startsWith("/help") || 
                  pathname.startsWith("/contact") || pathname.startsWith("/faq") || 
                  pathname.startsWith("/terms") || pathname.startsWith("/privacy")
                  ? "text-primary" : "text-muted-foreground"
                )}
              >
                Support <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="flex items-center gap-2 text-primary mb-1">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="mb-2" />
              <DropdownMenuGroup>
                {supportItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild className="py-2 cursor-pointer">
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md w-full",
                        pathname === item.href ? "bg-primary/10 text-primary font-medium" : ""
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
          
          {isSignedIn ? (
            <>
              <Link 
                href="/profile" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/profile" ? "text-primary" : "text-muted-foreground"
                )}
              >
                Profile
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-6 h-6",
                  }
                }}
                afterSignOutUrl="/"
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm font-medium transition-colors hover:text-primary">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
        
        {/* Mobile Menu */}
        <div className="flex lg:hidden items-center gap-4">
          <ThemeToggle />
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] pr-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription>
              </SheetDescription>
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-2 mb-6">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2" 
                    onClick={() => setOpen(false)}
                  >
                    <Brain className="h-6 w-6 text-primary" />
                    <span className="font-bold">Brainwise</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                
                <nav className="flex-1 overflow-y-auto pr-6 pb-16">
                  <div className="flex flex-col gap-6 mb-8">
                    {/* Main links */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-primary">Main</h4>
                      <div className="ml-4 grid grid-cols-1 gap-3">
                        {mainNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center text-sm transition-colors hover:text-primary",
                              pathname === item.href ? "text-primary font-medium" : "text-muted-foreground"
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {item.icon}
                            <span className="ml-2">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    {/* Predictors Category */}
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <Stethoscope className="h-4 w-4" /> Predictors
                      </h4>
                      <div className="ml-6 grid grid-cols-1 gap-3">
                        {predictorItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center text-sm transition-colors hover:text-primary text-muted-foreground"
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Tool Category - Show all tools */}
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <Brain className="h-4 w-4" /> Tools
                      </h4>
                      <div className="ml-6 grid grid-cols-1 gap-3">
                        {toolItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center text-sm transition-colors hover:text-primary",
                              pathname === item.href ? "text-primary font-medium" : "text-muted-foreground"
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Insights Category - Show all insights */}
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <BarChart3 className="h-4 w-4" /> Insights
                      </h4>
                      <div className="ml-6 grid grid-cols-1 gap-3">
                        {insightItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center text-sm transition-colors hover:text-primary",
                              pathname === item.href ? "text-primary font-medium" : "text-muted-foreground"
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Support Category - Show all support items */}
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <HelpCircle className="h-4 w-4" /> Support
                      </h4>
                      <div className="ml-6 grid grid-cols-1 gap-3">
                        {supportItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center text-sm transition-colors hover:text-primary",
                              pathname === item.href ? "text-primary font-medium" : "text-muted-foreground"
                            )}
                            onClick={() => setOpen(false)}
                          >
                            {item.icon}
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </nav>
                
                <div className="border-t pt-6 px-2 mt-auto">
                  {isSignedIn ? (
                    <div className="flex items-center mt-4">
                      <UserButton 
                        appearance={{
                          elements: {
                            userButtonAvatarBox: "w-6 h-6",
                          }
                        }}
                        afterSignOutUrl="/"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">Account</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full justify-start">
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="w-full micro-bounce">
                          Sign Up
                        </Button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
} 