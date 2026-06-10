/* ========================================
   STUDYOS - MAIN APPLICATION
   Core Application Logic
   ======================================== */

class StudyOSApp {
  constructor() {
    this.isInitialized = false;
    this.currentPage = null;
    this.init();
  }

  /* ========================================
     INITIALIZATION
     ======================================== */

  init() {
    this.loadTheme();
    this.setupEventListeners();
    this.initializeDefaults();
    this.isInitialized = true;
    console.log('StudyOS App Initialized');
  }

  /* ========================================
     THEME MANAGEMENT
     ======================================== */

  loadTheme() {
    const prefs = storage.getUserPreferences();
    const theme = prefs.theme || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeButtons(theme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    storage.updateUserPreference('theme', theme);
    this.updateThemeButtons(theme);
    this.showNotification('Theme changed to ' + theme, 'success');
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  updateThemeButtons(theme) {
    const darkBtn = document.querySelector('[data-theme-btn="dark"]');
    const lightBtn = document.querySelector('[data-theme-btn="light"]');
    
    if (darkBtn) darkBtn.classList.toggle('active', theme === 'dark');
    if (lightBtn) lightBtn.classList.toggle('active', theme === 'light');
  }

  /* ========================================
     NAVIGATION
     ======================================== */

  setupEventListeners() {
    // Theme buttons
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
      btn.addEventListener('click', () => this.setTheme(btn.dataset.themeBtn));
    });

    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav-link').forEach(link => {
      link.addEventListener('click', (e) => this.handleNavigation(e));
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('[data-mobile-menu-toggle]');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Dropdown menus
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => this.toggleDropdown(e));
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.active').forEach(d => {
          d.classList.remove('active');
        });
      }
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.closest('.modal-backdrop');
        if (modal) this.closeModal(modal);
      });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.closeModal(backdrop);
        }
      });
    });
  }

  handleNavigation(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      window.location.href = href;
    }
  }

  toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('mobile-open');
    }
  }

  toggleDropdown(e) {
    e.preventDefault();
    const dropdown = e.currentTarget.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
  }

  /* ========================================
     MODAL MANAGEMENT
     ======================================== */

  openModal(selector) {
    const modal = document.querySelector(selector);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(selector) {
    let modal;
    if (typeof selector === 'string') {
      modal = document.querySelector(selector);
    } else {
      modal = selector;
    }
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
      this.closeModal(modal);
    });
  }

  /* ========================================
     NOTIFICATIONS
     ======================================== */

  showNotification(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slideInRight`;
    toast.innerHTML = `
      <div class="flex-between">
        <span>${message}</span>
        <button class="toast-close" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">×</button>
      </div>
    `;

    document.body.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 300ms ease-in-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
  }

  showSuccess(message, duration = 3000) {
    return this.showNotification(message, 'success', duration);
  }

  showError(message, duration = 3000) {
    return this.showNotification(message, 'error', duration);
  }

  showWarning(message, duration = 3000) {
    return this.showNotification(message, 'warning', duration);
  }

  showInfo(message, duration = 3000) {
    return this.showNotification(message, 'info', duration);
  }

  /* ========================================
     CONFIRMATION DIALOGS
     ======================================== */

  confirm(message) {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop active';
      backdrop.innerHTML = `
        <div class="modal" style="max-width: 400px;">
          <div class="modal-header">
            <h3 class="modal-title">Confirm</h3>
            <button class="modal-close">×</button>
          </div>
          <div class="modal-body">
            <p>${message}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary cancel-btn">Cancel</button>
            <button class="btn btn-primary confirm-btn">Confirm</button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      document.body.style.overflow = 'hidden';

      const confirmBtn = backdrop.querySelector('.confirm-btn');
      const cancelBtn = backdrop.querySelector('.cancel-btn');
      const closeBtn = backdrop.querySelector('.modal-close');

      const cleanup = () => {
        document.body.style.overflow = '';
        backdrop.remove();
      };

      confirmBtn.addEventListener('click', () => {
        resolve(true);
        cleanup();
      });

      cancelBtn.addEventListener('click', () => {
        resolve(false);
        cleanup();
      });

      closeBtn.addEventListener('click', () => {
        resolve(false);
        cleanup();
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          resolve(false);
          cleanup();
        }
      });
    });
  }

  /* ========================================
     LOADING STATES
     ======================================== */

  showLoader(container = 'body') {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);';
    
    if (container === 'body') {
      document.body.appendChild(loader);
    } else {
      const containerEl = document.querySelector(container);
      if (containerEl) containerEl.appendChild(loader);
    }
    
    return loader;
  }

  hideLoader(loader) {
    if (loader && loader.parentNode) {
      loader.remove();
    }
  }

  /* ========================================
     FORM UTILITIES
     ======================================== */

  validateForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return false;

    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateInput(input) {
    let isValid = true;

    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      input.classList.add('input-error');
    } else if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        isValid = false;
        input.classList.add('input-error');
      }
    } else {
      input.classList.remove('input-error');
    }

    return isValid;
  }

  getFormData(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return null;

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => {
      if (obj[key]) {
        if (Array.isArray(obj[key])) {
          obj[key].push(value);
        } else {
          obj[key] = [obj[key], value];
        }
      } else {
        obj[key] = value;
      }
    });

    return obj;
  }

  /* ========================================
     UTILITIES
     ======================================== */

  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateTime(date) {
    return `${this.formatDate(date)} ${this.formatTime(date)}`;
  }

  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return this.formatDate(date);
  }

  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /* ========================================
     INITIALIZATION DEFAULTS
     ======================================== */

  initializeDefaults() {
    // Create default user preferences if not exist
    if (!storage.get('user_preferences')) {
      storage.setUserPreferences({
        theme: 'light',
        language: 'en',
        dailyTarget: 240,
        notifications: true,
        autoSave: true
      });
    }

    // Initialize other collections if empty
    if (!storage.get('tasks')) storage.set('tasks', []);
    if (!storage.get('goals')) storage.set('goals', []);
    if (!storage.get('notes')) storage.set('notes', []);
    if (!storage.get('study_plan')) storage.set('study_plan', {});
    if (!storage.get('calendar_events')) storage.set('calendar_events', []);
    if (!storage.get('achievements')) storage.set('achievements', []);
    if (!storage.get('daily_activities')) storage.set('daily_activities', []);
    if (!storage.get('pomodoro_sessions')) storage.set('pomodoro_sessions', []);
  }

  /* ========================================
     PAGE ROUTING
     ======================================== */

  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
  }

  isPage(pageName) {
    return this.getCurrentPage() === pageName;
  }

  /* ========================================
     VISIBILITY & ACCESSIBILITY
     ======================================== */

  setAriaLabel(element, label) {
    element.setAttribute('aria-label', label);
  }

  setAriaLive(element, politeness = 'polite') {
    element.setAttribute('aria-live', politeness);
  }

  setAriaHidden(element, hidden = true) {
    element.setAttribute('aria-hidden', hidden);
  }
}

// Create global app instance
const app = new StudyOSApp();

// Add custom CSS for input errors
const style = document.createElement('style');
style.textContent = `
  .input-error {
    border-color: var(--accent-red) !important;
    color: var(--accent-red) !important;
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);

console.log('StudyOS App initialized');
