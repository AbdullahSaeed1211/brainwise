"use client";

import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "doctor" | "admin";
}

/**
 * Custom hook for handling authentication state
 * Combines Clerk's useUser and useAuth hooks with additional functionality
 */
export function useAuth() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useClerkAuth();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Format the user data for our app
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      setAuthUser(null);
      setIsLoading(false);
      return;
    }

    // Format the user data
    setAuthUser({
      id: user.id,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
      email: user.emailAddresses[0]?.emailAddress || '',
      image: user.imageUrl,
      role: "user", // Default role, can be updated from API
    });
    
    setIsLoading(false);
  }, [isLoaded, isSignedIn, user]);

  // Get an auth token for API calls
  const getAuthToken = async () => {
    if (!isSignedIn) return null;
    return getToken();
  };
  
  return {
    user: authUser,
    isSignedIn,
    isLoading,
    getToken: getAuthToken,
  };
} 