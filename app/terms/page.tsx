import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Brainwise",
  description: "Terms and conditions for using the Brainwise platform",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to Brainwise (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our website, mobile application, and services (collectively, the &quot;Services&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). Please read these Terms carefully.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Acceptance of Terms</h2>
        <p>
          By accessing or using the Services, you represent that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Description of Services</h2>
        <p>
          Brainwise provides cognitive assessment, training, and brain health monitoring tools designed to help users understand and improve their cognitive function and reduce their risk of stroke and other neurological conditions. Our Services include but are not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Cognitive assessments and brain health surveys</li>
          <li>Brain training games and exercises</li>
          <li>Educational resources on brain health</li>
          <li>Tracking of health metrics relevant to brain health</li>
          <li>Personalized recommendations based on user data</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Medical Disclaimer</h2>
        <p>
          Brainwise is not a healthcare provider, and our Services do not constitute medical advice, diagnosis, or treatment. The information provided through our Services is for informational and educational purposes only. Always consult with qualified healthcare professionals regarding any health concerns or before making any health-related decisions.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Accounts</h2>
        <p>
          To access certain features of our Services, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update your information as necessary.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Privacy</h2>
        <p>
          Your privacy is important to us. Our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your personal information. By using our Services, you consent to our collection and use of your information as described in our Privacy Policy.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
        <p>
          All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, software, and the compilation thereof, are owned by Brainwise, our licensors, or other providers of such material and are protected by copyright, trademark, and other intellectual property laws.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Brainwise shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
        <p>
          We may revise these Terms at any time by updating this page. By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised Terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at <a href="mailto:support@brainwise.app" className="text-primary hover:underline">support@brainwise.app</a>.
        </p>
      </div>
    </div>
  );
} 