"use client";

import { Testimonials } from "@/components/testimonials";

export function TestimonialsSection() {
  return (
    <section className="py-16 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Trusted by Health Professionals & Users
          </h2>
          <p className="text-xl text-muted-foreground">
            See what medical experts and everyday users are saying about Brainwise.
          </p>
        </div>
        <Testimonials />
      </div>
    </section>
  );
} 