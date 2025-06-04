import { Metadata } from "next";
import { Calendar, BarChart3, Trophy } from "lucide-react";
import { DailyChallenge } from "@/components/daily-challenge";
import { ChallengeHistory } from "@/components/challenge-history";

export const metadata: Metadata = {
  title: "Daily Challenges | Brainwise",
  description: "Complete daily cognitive challenges to improve your brain health and track your progress over time.",
};

export default function DailyChallengesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold">Daily Challenges</h1>
        <p className="text-muted-foreground">
          Complete daily cognitive exercises to build consistency and track your progress over time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Today&apos;s Challenge</h2>
          </div>
          <DailyChallenge />

          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium">Benefits of Daily Challenges</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>Consistency improves cognitive training effectiveness</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>Daily practice helps form long-term brain health habits</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>Varied challenges exercise different cognitive domains</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                <span>Tracking progress motivates continued engagement</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Your Progress</h2>
          </div>
          <ChallengeHistory />
          
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-muted/30 text-center">
              <div className="text-2xl font-bold text-primary">18</div>
              <div className="text-xs text-muted-foreground">This Month</div>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30 text-center">
              <div className="text-2xl font-bold text-primary">72%</div>
              <div className="text-xs text-muted-foreground">Completion</div>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30 text-center">
              <div className="text-2xl font-bold text-primary">1,458</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 