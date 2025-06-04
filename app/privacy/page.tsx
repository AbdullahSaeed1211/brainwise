import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Brainwise",
  description: "Learn how Brainwise protects and handles your personal information",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Brainwise (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the &quot;Services&quot;).
        </p>
        <p>
          Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p>
          We may collect several types of information from and about users of our Services, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>Personal Information:</strong> Name, email address, date of birth, and demographic information.</li>
          <li><strong>Health Information:</strong> Self-reported health metrics, cognitive test results, and lifestyle factors related to brain health.</li>
          <li><strong>Usage Data:</strong> Information about how you use our Services, including frequency of use, features accessed, and performance metrics.</li>
          <li><strong>Device Information:</strong> Information about your device, IP address, browser type, and operating system.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>
          We may use the information we collect from you for various purposes, including to:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Provide, maintain, and improve our Services</li>
          <li>Personalize your experience with our Services</li>
          <li>Generate personalized recommendations for brain health improvement</li>
          <li>Track your progress and performance over time</li>
          <li>Communicate with you about updates, support, and features</li>
          <li>Conduct research and analysis to improve brain health assessments and interventions</li>
          <li>Protect the security and integrity of our Services</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Sharing Your Information</h2>
        <p>
          We may share your information in the following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li><strong>With Service Providers:</strong> We may share your information with third-party vendors who provide services on our behalf.</li>
          <li><strong>For Research:</strong> We may use de-identified or aggregated data for research purposes to improve brain health understanding and interventions.</li>
          <li><strong>With Your Consent:</strong> We may share your information when you have given us consent to do so.</li>
          <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Data Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>The right to access your personal information</li>
          <li>The right to correct inaccurate or incomplete information</li>
          <li>The right to request deletion of your personal information</li>
          <li>The right to restrict or object to processing of your information</li>
          <li>The right to data portability</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us using the information provided in the &quot;Contact Us&quot; section below.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children&apos;s Privacy</h2>
        <p>
          Our Services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe we have collected information from your child, please contact us so we can promptly remove the information.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this Privacy Policy.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@brainwise.app" className="text-primary hover:underline">privacy@brainwise.app</a>.
        </p>
        
        <div className="mt-8 flex items-center">
          <Link href="/terms" className="text-primary hover:underline">
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
} 