import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Brainwise",
  description: "Sign in to your Brainwise account",
};

export default function SignInPage() {
  return (
    <div className="flex flex-col">
      <section className="magic-section relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[length:20px_20px] bg-center [background-image:linear-gradient(rgba(var(--magic-primary),0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--magic-primary),0.1)_1px,transparent_1px)]"></div>
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[rgba(var(--magic-primary),0.3)] to-[rgba(var(--magic-accent),0.3)] blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-[rgba(var(--magic-secondary),0.3)] to-[rgba(var(--magic-primary),0.3)] blur-3xl"></div>
        
        <div className="magic-container relative">
          <div className="mx-auto max-w-md py-12">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-gradient-to-r from-[rgb(var(--magic-primary))] to-[rgb(var(--magic-secondary))] hover:opacity-90 text-white",
                  card: "bg-background border-2 shadow-xl",
                  headerTitle: "text-foreground",
                  headerSubtitle: "text-muted-foreground",
                  formFieldLabel: "text-foreground",
                  formFieldInput: "bg-background border text-foreground",
                  footerActionLink: "text-[rgb(var(--magic-primary))]",
                }
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
} 