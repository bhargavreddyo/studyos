/* ========================================
   POMODORO TIMER LOGIC
   ======================================== */

let timerInterval = null;
let isRunning = false;
let timeRemaining = 25 * 60;
let sessionType = 'focus';
let focusDuration = 25;
let breakDuration = 5;

document.addEventListener('DOMContentLoaded', () => {
  updateDisplay();
  displaySessionHistory();
  document.getElementById('focus-duration').addEventListener('change', (e) => {
    focusDuration = parseInt(e.target.value);
    resetTimer();
  });
  document.getElementById('break-duration').addEventListener('change', (e) => {
    breakDuration = parseInt(e.target.value);
    resetTimer();
  });
});

function updateDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  document.getElementById('timer-display').textContent = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  document.title = `${minutes}:${String(seconds).padStart(2, '0')} - StudyOS`;
}

function startTimer() {
  if (isRunning) return;
  
  isRunning = true;
  document.getElementById('start-btn').style.display = 'none';
  document.getElementById('pause-btn').style.display = 'block';
  
  timerInterval = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      updateDisplay();
    } else {
      completeSession();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  document.getElementById('start-btn').style.display = 'block';
  document.getElementById('pause-btn').style.display = 'none';
}

function resetTimer() {
  pauseTimer();
  sessionType = 'focus';
  timeRemaining = focusDuration * 60;
  updateDisplay();
}

function completeSession() {
  pauseTimer();
  
  // Save session
  const session = storage.addPomodoroSession({
    type: sessionType,
    duration: sessionType === 'focus' ? focusDuration : breakDuration,
    completed: true
  });

  if (sessionType === 'focus') {
    notifier.success(`🍅 Focus session completed! Take a ${breakDuration} minute break.`);
    sessionType = 'break';
    timeRemaining = breakDuration * 60;
  } else {
    notifier.success('☕ Break over! Ready for another focus session?');
    sessionType = 'focus';
    timeRemaining = focusDuration * 60;
  }

  updateDisplay();
  displaySessionHistory();
  productivityCalculator.updateProductivityScore();
  achievements.checkAndUnlock('pomodoro_master');
  achievements.checkAndUnlock('pomodoro_guru');
  
  // Update session count
  const todaySessions = storage.getPomodorSessions()
    .filter(s => s.createdAt.startsWith(new Date().toISOString().split('T')[0]) && s.type === 'focus')
    .length;
  document.getElementById('session-count').textContent = todaySessions;
}

function displaySessionHistory() {
  const today = new Date().toISOString().split('T')[0];
  const sessions = storage.getPomodorSessions()
    .filter(s => s.createdAt.startsWith(today))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const container = document.getElementById('session-history');
  
  if (sessions.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No sessions today yet</p>';
    return;
  }

  const focusSessions = sessions.filter(s => s.type === 'focus').length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); margin-bottom: var(--spacing-lg);">
      <div class="stat-card">
        <div class="stat-card-value" style="color: var(--accent-green);">${focusSessions}</div>
        <div class="stat-card-label">Focus Sessions</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-value" style="color: var(--primary-color);">${totalMinutes} min</div>
        <div class="stat-card-label">Total Time</div>
      </div>
    </div>
    <div style="display: grid; gap: var(--spacing-md);">
      ${sessions.map((s, i) => `
        <div style="padding: var(--spacing-md); background: var(--bg-secondary); border-radius: var(--radius-lg); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${s.type === 'focus' ? '🍅 Focus' : '☕ Break'} Session</strong>
            <p style="margin: var(--spacing-sm) 0 0 0; color: var(--text-secondary); font-size: 0.9rem;">${app.formatTime(s.createdAt)}</p>
          </div>
          <span class="badge badge-primary">${s.duration}m</span>
        </div>
      `).join('')}
    </div>
  `;
}

console.log('Pomodoro timer initialized');
