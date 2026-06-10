/* ========================================
   PRODUCTIVITY SCORE SYSTEM
   Calculates and manages user productivity
   ======================================== */

class ProductivityScoreCalculator {
  constructor() {
    this.baseScore = 0;
  }

  /* ========================================
     SCORE CALCULATION
     ======================================== */

  calculateScore() {
    const tasks = storage.getTasks();
    const goals = storage.getGoals();
    const sessions = storage.getPomodorSessions();
    const today = new Date().toISOString().split('T')[0];

    // Task completion score (40%)
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const taskScore = totalTasks > 0 ? (completedTasks / totalTasks) * 40 : 0;

    // Goal progress score (30%)
    const goalProgress = goals.reduce((acc, goal) => acc + (goal.progress || 0), 0);
    const avgGoalProgress = goals.length > 0 ? goalProgress / goals.length : 0;
    const goalScore = Math.min(avgGoalProgress * 0.3, 30);

    // Focus sessions score (20%)
    const todaysSessions = sessions.filter(s => s.createdAt.startsWith(today));
    const sessionScore = Math.min(todaysSessions.length * 5, 20);

    // Consistency bonus (10%)
    const streak = this.calculateStreak();
    const consistencyScore = Math.min(streak, 10);

    const totalScore = taskScore + goalScore + sessionScore + consistencyScore;
    return Math.round(Math.min(totalScore, 100));
  }

  /* ========================================
     LEVEL DETERMINATION
     ======================================== */

  getLevel(score) {
    if (score >= 90) return 'Master';
    if (score >= 80) return 'Expert';
    if (score >= 70) return 'Advanced';
    if (score >= 60) return 'Intermediate';
    if (score >= 50) return 'Proficient';
    if (score >= 40) return 'Developing';
    if (score >= 30) return 'Beginner';
    return 'Starter';
  }

  getLevelColor(level) {
    const colors = {
      'Master': '#6366f1',
      'Expert': '#8b5cf6',
      'Advanced': '#06b6d4',
      'Intermediate': '#10b981',
      'Proficient': '#f59e0b',
      'Developing': '#f97316',
      'Beginner': '#ef4444',
      'Starter': '#6b7280'
    };
    return colors[level] || '#6b7280';
  }

  /* ========================================
     STREAK CALCULATION
     ======================================== */

