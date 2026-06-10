/* ========================================
   STUDYOS - LOCALSTORAGE MANAGEMENT
   Data Persistence Layer
   ======================================== */

class StorageManager {
  constructor() {
    this.prefix = 'studyos_';
  }

  /* ========================================
     GENERIC STORAGE METHODS
     ======================================== */

  set(key, data) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage Error:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Retrieval Error:', error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Removal Error:', error);
      return false;
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Clear Error:', error);
      return false;
    }
  }

  getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        keys.push(key.replace(this.prefix, ''));
      }
    }
    return keys;
  }

  /* ========================================
     USER PREFERENCES
     ======================================== */

  setUserPreferences(prefs) {
    return this.set('user_preferences', {
      theme: prefs.theme || 'light',
      language: prefs.language || 'en',
      dailyTarget: prefs.dailyTarget || 240,
      notifications: prefs.notifications !== false,
      autoSave: prefs.autoSave !== false,
      ...prefs
    });
  }

  getUserPreferences() {
    return this.get('user_preferences', {
      theme: 'light',
      language: 'en',
      dailyTarget: 240,
      notifications: true,
      autoSave: true
    });
  }

  updateUserPreference(key, value) {
    const prefs = this.getUserPreferences();
    prefs[key] = value;
    return this.setUserPreferences(prefs);
  }

  /* ========================================
     TASKS
     ======================================== */

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      completed: false,
      ...task
    };
    tasks.push(newTask);
    this.set('tasks', tasks);
    return newTask;
  }

  getTasks() {
    return this.get('tasks', []);
  }

  getTaskById(id) {
    const tasks = this.getTasks();
    return tasks.find(task => task.id === parseInt(id));
  }

  updateTask(id, updates) {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
      this.set('tasks', tasks);
      return tasks[taskIndex];
    }
    return null;
  }

  deleteTask(id) {
    const tasks = this.getTasks().filter(task => task.id !== parseInt(id));
    this.set('tasks', tasks);
    return true;
  }

  getTasksByCategory(category) {
    return this.getTasks().filter(task => task.category === category);
  }

  getTasksByPriority(priority) {
    return this.getTasks().filter(task => task.priority === priority);
  }

  getCompletedTasks() {
    return this.getTasks().filter(task => task.completed);
  }

  getPendingTasks() {
    return this.getTasks().filter(task => !task.completed);
  }

  /* ========================================
     GOALS
     ======================================== */

  addGoal(goal) {
    const goals = this.getGoals();
    const newGoal = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      completed: false,
      progress: 0,
      ...goal
    };
    goals.push(newGoal);
    this.set('goals', goals);
    return newGoal;
  }

  getGoals() {
    return this.get('goals', []);
  }

  getGoalById(id) {
    const goals = this.getGoals();
    return goals.find(goal => goal.id === parseInt(id));
  }

  updateGoal(id, updates) {
    const goals = this.getGoals();
    const goalIndex = goals.findIndex(goal => goal.id === parseInt(id));
    if (goalIndex !== -1) {
      goals[goalIndex] = { ...goals[goalIndex], ...updates, updatedAt: new Date().toISOString() };
      this.set('goals', goals);
      return goals[goalIndex];
    }
    return null;
  }

  deleteGoal(id) {
    const goals = this.getGoals().filter(goal => goal.id !== parseInt(id));
    this.set('goals', goals);
    return true;
  }

  getGoalsByType(type) {
    return this.getGoals().filter(goal => goal.type === type);
  }

  /* ========================================
     NOTES
     ======================================== */

  addNote(note) {
    const notes = this.getNotes();
    const newNote = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      pinned: false,
      favorite: false,
      ...note
    };
    notes.push(newNote);
    this.set('notes', notes);
    return newNote;
  }

  getNotes() {
    return this.get('notes', []);
  }

  getNoteById(id) {
    const notes = this.getNotes();
    return notes.find(note => note.id === parseInt(id));
  }

  updateNote(id, updates) {
    const notes = this.getNotes();
    const noteIndex = notes.findIndex(note => note.id === parseInt(id));
    if (noteIndex !== -1) {
      notes[noteIndex] = { ...notes[noteIndex], ...updates, updatedAt: new Date().toISOString() };
      this.set('notes', notes);
      return notes[noteIndex];
    }
    return null;
  }

  deleteNote(id) {
    const notes = this.getNotes().filter(note => note.id !== parseInt(id));
    this.set('notes', notes);
    return true;
  }

  searchNotes(query) {
    return this.getNotes().filter(note =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
  }

  getNotesByCategory(category) {
    return this.getNotes().filter(note => note.category === category);
  }

  getPinnedNotes() {
    return this.getNotes().filter(note => note.pinned);
  }

  getFavoriteNotes() {
    return this.getNotes().filter(note => note.favorite);
  }

  /* ========================================
     POMODORO SESSIONS
     ======================================== */

  addPomodoroSession(session) {
    const sessions = this.getPomodorSessions();
    const newSession = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...session
    };
    sessions.push(newSession);
    this.set('pomodoro_sessions', sessions);
    return newSession;
  }

  getPomodorSessions() {
    return this.get('pomodoro_sessions', []);
  }

  getTodayPomodorSessions() {
    const sessions = this.getPomodorSessions();
    const today = new Date().toDateString();
    return sessions.filter(session => new Date(session.createdAt).toDateString() === today);
  }

  /* ========================================
     STUDY PLANS
     ======================================== */

  setStudyPlan(plan) {
    return this.set('study_plan', {
      subjects: [],
      weeklySchedule: {},
      goals: [],
      ...plan
    });
  }

  getStudyPlan() {
    return this.get('study_plan', {
      subjects: [],
      weeklySchedule: {},
      goals: []
    });
  }

  addSubject(subject) {
    const plan = this.getStudyPlan();
    plan.subjects.push({
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...subject
    });
    this.setStudyPlan(plan);
    return plan.subjects[plan.subjects.length - 1];
  }

  getSubjects() {
    const plan = this.getStudyPlan();
    return plan.subjects || [];
  }

  deleteSubject(id) {
    const plan = this.getStudyPlan();
    plan.subjects = plan.subjects.filter(s => s.id !== parseInt(id));
    this.setStudyPlan(plan);
    return true;
  }

  /* ========================================
     CALENDAR EVENTS
     ======================================== */

  addCalendarEvent(event) {
    const events = this.getCalendarEvents();
    const newEvent = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...event
    };
    events.push(newEvent);
    this.set('calendar_events', events);
    return newEvent;
  }

  getCalendarEvents() {
    return this.get('calendar_events', []);
  }

  getCalendarEventById(id) {
    return this.getCalendarEvents().find(event => event.id === parseInt(id));
  }

  updateCalendarEvent(id, updates) {
    const events = this.getCalendarEvents();
    const eventIndex = events.findIndex(event => event.id === parseInt(id));
    if (eventIndex !== -1) {
      events[eventIndex] = { ...events[eventIndex], ...updates, updatedAt: new Date().toISOString() };
      this.set('calendar_events', events);
      return events[eventIndex];
    }
    return null;
  }

  deleteCalendarEvent(id) {
    const events = this.getCalendarEvents().filter(event => event.id !== parseInt(id));
    this.set('calendar_events', events);
    return true;
  }

  getEventsByDate(date) {
    return this.getCalendarEvents().filter(event => {
      const eventDate = new Date(event.date).toDateString();
      return eventDate === new Date(date).toDateString();
    });
  }

  /* ========================================
     PRODUCTIVITY SCORE
     ======================================== */

  setProductivityScore(score) {
    return this.set('productivity_score', {
      percentage: score.percentage || 0,
      level: score.level || 'Beginner',
      completedTasks: score.completedTasks || 0,
      studyHours: score.studyHours || 0,
      focusSessions: score.focusSessions || 0,
      streak: score.streak || 0,
      lastUpdated: new Date().toISOString(),
      ...score
    });
  }

  getProductivityScore() {
    return this.get('productivity_score', {
      percentage: 0,
      level: 'Beginner',
      completedTasks: 0,
      studyHours: 0,
      focusSessions: 0,
      streak: 0
    });
  }

  /* ========================================
     ACHIEVEMENTS & BADGES
     ======================================== */

  addAchievement(achievement) {
    const achievements = this.getAchievements();
    const newAchievement = {
      id: Date.now(),
      unlockedAt: new Date().toISOString(),
      ...achievement
    };
    achievements.push(newAchievement);
    this.set('achievements', achievements);
    return newAchievement;
  }

  getAchievements() {
    return this.get('achievements', []);
  }

  hasAchievement(badge) {
    return this.getAchievements().some(a => a.badge === badge);
  }

  /* ========================================
     DAILY ACTIVITY
     ======================================== */

  addDailyActivity(activity) {
    const activities = this.getDailyActivities();
    activities.push({
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      ...activity
    });
    this.set('daily_activities', activities);
    return true;
  }

  getDailyActivities() {
    return this.get('daily_activities', []);
  }

  getTodayActivities() {
    const activities = this.getDailyActivities();
    const today = new Date().toISOString().split('T')[0];
    return activities.filter(a => a.date === today);
  }

  /* ========================================
     ANALYTICS DATA
     ======================================== */

  setAnalyticsData(data) {
    return this.set('analytics_data', {
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: [],
      ...data
    });
  }

  getAnalyticsData() {
    return this.get('analytics_data', {
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: []
    });
  }

  addDailyStat(stat) {
    const data = this.getAnalyticsData();
    if (!data.dailyStats) data.dailyStats = [];
    data.dailyStats.push({
      date: new Date().toISOString().split('T')[0],
      ...stat
    });
    this.setAnalyticsData(data);
    return true;
  }

  /* ========================================
     DATA BACKUP & RESTORE
     ======================================== */

  exportData() {
    const allData = {};
    const keys = this.getAllKeys();
    keys.forEach(key => {
      allData[key] = this.get(key);
    });
    return JSON.stringify(allData);
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      Object.keys(data).forEach(key => {
        this.set(key, data[key]);
      });
      return true;
    } catch (error) {
      console.error('Import Error:', error);
      return false;
    }
  }

  downloadDataAsFile() {
    const data = this.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studyos-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /* ========================================
     STORAGE STATISTICS
     ======================================== */

  getStorageStats() {
    let totalSize = 0;
    const keys = this.getAllKeys();
    keys.forEach(key => {
      const value = localStorage.getItem(this.prefix + key);
      totalSize += value ? value.length : 0;
    });
    return {
      itemCount: keys.length,
      totalSize: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      limits: {
        totalSize: 5242880, // 5MB
        remaining: (5242880 - totalSize) / 1024
      }
    };
  }

  isStorageLow() {
    const stats = this.getStorageStats();
    return stats.limits.remaining < 500; // Less than 500KB remaining
  }
}

// Create global storage instance
const storage = new StorageManager();

// Auto-save function
function autoSave() {
  const prefs = storage.getUserPreferences();
  if (prefs.autoSave) {
    // Auto-save logic will be implemented in individual page scripts
    console.log('Auto-save triggered');
  }
}

// Initialize auto-save interval (every 5 minutes)
setInterval(autoSave, 5 * 60 * 1000);

console.log('StorageManager initialized');
