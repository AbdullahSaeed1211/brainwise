import { Activity, Award, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function RecentActivity() {
  // Mock activities with realistic dates relative to today
  const mockActivities = [
    {
      id: "1",
      title: "Completed Stroke Risk Assessment",
      icon: <Activity className="h-4 w-4 text-primary" />,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
    },
    {
      id: "2",
      title: "Updated Health Metrics",
      icon: <Clock className="h-4 w-4 text-primary" />,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: "3",
      title: "Completed Cognitive Assessment",
      icon: <Award className="h-4 w-4 text-primary" />,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest brain health activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-start space-x-4 ${
                index < mockActivities.length - 1 ? "border-b pb-4" : ""
              }`}
            >
              <div className="rounded-full bg-primary/10 p-2">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 