  calculateStreak() {
    const activities = storage.getDailyActivities();
    if (activities.length === 0) return 0;

    const dates = [...new Set(activities.map(a => a.date))].sort().reverse();
    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const dayDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));

      if (dayDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /* ========================================
     INSIGHTS GENERATION
     ======================================== */

  generateInsights() {
    const score = this.calculateScore();
    const tasks = storage.getTasks();
    const goals = storage.getGoals();
    const sessions = storage.getPomodorSessions();
    const today = new Date().toISOString().split('T')[0];

    const insights = [];

    // Task insights
    const completedToday = tasks.filter(t => t.completed && t.updatedAt?.startsWith(today)).length;
    if (completedToday > 5) {
      insights.push({
        type: 'positive',
        title: 'Great productivity!',
        message: `You've completed ${completedToday} tasks today. Keep it up!`
      });
    } else if (completedToday === 0) {
      insights.push({
        type: 'warning',
        title: 'No tasks completed yet',
        message: 'Try completing at least one task to build momentum.'
      });
    }

    // Goal insights
    const completedGoals = goals.filter(g => g.completed).length;
    if (completedGoals > 0) {
      insights.push({
        type: 'positive',
        title: 'Goal milestone!',
        message: `You've completed ${completedGoals} goals. Celebrate your progress!`
      });
    }

    // Focus session insights
    const todaySessions = sessions.filter(s => s.createdAt.startsWith(today)).length;
    if (todaySessions === 0) {
      insights.push({
        type: 'suggestion',
        title: 'No focus sessions today',
        message: 'Try using the Pomodoro timer to stay focused.'
      });
    } else if (todaySessions >= 8) {
      insights.push({
        type: 'positive',
        title: 'Focused time master!',
        message: `You've completed ${todaySessions} focus sessions. Your concentration is impressive!`
      });
    }

    // Streak insights
    const streak = this.calculateStreak();
    if (streak > 0) {
      insights.push({
        type: 'positive',
        title: `${streak} day streak!`,
        message: 'Maintain this consistency to reach higher productivity levels.'
      });
    }

    // Overall score insights
    if (score >= 80) {
      insights.push({
        type: 'positive',
        title: 'Excellent productivity!',
        message: 'You\'re performing at a high level. Maintain this momentum!'
      });
    } else if (score < 40) {
      insights.push({
        type: 'warning',
        title: 'Low productivity score',
        message: 'Focus on completing small tasks and building consistency.'
      });
    }

    return insights;
  }

  /* ========================================
     IMPROVEMENT SUGGESTIONS
     ======================================== */

  getImprovementSuggestions() {
    const tasks = storage.getTasks();
    const pendingTasks = tasks.filter(t => !t.completed);
    const today = new Date().toISOString().split('T')[0];

    const suggestions = [];

    // Task suggestions
    if (pendingTasks.length > 10) {
      suggestions.push({
        priority: 'high',
        title: 'Too many pending tasks',
        suggestion: 'Break down large tasks into smaller, manageable chunks.'
      });
    }

    // Urgency suggestions
    const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date(today));
    if (overdueTasks.length > 0) {
      suggestions.push({
        priority: 'high',
        title: `${overdueTasks.length} overdue task(s)`,
        suggestion: 'Complete or reschedule overdue tasks to maintain productivity.'
      });
    }

    // Session suggestions
    const sessions = storage.getPomodorSessions();
    const todaySessions = sessions.filter(s => s.createdAt.startsWith(today)).length;
    if (todaySessions < 4) {
      suggestions.push({
        priority: 'medium',
        title: 'Limited focus time',
        suggestion: 'Try to complete at least 4 Pomodoro sessions daily for optimal results.'
      });
    }

    // Goal suggestions
    const goals = storage.getGoals();
    const stuckGoals = goals.filter(g => !g.completed && g.progress < 20);
    if (stuckGoals.length > 0) {
      suggestions.push({
        priority: 'medium',
        title: 'Goals need attention',
        suggestion: 'Review and plan small steps to progress on your goals.'
      });
    }

    return suggestions;
  }

  /* ========================================
     XP & GAMIFICATION
     ======================================== */

  calculateXP() {
    const tasks = storage.getTasks();
    const goals = storage.getGoals();
    const sessions = storage.getPomodorSessions();

    let xp = 0;

    // Task completion XP
    const completedTasks = tasks.filter(t => t.completed).length;
    xp += completedTasks * 10;

    // Goal completion XP
    const completedGoals = goals.filter(g => g.completed).length;
    xp += completedGoals * 50;

    // Session XP
    xp += sessions.length * 15;

    // Streak bonus
    const streak = this.calculateStreak();
    xp += streak * 5;

    return xp;
  }

  getXPLevel() {
    const totalXP = this.calculateXP();
    return Math.floor(totalXP / 500) + 1;
  }

  getXPProgress() {
    const totalXP = this.calculateXP();
    const currentLevel = this.getXPLevel();
    const levelUpXP = currentLevel * 500;
    const prevLevelXP = (currentLevel - 1) * 500;
    const progress = ((totalXP - prevLevelXP) / (levelUpXP - prevLevelXP)) * 100;
    return Math.min(progress, 100);
  }

  /* ========================================
     ANALYTICS METRICS
     ======================================== */

  getStudyHours() {
    const sessions = storage.getPomodorSessions();
    const hours = (sessions.length * 25) / 60; // 25 minutes per session
    return parseFloat(hours.toFixed(2));
  }

  getTaskCompletionRate() {
    const tasks = storage.getTasks();
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  }

  getGoalCompletionRate() {
    const goals = storage.getGoals();
    if (goals.length === 0) return 0;
    return Math.round((goals.filter(g => g.completed).length / goals.length) * 100);
  }

  /* ========================================
     UPDATE OVERALL SCORE
     ======================================== */

  updateProductivityScore() {
    const score = this.calculateScore();
    const level = this.getLevel(score);
    const xp = this.calculateXP();
    const streak = this.calculateStreak();

    const scoreData = {
      percentage: score,
      level,
      levelColor: this.getLevelColor(level),
      completedTasks: storage.getTasks().filter(t => t.completed).length,
      studyHours: this.getStudyHours(),
      focusSessions: storage.getPomodorSessions().length,
      streak,
      xp,
      xpLevel: this.getXPLevel(),
      xpProgress: this.getXPProgress(),
      taskCompletionRate: this.getTaskCompletionRate(),
      goalCompletionRate: this.getGoalCompletionRate(),
      insights: this.generateInsights(),
      suggestions: this.getImprovementSuggestions(),
      lastUpdated: new Date().toISOString()
    };

    storage.setProductivityScore(scoreData);
    return scoreData;
  }
}

// Create global productivity calculator
const productivityCalculator = new ProductivityScoreCalculator();

// Update score periodically
setInterval(() => {
  productivityCalculator.updateProductivityScore();
}, 60 * 1000); // Every minute

console.log('ProductivityScoreCalculator initialized');
