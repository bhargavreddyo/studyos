/* ========================================
   DASHBOARD PAGE LOGIC
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

function initDashboard() {
  updateProductivityMetrics();
  displayUpcomingDeadlines();
  displayProductivityInsights();
  displaySuggestions();
  displayRecentActivity();
  
  // Update metrics every minute
  setInterval(updateProductivityMetrics, 60 * 1000);
}

/* ========================================
   UPDATE PRODUCTIVITY METRICS
   ======================================== */

function updateProductivityMetrics() {
  const scoreData = productivityCalculator.updateProductivityScore();
  
  // Update productivity score
  document.getElementById('productivity-score').textContent = scoreData.percentage + '%';
  
  // Update focus hours
  const studyHours = scoreData.studyHours;
  const hours = Math.floor(studyHours);
  const minutes = Math.round((studyHours - hours) * 60);
  document.getElementById('focus-hours').textContent = `${hours}h ${minutes}m`;
  
  // Update tasks completed
  const completedCount = scoreData.completedTasks;
  const totalCount = storage.getTasks().length || 0;
  document.getElementById('tasks-completed').textContent = `${completedCount}/${totalCount}`;
  
  // Update streak
  document.getElementById('current-streak').textContent = scoreData.streak;
}

/* ========================================
   DISPLAY UPCOMING DEADLINES
   ======================================== */

function displayUpcomingDeadlines() {
  const tasks = storage.getTasks()
    .filter(t => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const container = document.getElementById('upcoming-deadlines');
  
  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎉</div>
        <div class="empty-state-title">No deadlines</div>
        <div class="empty-state-text">You're all caught up!</div>
      </div>
    `;
    return;
  }

  container.innerHTML = tasks.map(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    let urgencyClass = 'positive';
    if (daysUntil <= 0) urgencyClass = 'danger';
    else if (daysUntil <= 3) urgencyClass = 'negative';

    return `
      <div class="list-item">
        <div class="list-item-icon" style="background: ${getPriorityColor(task.priority)}20; color: ${getPriorityColor(task.priority)};">
          ${getPriorityIcon(task.priority)}
        </div>
        <div class="list-item-content">
          <div class="list-item-title">${task.title}</div>
          <div class="list-item-subtitle">Due ${formatDueDate(task.dueDate)} • ${task.category}</div>
        </div>
        <span class="badge badge-${urgencyClass === 'positive' ? 'primary' : urgencyClass === 'negative' ? 'warning' : 'danger'}">
          ${daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : daysUntil + 'd left'}
        </span>
      </div>
    `;
  }).join('');
}

/* ========================================
   DISPLAY PRODUCTIVITY INSIGHTS
   ======================================== */

function displayProductivityInsights() {
  const scoreData = productivityCalculator.updateProductivityScore();
  const insights = scoreData.insights || [];

  const container = document.getElementById('insights-container');
  
  if (insights.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">No insights available yet. Keep studying!</p>';
    return;
  }

  container.innerHTML = insights.map(insight => {
    const icons = {
      positive: '✓',
      warning: '⚠️',
      suggestion: '💡'
    };

    return `
      <div style="padding: var(--spacing-md); background: var(--bg-secondary); border-radius: var(--radius-lg); border-left: 4px solid ${getInsightColor(insight.type)};">
        <strong>${icons[insight.type]} ${insight.title}</strong>
        <p style="margin: var(--spacing-sm) 0 0 0; color: var(--text-secondary);">${insight.message}</p>
      </div>
    `;
  }).join('');
}

/* ========================================
   DISPLAY IMPROVEMENT SUGGESTIONS
   ======================================== */

function displaySuggestions() {
  const scoreData = productivityCalculator.updateProductivityScore();
  const suggestions = scoreData.suggestions || [];

  const container = document.getElementById('suggestions-container');
  
  if (suggestions.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">Great job! You\'re doing well. Keep up the momentum!</p>';
    return;
  }

  container.innerHTML = suggestions.map(suggestion => {
    const priorityColor = suggestion.priority === 'high' ? var('--accent-red') : 
                         suggestion.priority === 'medium' ? var('--accent-yellow') : 
                         var('--accent-green');

    return `
      <div style="padding: var(--spacing-md); background: var(--bg-secondary); border-radius: var(--radius-lg); border-left: 4px solid ${priorityColor};">
        <strong>${suggestion.title}</strong>
        <p style="margin: var(--spacing-sm) 0 0 0; color: var(--text-secondary);">${suggestion.suggestion}</p>
      </div>
    `;
  }).join('');
}

/* ========================================
   DISPLAY RECENT ACTIVITY
   ======================================== */

function displayRecentActivity() {
  const tasks = storage.getTasks();
  const goals = storage.getGoals();
  const notes = storage.getNotes();

  const activities = [
    ...tasks.filter(t => t.updatedAt).map(t => ({
      type: 'task',
      title: t.title,
      time: t.updatedAt,
      status: t.completed ? 'completed' : 'updated'
    })),
    ...goals.filter(g => g.updatedAt).map(g => ({
      type: 'goal',
      title: g.title,
      time: g.updatedAt,
      status: 'updated'
    })),
    ...notes.filter(n => n.updatedAt).map(n => ({
      type: 'note',
      title: n.title,
      time: n.updatedAt,
      status: 'updated'
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  const container = document.getElementById('recent-activity');

  if (activities.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <div class="empty-state-title">No activity yet</div>
        <div class="empty-state-text">Start adding tasks, goals, or notes to see your activity here</div>
      </div>
    `;
    return;
  }

  const activityIcons = {
    task: '✓',
    goal: '🎯',
    note: '📝'
  };

  container.innerHTML = `
    <div style="display: grid; gap: var(--spacing-md);">
      ${activities.map(activity => `
        <div class="list-item">
          <div class="list-item-icon" style="background: var(--bg-secondary);">
            ${activityIcons[activity.type]}
          </div>
          <div class="list-item-content">
            <div class="list-item-title">${activity.title}</div>
            <div class="list-item-subtitle">${app.getTimeAgo(activity.time)}</div>
          </div>
          <span class="badge badge-primary">${activity.status}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/* ========================================
   HELPER FUNCTIONS
   ======================================== */

function getPriorityIcon(priority) {
  const icons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
    urgent: '⚡'
  };
  return icons[priority] || '◯';
}

function getPriorityColor(priority) {
  const colors = {
    low: 'var(--accent-green)',
    medium: 'var(--accent-yellow)',
    high: 'var(--accent-red)',
    urgent: '#ef4444'
  };
  return colors[priority] || 'var(--text-secondary)';
}

function formatDueDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'today at ' + app.formatTime(date);
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'tomorrow at ' + app.formatTime(date);
  }
  return app.formatDate(date);
}

function getInsightColor(type) {
  const colors = {
    positive: 'var(--accent-green)',
    warning: 'var(--accent-yellow)',
    suggestion: 'var(--primary-color)'
  };
  return colors[type] || 'var(--primary-color)';
}

console.log('Dashboard initialized');
