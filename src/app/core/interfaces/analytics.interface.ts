export interface Summary {
  blogAchievements: {
    countBlogs: number;
    countReactions: number;
    countComments: number;
  };
  moodLogDays: number;
}

export interface DashboardSummary {
  dailyActivitySummary: {
    totalAssignments: number;
    completedAssignments: number;
  };
  moodLogDays: number;
  averageBlogLikes: number;
}
