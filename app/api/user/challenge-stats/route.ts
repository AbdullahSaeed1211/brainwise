import { NextRequest } from "next/server";
import mongoose from "mongoose";
import db from "@/lib/mongodb";
import {
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-utils";
import { auth } from "@clerk/nextjs/server";
import { addDays, format, isSameDay, parseISO, startOfDay, subDays } from "date-fns";

// Interface for challenge completion from database
interface IChallengeCompletion {
  _id: string;
  user: string;
  challengeDate: Date;
  completedAt: Date;
  gameType: string;
  earnedPoints: number;
  gameResultId?: string;
}

// Helper to get the DailyChallenge models dynamically
const getChallengeModels = async () => {
  try {
    console.log('Connecting to MongoDB in getChallengeModels');
    await db.connect();
    try {
      return {
        DailyChallenge: mongoose.model('DailyChallenge'),
        ChallengeCompletion: mongoose.model('ChallengeCompletion'),
      };
    } catch (modelError: unknown) {
      console.log('Challenge models not found, importing them now', modelError instanceof Error ? modelError.message : '');
      const { DailyChallenge, ChallengeCompletion } = await import("@/lib/models/DailyChallenge");
      return { DailyChallenge, ChallengeCompletion };
    }
  } catch (error) {
    console.error("MongoDB connection error in getChallengeModels:", error);
    throw new Error("Database connection failed");
  }
};

// Helper to get the User model dynamically
const getUserModel = async () => {
  try {
    console.log('Connecting to MongoDB in getUserModel');
    await db.connect();
    try {
      return mongoose.model('User');
    } catch (modelError: unknown) {
      console.log('User model not found, importing it now', modelError instanceof Error ? modelError.message : '');
      const { default: UserModel } = await import("@/lib/models/User");
      return UserModel;
    }
  } catch (error) {
    console.error("MongoDB connection error in getUserModel:", error);
    throw new Error("Database connection failed");
  }
};

// GET /api/user/challenge-stats - Get user's challenge statistics
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return unauthorizedResponse("You must be logged in to access your challenge stats");
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    
    // Default to last 30 days if not specified
    const startDate = startDateParam 
      ? startOfDay(parseISO(startDateParam))
      : startOfDay(subDays(new Date(), 30));
      
    const endDate = endDateParam
      ? startOfDay(addDays(parseISO(endDateParam), 1)) // Add 1 day to include the end date
      : startOfDay(addDays(new Date(), 1)); // Include today
    
    // Connect to the database
    await db.connect();
    const User = await getUserModel();
    const { ChallengeCompletion } = await getChallengeModels();

    // Find the user
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return notFoundResponse("User not found");
    }

    // Get all the user's challenge completions within the date range
    const completions = await ChallengeCompletion.find({
      user: user._id,
      challengeDate: { $gte: startDate, $lt: endDate }
    }).sort({ challengeDate: -1 }).lean() as unknown as IChallengeCompletion[];

    console.log(`Found ${completions.length} completions for user ${user._id}`);

    // Group completions by date
    const completionsByDay = new Map<string, IChallengeCompletion[]>();
    completions.forEach(completion => {
      const dateKey = format(new Date(completion.challengeDate), 'yyyy-MM-dd');
      if (!completionsByDay.has(dateKey)) {
        completionsByDay.set(dateKey, []);
      }
      completionsByDay.get(dateKey)!.push(completion);
    });

    // Calculate current streak
    let currentStreak = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    // Check if there's a completion today
    if (completionsByDay.has(today)) {
      currentStreak = 1;
      
      // Check previous consecutive days
      let checkDate = subDays(new Date(), 1);
      while (true) {
        const dateToCheck = format(checkDate, 'yyyy-MM-dd');
        if (completionsByDay.has(dateToCheck)) {
          currentStreak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
    } 
    // If not today, check if yesterday and count backwards
    else if (completionsByDay.has(yesterday)) {
      currentStreak = 1;
      
      // Check previous consecutive days
      let checkDate = subDays(new Date(), 2);
      while (true) {
        const dateToCheck = format(checkDate, 'yyyy-MM-dd');
        if (completionsByDay.has(dateToCheck)) {
          currentStreak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    if (completions.length > 0) {
      // Get all completion dates in ascending order
      const dates = Array.from(completionsByDay.keys()).sort();
      
      let tempStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const currentDate = parseISO(dates[i]);
        const prevDate = parseISO(dates[i-1]);
        const expectedDate = addDays(prevDate, 1);
        
        if (isSameDay(currentDate, expectedDate)) {
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 1;
        }
      }
      
      // Check the final streak
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }
    
    // Calculate total points
    const totalPoints = completions.reduce((sum, completion) => sum + completion.earnedPoints, 0);
    
    // Get last active day
    let lastActiveDay = null;
    if (completions.length > 0) {
      lastActiveDay = format(new Date(completions[0].challengeDate), 'yyyy-MM-dd');
    }
    
    // Create challenge history (formatted for the front-end)
    const challengeHistory = Array.from(completionsByDay.entries()).map(([date, dayCompletions]) => {
      return {
        date,
        formattedDate: format(parseISO(date), 'MMM d, yyyy'),
        completedChallenges: dayCompletions.map((c: IChallengeCompletion) => c.gameType),
        totalChallenges: 1, // Assuming 1 challenge per day
        points: dayCompletions.reduce((sum: number, c: IChallengeCompletion) => sum + c.earnedPoints, 0)
      };
    });
    
    // Get completed challenges for today
    const completedToday = completionsByDay.has(today) 
      ? completionsByDay.get(today)!.map((c: IChallengeCompletion) => c.gameType)
      : [];
    
    // Prepare response object
    const stats = {
      currentStreak,
      longestStreak,
      lastActiveDay,
      totalPoints,
      completedToday,
      challengeHistory,
      // We don't include rewards here as they're calculated client-side based on streak and points
    };
    
    return successResponse(stats);
  } catch (error) {
    console.error("Error getting challenge stats:", error);
    return serverErrorResponse("Failed to retrieve challenge statistics");
  }
} 