import { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { UserProfile } from "@/components/user-profile";
import { UserSettings } from "@/components/user-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "User Profile | Brainwise",
  description: "View and manage your brain health profile",
};

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <UserProfile 
            user={{
              id: userId,
              name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
              email: user.emailAddresses[0]?.emailAddress || '',
              image: user.imageUrl,
              role: (user.publicMetadata.role as "user" | "doctor" | "admin") || "user",
              createdAt: new Date(user.createdAt),
            }}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <UserSettings userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 