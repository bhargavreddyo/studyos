/* ========================================
   VALIDATION SYSTEM
   Form and data validation utilities
   ======================================== */

class Validator {
  /* ========================================
     TEXT VALIDATIONS
     ======================================== */

  static isRequired(value) {
    return value !== null && value !== undefined && String(value).trim() !== '';
  }

  static isEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  static isPhone(value) {
    const phoneRegex = /^[0-9\-\+\s\(\)]+$/;
    return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  }

  static isURL(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  static hasMinLength(value, length) {
    return String(value).length >= length;
  }

  static hasMaxLength(value, length) {
    return String(value).length <= length;
  }

  static isAlphanumeric(value) {
    return /^[a-zA-Z0-9]+$/.test(value);
  }

  static isNumeric(value) {
    return /^[0-9]+$/.test(value);
  }

  static isUsername(value) {
    return /^[a-zA-Z0-9_\-]{3,20}$/.test(value);
  }

  /* ========================================
     DATE VALIDATIONS
     ======================================== */

  static isValidDate(value) {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date);
  }

  static isFutureDate(value) {
    return new Date(value) > new Date();
  }

  static isPastDate(value) {
    return new Date(value) < new Date();
  }

  static isDateBefore(value, compareDate) {
    return new Date(value) < new Date(compareDate);
  }

  static isDateAfter(value, compareDate) {
    return new Date(value) > new Date(compareDate);
  }

  /* ========================================
     NUMBER VALIDATIONS
     ======================================== */

  static isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static isPositive(value) {
    return parseFloat(value) > 0;
  }

  static isNegative(value) {
    return parseFloat(value) < 0;
  }

  static isBetween(value, min, max) {
    const num = parseFloat(value);
    return num >= min && num <= max;
  }

  static isPercentage(value) {
    return this.isBetween(value, 0, 100);
  }

  /* ========================================
     TASK VALIDATIONS
     ======================================== */

  static isValidTaskTitle(title) {
    return this.isRequired(title) && this.hasMinLength(title, 3) && this.hasMaxLength(title, 100);
  }

  static isValidTaskDescription(description) {
    return description === '' || this.hasMaxLength(description, 500);
  }

  static isValidTaskPriority(priority) {
    return ['low', 'medium', 'high', 'urgent'].includes(priority.toLowerCase());
  }

  static isValidTaskCategory(category) {
    return this.isRequired(category) && this.hasMinLength(category, 2);
  }

  static isValidTaskDueDate(dueDate) {
    return !dueDate || (this.isValidDate(dueDate) && this.isFutureDate(dueDate));
  }

  /* ========================================
     GOAL VALIDATIONS
     ======================================== */

  static isValidGoalTitle(title) {
    return this.isRequired(title) && this.hasMinLength(title, 3) && this.hasMaxLength(title, 150);
  }

  static isValidGoalType(type) {
    return ['academic', 'skill', 'placement', 'certification'].includes(type.toLowerCase());
  }

  static isValidGoalProgress(progress) {
    return this.isPercentage(progress);
  }

  static isValidGoalDeadline(deadline) {
    return !deadline || (this.isValidDate(deadline) && this.isFutureDate(deadline));
  }

  /* ========================================
     NOTE VALIDATIONS
     ======================================== */

  static isValidNoteTitle(title) {
    return this.isRequired(title) && this.hasMinLength(title, 2) && this.hasMaxLength(title, 150);
  }

  static isValidNoteContent(content) {
    return this.isRequired(content) && this.hasMinLength(content, 5) && this.hasMaxLength(content, 5000);
  }

  static isValidNoteCategory(category) {
    return this.isRequired(category) && this.hasMinLength(category, 2);
  }

  /* ========================================
     POMODORO VALIDATIONS
     ======================================== */

  static isValidTimerDuration(minutes) {
    return this.isNumber(minutes) && this.isBetween(minutes, 1, 120);
  }

  static isValidSessionType(type) {
    return ['focus', 'short_break', 'long_break'].includes(type.toLowerCase());
  }

  /* ========================================
     FORM VALIDATION
     ======================================== */

  static validateForm(formData, schema) {
    const errors = {};

    Object.keys(schema).forEach(field => {
      const rules = schema[field];
      const value = formData[field];

      if (rules.required && !this.isRequired(value)) {
        errors[field] = `${field} is required`;
        return;
      }

      if (rules.type === 'email' && value && !this.isEmail(value)) {
        errors[field] = 'Please enter a valid email';
        return;
      }

      if (rules.type === 'phone' && value && !this.isPhone(value)) {
        errors[field] = 'Please enter a valid phone number';
        return;
      }

      if (rules.type === 'url' && value && !this.isURL(value)) {
        errors[field] = 'Please enter a valid URL';
        return;
      }

      if (rules.minLength && value && !this.hasMinLength(value, rules.minLength)) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
        return;
      }

      if (rules.maxLength && value && !this.hasMaxLength(value, rules.maxLength)) {
        errors[field] = `${field} must not exceed ${rules.maxLength} characters`;
        return;
      }

      if (rules.pattern && value && !rules.pattern.test(String(value))) {
        errors[field] = `${field} format is invalid`;
        return;
      }

      if (rules.custom && !rules.custom(value)) {
        errors[field] = rules.customMessage || `${field} validation failed`;
        return;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /* ========================================
     BATCH VALIDATION
     ======================================== */

  static validateArray(items, schema) {
    return items.map(item => this.validateForm(item, schema));
  }

  /* ========================================
     ERROR MESSAGES
     ======================================== */

  static getErrorMessage(field, type) {
    const messages = {
      required: `${field} is required`,
      email: 'Please enter a valid email',
      phone: 'Please enter a valid phone number',
      url: 'Please enter a valid URL',
      minLength: `${field} is too short`,
      maxLength: `${field} is too long`,
      pattern: `${field} format is invalid`,
      number: `${field} must be a number`,
      date: 'Please enter a valid date',
      futureDate: 'Date must be in the future',
      pastDate: 'Date must be in the past'
    };
    return messages[type] || 'Invalid input';
  }
}

/* ========================================
   DOM VALIDATION HELPERS
   ======================================== */

function showFieldError(fieldElement, message) {
  fieldElement.classList.add('input-error');
  let errorElement = fieldElement.nextElementSibling;
  
  if (!errorElement || !errorElement.classList.contains('field-error')) {
    errorElement = document.createElement('small');
    errorElement.className = 'field-error';
    errorElement.style.cssText = 'color: var(--accent-red); display: block; margin-top: 4px;';
    fieldElement.parentNode.insertBefore(errorElement, fieldElement.nextSibling);
  }
  
  errorElement.textContent = message;
}

function clearFieldError(fieldElement) {
  fieldElement.classList.remove('input-error');
  const errorElement = fieldElement.nextElementSibling;
  if (errorElement && errorElement.classList.contains('field-error')) {
    errorElement.remove();
  }
}

function validateFormElement(formElement, schema) {
  const errors = {};
  let isValid = true;

  Object.keys(schema).forEach(fieldName => {
    const rules = schema[fieldName];
    const fieldElement = formElement.querySelector(`[name="${fieldName}"]`);
    
    if (!fieldElement) return;

    const value = fieldElement.value;
    const validation = Validator.validateForm({ [fieldName]: value }, { [fieldName]: rules });

    if (!validation.isValid) {
      errors[fieldName] = validation.errors[fieldName];
      showFieldError(fieldElement, validation.errors[fieldName]);
      isValid = false;
    } else {
      clearFieldError(fieldElement);
    }
  });

  return { isValid, errors };
}

console.log('Validator initialized');
