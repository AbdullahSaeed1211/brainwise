"use client";

import React from "react";
import { Share2, Twitter, Facebook, Linkedin, Mail, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  text: string;
  url?: string;
  hashtags?: string[];
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function SocialShare({
  title,
  text,
  url = typeof window !== 'undefined' ? window.location.href : '',
  hashtags = ["brainwise", "braintraining", "cognition"],
  className = "",
  variant = "outline",
  size = "sm"
}: SocialShareProps) {
  const [copied, setCopied] = React.useState(false);
  
  // Format hashtags for different platforms
  const formattedHashtags = hashtags.map(tag => tag.startsWith('#') ? tag.substring(1) : tag);
  const hashtagsString = formattedHashtags.join(',');
  const hashtagsTwitter = formattedHashtags.map(tag => `#${tag}`).join(' ');
  
  // Build share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtagsString)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
  
  const copyToClipboard = () => {
    const shareText = `${text} ${hashtagsTwitter}\n\n${url}`;
    
    navigator.clipboard.writeText(shareText)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard!");
        
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4 mr-2" /> 
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
            aria-label="Share on Twitter"
          >
            <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" />
            <span>Twitter</span>
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
            aria-label="Share on Facebook"
          >
            <Facebook className="mr-2 h-4 w-4 text-[#4267B2]" />
            <span>Facebook</span>
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center cursor-pointer"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="mr-2 h-4 w-4 text-[#0A66C2]" />
            <span>LinkedIn</span>
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a
            href={mailtoUrl}
            className="flex items-center cursor-pointer"
            aria-label="Share via Email"
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>Email</span>
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 