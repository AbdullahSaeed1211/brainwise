"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Send, CheckCircle2 } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!consent) {
      toast({
        title: "Consent Required",
        description: "Please confirm you agree to receive emails from us.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would normally make an API call to save the email
      // For example: await fetch('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
      
      toast({
        title: "Successfully Subscribed!",
        description: "You've been added to our newsletter. We're still setting up email delivery, so you won't receive emails yet.",
        variant: "default",
      });
      
      setIsSubscribed(true);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubscribed) {
    return (
      <Card className="w-full bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Subscription Confirmed!
          </CardTitle>
          <CardDescription>
            Thank you for subscribing to our newsletter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            We&apos;ve recorded your subscription for <strong>{email}</strong>. You&apos;ll receive updates on brain health research, cognitive training tips, and new features.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Brainwise Newsletter
        </CardTitle>
        <CardDescription>
          Stay updated with the latest brain health research and tips.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="consent" className="text-sm text-muted-foreground">
              I agree to receive emails from Brainwise about brain health, cognitive training, and new features. You can unsubscribe at any time.
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Subscribing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 