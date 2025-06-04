"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

export function CtaSection() {
  // Wrap the users array in useMemo to prevent recreation on each render
  const recentUsers = useMemo(() => [
    { name: "Alex Johnson", fallback: "AJ", image: "/avatars/user1.png" },
    { name: "Maria Garcia", fallback: "MG", image: "/avatars/user2.png" },
    { name: "David Lee", fallback: "DL", image: "/avatars/user3.png" },
    { name: "Sarah Wilson", fallback: "SW", image: "/avatars/user4.png" },
    { name: "James Brown", fallback: "JB", image: "/avatars/user5.png" },
    { name: "Emma Davis", fallback: "ED", image: "/avatars/user6.png" },
    { name: "Olivia Chen", fallback: "OC", image: "/avatars/user7.png" },
  ], []); // Empty dependency array means this only runs once

  // Create a state for the users to display
  const [displayUsers, setDisplayUsers] = useState(recentUsers);
  
  // Use the memoized recentUsers in the effect
  useEffect(() => {
    const shuffled = [...recentUsers].sort(() => Math.random() - 0.5);
    setDisplayUsers(shuffled);
  }, [recentUsers]); // Now this is safe because recentUsers is memoized

  const benefitItems = [
    {
      title: "Personalized Risk Assessment",
      description: "Get insights tailored to your health profile"
    },
    {
      title: "Progress Tracking",
      description: "Monitor improvements in cognitive performance"
    },
    {
      title: "5+ Brain Training Tools",
      description: "Access our complete cognitive training suite"
    },
    {
      title: "Evidence-Based Resources",
      description: "Access scientifically vetted information"
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-destructive/10">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="bg-card rounded-2xl p-8 md:p-12 border shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full translate-x-1/3 translate-y-1/3 mix-blend-multiply"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.span 
                className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium mb-2"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                Limited Time Offer
              </motion.span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Start your brain health journey today</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of users who are actively improving their cognitive function and reducing health risks.
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md">Create Free Account</Button>
                <Button size="lg" variant="outline" className="hover:bg-muted/30 text-foreground" asChild>
                  <Link href="/tools">
                    Explore Tools First
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-y-0 space-x-4 pt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AvatarCircles people={displayUsers} numPeople={5000} limit={5} />
                <p className="text-sm text-muted-foreground">5,000+ users joined this month</p>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {benefitItems.map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                >
                  <div className="bg-primary/20 p-2 rounded-full mt-1">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 