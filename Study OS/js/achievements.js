/* ========================================
   ACHIEVEMENTS & GAMIFICATION SYSTEM
   Badges and rewards tracking
   ======================================== */

class AchievementSystem {
  constructor() {
    this.achievements = [
      {
        badge: 'first_task',
        title: 'First Step',
        description: 'Complete your first task',
        icon: '✓',
        color: '#10b981'
      },
      {
        badge: 'task_master_10',
        title: 'Task Master',
        description: 'Complete 10 tasks',
        icon: '⚡',
        color: '#f59e0b'
      },
      {
        badge: 'task_master_50',
        title: 'Task Legend',
        description: 'Complete 50 tasks',
        icon: '👑',
        color: '#6366f1'
      },
      {
        badge: 'goal_setter',
        title: 'Goal Setter',
        description: 'Create your first goal',
        icon: '🎯',
        color: '#06b6d4'
      },
      {
        badge: 'goal_achiever_5',
        title: 'Goal Achiever',
        description: 'Complete 5 goals',
        icon: '🏆',
        color: '#8b5cf6'
      },
      {
        badge: 'pomodoro_master',
        title: 'Focus Master',
        description: 'Complete 10 Pomodoro sessions',
        icon: '🍅',
        color: '#ef4444'
      },
      {
        badge: 'pomodoro_guru',
        title: 'Focus Guru',
        description: 'Complete 50 Pomodoro sessions',
        icon: '🔥',
        color: '#dc2626'
      },
      {
        badge: 'note_taker',
        title: 'Note Taker',
        description: 'Create your first note',
        icon: '📝',
        color: '#3b82f6'
      },
      {
        badge: 'week_streak_7',
        title: 'Weekly Warrior',
        description: 'Maintain a 7 day streak',
        icon: '🌟',
        color: '#f59e0b'
      },
      {
        badge: 'month_streak_30',
        title: 'Monthly Champion',
        description: 'Maintain a 30 day streak',
        icon: '🎖️',
        color: '#6366f1'
      },
      {
        badge: 'productivity_80',
        title: 'Productivity Pro',
        description: 'Reach 80% productivity score',
        icon: '📊',
        color: '#10b981'
      },
      {
        badge: 'night_owl',
        title: 'Night Owl',
        description: 'Study after 10 PM',
        icon: '🦉',
        color: '#1f2937'
      },
      {
        badge: 'early_bird',
        title: 'Early Bird',
        description: 'Study before 6 AM',
        icon: '🐦',
        color: '#06b6d4'
      },
      {
        badge: 'multi_tasker',
        title: 'Multi-Tasker',
        description: 'Have 10 active tasks',
        icon: '⚙️',
        color: '#8b5cf6'
      },
      {
        badge: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieve 100% task completion',
        icon: '✨',
        color: '#fbbf24'
      }
    ];

    this.initAchievements();
  }

  initAchievements() {
    this.achievements.forEach(achievement => {
      this.checkAndUnlock(achievement.badge);
    });
  }

  /* ========================================
     ACHIEVEMENT CHECKING
     ======================================== */

  checkAndUnlock(badge) {
    if (storage.hasAchievement(badge)) {
      return; // Already unlocked
    }

    const shouldUnlock = this.checkCondition(badge);
    if (shouldUnlock) {
      this.unlockAchievement(badge);
    }
  }

  checkCondition(badge) {
    const tasks = storage.getTasks();
    const goals = storage.getGoals();
    const notes = storage.getNotes();
    const sessions = storage.getPomodorSessions();
    const streak = this.getStreak();
    const score = productivityCalculator.calculateScore();

    const completedTasks = tasks.filter(t => t.completed).length;
    const completedGoals = goals.filter(g => g.completed).length;
    const now = new Date();
    const hour = now.getHours();

    switch (badge) {
      case 'first_task':
        return completedTasks >= 1;
      case 'task_master_10':
        return completedTasks >= 10;
      case 'task_master_50':
        return completedTasks >= 50;
      case 'goal_setter':
        return goals.length >= 1;
      case 'goal_achiever_5':
        return completedGoals >= 5;
      case 'pomodoro_master':
        return sessions.length >= 10;
      case 'pomodoro_guru':
        return sessions.length >= 50;
      case 'note_taker':
        return notes.length >= 1;
      case 'week_streak_7':
        return streak >= 7;
      case 'month_streak_30':
        return streak >= 30;
      case 'productivity_80':
        return score >= 80;
      case 'night_owl':
        return hour >= 22; // After 10 PM
      case 'early_bird':
        return hour < 6; // Before 6 AM
      case 'multi_tasker':
        return tasks.filter(t => !t.completed).length >= 10;
      case 'perfectionist':
        return tasks.length > 0 && completedTasks === tasks.length;
      default:
        return false;
    }
  }

