/* ========================================
   TASKS PAGE LOGIC
   ======================================== */

let currentEditingTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
  initTasksPage();
});

function initTasksPage() {
  // Handle form submission
  document.getElementById('add-task-form').addEventListener('submit', handleAddTask);
  document.getElementById('edit-task-form').addEventListener('submit', handleUpdateTask);

  // Handle search and filters
  document.getElementById('search-tasks').addEventListener('input', filterTasks);
  document.getElementById('filter-category').addEventListener('change', filterTasks);
  document.getElementById('filter-priority').addEventListener('change', filterTasks);
  document.getElementById('filter-status').addEventListener('change', filterTasks);

  // Populate categories
  populateCategories();

  // Display tasks
  displayTasks();
}

function handleAddTask(e) {
  e.preventDefault();

  const formData = app.getFormData('#add-task-form');
  
  // Validate
  if (!formData.title || formData.title.trim() === '') {
    notifier.error('Please enter a task title');
    return;
  }

  const task = storage.addTask({
    title: formData.title,
    description: formData.description,
    category: formData.category,
    priority: formData.priority,
    dueDate: formData.dueDate
  });

  notifier.success('Task added successfully!');
  document.getElementById('add-task-form').reset();
  displayTasks();
  productivityCalculator.updateProductivityScore();
  achievements.checkAndUnlock('first_task');
}

function handleUpdateTask(e) {
  e.preventDefault();

  const formData = {
    title: document.getElementById('edit-task-title').value,
    priority: document.getElementById('edit-task-priority').value,
    dueDate: document.getElementById('edit-task-due-date').value
  };

  storage.updateTask(currentEditingTaskId, formData);
  notifier.success('Task updated successfully!');
  app.closeModal('#edit-task-modal');
  displayTasks();
}

function displayTasks() {
  const tasks = storage.getTasks();
  const container = document.getElementById('tasks-list');

  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-title">No tasks yet</div>
        <div class="empty-state-text">Create your first task to get started!</div>
      </div>
    `;
    return;
  }

  container.innerHTML = tasks.map(task => {
    const isDue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    const dueSoon = task.dueDate && Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 3 && !task.completed;

    return `
      <div class="card list-item" style="flex-direction: column; align-items: flex-start;">
        <div style="display: flex; gap: var(--spacing-md); width: 100%; align-items: center;">
          <input type="checkbox" ${task.completed ? 'checked' : ''} 
                 onchange="toggleTaskComplete(${task.id})"
                 style="width: 20px; height: 20px; cursor: pointer;">
          
          <div style="flex: 1;">
            <div class="list-item-title" style="${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.title}</div>
            <div class="list-item-subtitle">${task.category} • ${getPriorityBadge(task.priority)}</div>
          </div>

          <div class="list-item-actions">
            ${task.dueDate ? `<span class="badge ${isDue ? 'badge-danger' : dueSoon ? 'badge-warning' : 'badge-primary'}">${formatDueDate(task.dueDate)}</span>` : ''}
            <button class="btn btn-icon btn-sm" onclick="editTask(${task.id})" title="Edit">✏️</button>
            <button class="btn btn-icon btn-sm" onclick="deleteTask(${task.id})" title="Delete">🗑️</button>
          </div>
        </div>
        
        ${task.description ? `<p style="margin-top: var(--spacing-md); color: var(--text-secondary); margin: var(--spacing-md) 0 0 var(--spacing-xl);">${task.description}</p>` : ''}
      </div>
    `;
  }).join('');

  filterTasks();
}

function toggleTaskComplete(taskId) {
  const task = storage.getTaskById(taskId);
  storage.updateTask(taskId, { completed: !task.completed });
  notifier.success(task.completed ? 'Task marked as pending' : 'Great! Task completed!');
  displayTasks();
  productivityCalculator.updateProductivityScore();
  achievements.checkAndUnlock('task_master_10');
  achievements.checkAndUnlock('task_master_50');
  achievements.checkAndUnlock('perfectionist');
}

function editTask(taskId) {
  const task = storage.getTaskById(taskId);
  if (!task) return;

  currentEditingTaskId = taskId;
  document.getElementById('edit-task-title').value = task.title;
  document.getElementById('edit-task-priority').value = task.priority;
  document.getElementById('edit-task-due-date').value = task.dueDate || '';

  app.openModal('#edit-task-modal');
}

function deleteTask(taskId) {
  app.confirm('Are you sure you want to delete this task?', () => {
    storage.deleteTask(taskId);
    notifier.success('Task deleted');
    displayTasks();
    productivityCalculator.updateProductivityScore();
  });
}

function filterTasks() {
  const searchTerm = document.getElementById('search-tasks').value.toLowerCase();
  const category = document.getElementById('filter-category').value;
  const priority = document.getElementById('filter-priority').value;
  const status = document.getElementById('filter-status').value;

  const items = document.querySelectorAll('#tasks-list .card');
  
  items.forEach(item => {
    const title = item.querySelector('.list-item-title')?.textContent.toLowerCase() || '';
    const itemCategory = item.textContent.toLowerCase();
    const isCompleted = item.querySelector('input[type="checkbox"]').checked;

    let matches = true;

    if (searchTerm && !title.includes(searchTerm)) matches = false;
    if (category && !itemCategory.includes(category.toLowerCase())) matches = false;
    if (status === 'pending' && isCompleted) matches = false;
    if (status === 'completed' && !isCompleted) matches = false;

    item.style.display = matches ? 'flex' : 'none';
  });
}

function populateCategories() {
  const categories = new Set(storage.getTasks().map(t => t.category).filter(c => c));
  const select = document.getElementById('filter-category');
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function getPriorityBadge(priority) {
  const badges = {
    low: '<span class="badge badge-success">🟢 Low</span>',
    medium: '<span class="badge badge-warning">🟡 Medium</span>',
    high: '<span class="badge badge-danger">🔴 High</span>',
    urgent: '<span class="badge badge-danger">⚡ Urgent</span>'
  };
  return badges[priority] || '';
}

function formatDueDate(dateString) {
  return app.formatDate(dateString);
}

console.log('Tasks page initialized');
