"use client";

import { useChallengeStreaks } from "@/hooks/use-challenge-streaks";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export function ChallengeHistory() {
  const { stats, isLoading } = useChallengeStreaks();

  if (isLoading) {
    return <ChallengeHistorySkeleton />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">Recent Challenge History</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-medium p-3 text-sm">Date</th>
                  <th className="text-left font-medium p-3 text-sm">Completed</th>
                  <th className="text-left font-medium p-3 text-sm">Points Earned</th>
                  <th className="text-left font-medium p-3 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.challengeHistory.map((day, index) => {
                  // Determine status and color
                  let status;
                  let statusColor;
                  
                  if (day.formattedDate === "Today" && day.completedChallenges.length < day.totalChallenges) {
                    status = "In Progress";
                    statusColor = "text-amber-500";
                  } else if (day.completedChallenges.length === 0) {
                    status = "Missed";
                    statusColor = "text-red-500";
                  } else {
                    status = "Completed";
                    statusColor = "text-emerald-500";
                  }
                  
                  return (
                    <tr key={day.date} className={index < stats.challengeHistory.length - 1 ? "border-b" : ""}>
                      <td className="p-3 text-sm">{day.formattedDate}</td>
                      <td className="p-3 text-sm">{day.completedChallenges.length} of {day.totalChallenges}</td>
                      <td className="p-3 text-sm">{day.points}</td>
                      <td className={`p-3 text-sm ${statusColor}`}>{status}</td>
                    </tr>
                  );
                })}
                
                {/* If we don't have enough history, add some placeholder rows */}
                {stats.challengeHistory.length < 5 && (
                  Array.from({ length: 5 - stats.challengeHistory.length }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (stats.challengeHistory.length + i));
                    
                    return (
                      <tr key={`placeholder-${i}`} className={i < 4 - stats.challengeHistory.length ? "border-b" : ""}>
                        <td className="p-3 text-sm">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                        <td className="p-3 text-sm">0 of 3</td>
                        <td className="p-3 text-sm">0</td>
                        <td className="p-3 text-sm text-red-500">Missed</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChallengeHistorySkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">Recent Challenge History</h2>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-medium p-3 text-sm">Date</th>
                  <th className="text-left font-medium p-3 text-sm">Completed</th>
                  <th className="text-left font-medium p-3 text-sm">Points Earned</th>
                  <th className="text-left font-medium p-3 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className={i < 4 ? "border-b" : ""}>
                    <td className="p-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-12" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-8" /></td>
                    <td className="p-3"><Skeleton className="h-4 w-16" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 