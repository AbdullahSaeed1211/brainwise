"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export function FaqSection() {
  const faqs = [
    {
      question: "How do the brain training games help improve cognitive function?",
      answer: "Our brain training games target specific cognitive domains like memory, attention, and processing speed. Regular practice creates new neural connections and strengthens existing ones, improving overall brain function and resilience."
    },
    {
      question: "How accurate is the stroke risk assessment?",
      answer: "Our stroke risk assessment is based on established medical risk factors and validated prediction models. While it provides a good indication of relative risk, it should be used as a conversation starter with healthcare professionals rather than a definitive diagnosis."
    },
    {
      question: "Is my health data secure and private?",
      answer: "Yes, we take data privacy seriously. All health information is encrypted, stored securely, and never shared with third parties without explicit consent. You can read our complete privacy policy for more details."
    },
    {
      question: "How often should I use the brain training tools?",
      answer: "For optimal results, we recommend using the tools for 10-15 minutes daily. Consistent practice is more effective than occasional longer sessions."
    },
    {
      question: "Can brain training prevent dementia or Alzheimer's disease?",
      answer: "While research suggests that cognitive stimulation may help reduce risk or delay onset of cognitive decline, brain training alone cannot prevent conditions like dementia. A holistic approach including physical exercise, proper nutrition, social engagement, and cognitive stimulation offers the best protection."
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-muted/10">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">
            Get answers to common questions about brain health and our platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
} 