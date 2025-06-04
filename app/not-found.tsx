import Link from "next/link";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Brainwise",
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: {
    index: false,
    follow: true
  }
};

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <div className="mb-6 bg-muted/50 p-4 rounded-full">
        <Brain className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Oops! It seems the brain connection we&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/cognitive-games">
            Try Brain Games
          </Link>
        </Button>
      </div>
    </div>
  );
} 