  unlockAchievement(badge) {
    const achievement = this.achievements.find(a => a.badge === badge);
    if (achievement) {
      storage.addAchievement({
        badge,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        color: achievement.color
      });

      // Show notification
      notifier.success(`🏆 Achievement Unlocked: ${achievement.title}`);

      // Add XP
      productivityCalculator.updateProductivityScore();

      return achievement;
    }
  }

  /* ========================================
     BADGE DISPLAY
     ======================================== */

  getBadgeHTML(badge) {
    const achievement = this.achievements.find(a => a.badge === badge);
    if (!achievement) return '';

    return `
      <div class="badge" style="background: ${achievement.color}20; color: ${achievement.color}; padding: 12px 16px; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.5rem;">${achievement.icon}</span>
        <div>
          <strong>${achievement.title}</strong>
          <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">${achievement.description}</p>
        </div>
      </div>
    `;
  }

  getAllBadgesHTML() {
    return this.achievements.map(badge => this.getBadgeHTML(badge.badge)).join('');
  }

  getUnlockedBadgesHTML() {
    const unlockedBadges = storage.getAchievements();
    return unlockedBadges.map(badge => this.getBadgeHTML(badge.badge)).join('');
  }

  /* ========================================
     STREAK CALCULATION
     ======================================== */

  getStreak() {
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
     PROGRESS TRACKING
     ======================================== */

  getAchievementProgress(badge) {
    const achievement = this.achievements.find(a => a.badge === badge);
    if (!achievement) return null;

    const tasks = storage.getTasks();
    const goals = storage.getGoals();
    const notes = storage.getNotes();
    const sessions = storage.getPomodorSessions();
    const streak = this.getStreak();
    const score = productivityCalculator.calculateScore();

    const completedTasks = tasks.filter(t => t.completed).length;
    const completedGoals = goals.filter(g => g.completed).length;

    let current = 0;
    let target = 0;

    switch (badge) {
      case 'first_task':
        current = completedTasks;
        target = 1;
        break;
      case 'task_master_10':
        current = completedTasks;
        target = 10;
        break;
      case 'task_master_50':
        current = completedTasks;
        target = 50;
        break;
      case 'goal_setter':
        current = goals.length;
        target = 1;
        break;
      case 'goal_achiever_5':
        current = completedGoals;
        target = 5;
        break;
      case 'pomodoro_master':
        current = sessions.length;
        target = 10;
        break;
      case 'pomodoro_guru':
        current = sessions.length;
        target = 50;
        break;
      case 'note_taker':
        current = notes.length;
        target = 1;
        break;
      case 'week_streak_7':
        current = streak;
        target = 7;
        break;
      case 'month_streak_30':
        current = streak;
        target = 30;
        break;
      case 'productivity_80':
        current = score;
        target = 80;
        break;
      case 'multi_tasker':
        current = tasks.filter(t => !t.completed).length;
        target = 10;
        break;
      case 'perfectionist':
        current = tasks.length > 0 ? completedTasks : 0;
        target = tasks.length || 1;
        break;
    }

    const progress = Math.round((current / target) * 100);

    return {
      badge,
      title: achievement.title,
      current,
      target,
      progress: Math.min(progress, 100),
      isUnlocked: storage.hasAchievement(badge),
      color: achievement.color
    };
  }

  getAllAchievementsProgress() {
    return this.achievements.map(a => this.getAchievementProgress(a.badge));
  }

  /* ========================================
     NOTIFICATIONS
     ======================================== */

  notifyProgress(badge) {
    const progress = this.getAchievementProgress(badge);
    if (progress.progress === 100 && !progress.isUnlocked) {
      this.unlockAchievement(badge);
    } else if (progress.progress % 25 === 0) {
      // Milestone notifications
      const achievement = this.achievements.find(a => a.badge === badge);
      if (achievement) {
        notifier.info(`${achievement.title}: ${progress.progress}% complete`);
      }
    }
  }
}

// Create global achievement system
const achievements = new AchievementSystem();

console.log('AchievementSystem initialized');
