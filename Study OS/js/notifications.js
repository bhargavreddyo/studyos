/* ========================================
   NOTIFICATIONS SYSTEM
   Toast & Alert Management
   ======================================== */

class NotificationSystem {
  constructor() {
    this.notifications = [];
    this.container = this.createContainer();
  }

  createContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 700;
      max-width: 500px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
    return container;
  }

  show(options = {}) {
    const {
      title = '',
      message = '',
      type = 'info',
      duration = 4000,
      action = null,
      onClose = null
    } = options;

    const notification = document.createElement('div');
    notification.className = `toast toast-${type} animate-slideInRight`;
    notification.style.cssText = `
      pointer-events: auto;
      margin-bottom: 12px;
    `;

    let html = `
      <div class="flex-between">
        <div>
          ${title ? `<strong>${title}</strong>` : ''}
          ${message ? `<p style="margin: 0; color: inherit;">${message}</p>` : ''}
        </div>
        <button class="notification-close" style="background: none; border: none; cursor: pointer; font-size: 1.5rem; color: inherit; padding: 0; margin-left: 16px;">×</button>
      </div>
    `;

    if (action) {
      html += `
        <div style="margin-top: 12px;">
          <button class="btn btn-sm" style="width: 100%;">${action.label}</button>
        </div>
      `;
    }

    notification.innerHTML = html;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.remove(notification, onClose));

    if (action) {
      const actionBtn = notification.querySelector('.btn');
      actionBtn.addEventListener('click', () => {
        action.callback();
        this.remove(notification, onClose);
      });
    }

    this.container.appendChild(notification);
    this.notifications.push(notification);

    if (duration > 0) {
      setTimeout(() => this.remove(notification, onClose), duration);
    }

    return notification;
  }

  remove(notification, onClose = null) {
    notification.style.animation = 'slideOutRight 300ms ease-in-out';
    setTimeout(() => {
      notification.remove();
      this.notifications = this.notifications.filter(n => n !== notification);
      if (onClose) onClose();
    }, 300);
  }

  success(message, duration = 3000) {
    return this.show({
      title: '✓ Success',
      message,
      type: 'success',
      duration
    });
  }

  error(message, duration = 4000) {
    return this.show({
      title: '✕ Error',
      message,
      type: 'error',
      duration
    });
  }

  warning(message, duration = 3500) {
    return this.show({
      title: '⚠ Warning',
      message,
      type: 'warning',
      duration
    });
  }

  info(message, duration = 3000) {
    return this.show({
      title: 'ℹ Info',
      message,
      type: 'info',
      duration
    });
  }

  confirm(message, onConfirm, onCancel) {
    return this.show({
      title: 'Confirm Action',
      message,
      type: 'info',
      duration: 0,
      action: {
        label: 'Confirm',
        callback: onConfirm
      },
      onClose: onCancel
    });
  }

  clearAll() {
    this.notifications.forEach(notification => this.remove(notification));
  }
}

// Create global notification instance
const notifier = new NotificationSystem();

console.log('NotificationSystem initialized');
