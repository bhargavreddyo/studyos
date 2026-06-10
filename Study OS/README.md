# StudyOS - Your Personal Study Operating System

A production-ready SaaS web application for students to manage tasks, goals, notes, and focus sessions. Built with pure HTML, CSS, and JavaScript - no backend required.

## 🌟 Features

### 1. **Dashboard**
- Productivity score tracking
- Daily metrics overview
- Upcoming deadlines
- Productivity insights
- Recent activity log
- Quick action buttons

### 2. **Task Manager**
- Create, edit, delete tasks
- Priority levels (Low, Medium, High, Urgent)
- Categories and tags
- Due date tracking
- Completion status
- Search and filter functionality

### 3. **Goal Tracker**
- Set academic, skill, placement, and certification goals
- Progress bar tracking
- Deadline management
- Goal completion status
- Milestone tracking

### 4. **Study Planner**
- Subject management
- Weekly study schedule
- Topic planning
- Study hours allocation
- Priority management

### 5. **Pomodoro Focus Timer**
- 25-minute focus sessions
- Customizable timer duration
- Break time tracking
- Daily session counter
- Session history

### 6. **Notes Vault**
- Create and organize notes
- Categorize by subject
- Pin important notes
- Mark favorites
- Search functionality

### 7. **Progress Analytics**
- Study hours visualization
- Task completion rate
- Goal achievement tracking
- Productivity trends
- Performance insights

### 8. **Calendar & Schedule**
- Monthly/weekly views
- Deadline tracking
- Event management
- Study schedule planning

### 9. **Gamification**
- Achievement badges
- XP points system
- Daily streaks
- Productivity levels
- Unlock rewards

### 10. **Settings**
- Dark/Light theme toggle
- Data export/import
- Clear all data
- Storage management

### 11. **About Page**
- Mission statement
- Feature overview
- Value proposition

### 12. **Contact Page**
- Feedback form
- Support information

## 🚀 Getting Started

### Installation

1. **Clone or download the project**
```bash
git clone https://github.com/yourusername/studyos.git
cd studyos
```

2. **Open in browser**
Simply open `index.html` in your web browser. No installation or build process needed.

3. **Deploy**
Upload all files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web server

### File Structure
```
studyos/
├── index.html                 # Landing page
├── dashboard.html             # Main dashboard
├── planner.html              # Study planner
├── tasks.html                # Task manager
├── goals.html                # Goal tracker
├── pomodoro.html             # Focus timer
├── notes.html                # Notes vault
├── analytics.html            # Progress analytics
├── calendar.html             # Schedule & calendar
├── settings.html             # Settings
├── about.html                # About page
├── contact.html              # Contact page
│
├── css/
│   ├── style.css             # Global design system
│   ├── responsive.css        # Mobile responsiveness
│   ├── dashboard.css         # Dashboard styles
│   ├── tasks.css             # Tasks page styles
│   ├── planner.css           # Planner styles
│   ├── goals.css             # Goals styles
│   ├── pomodoro.css          # Pomodoro styles
│   ├── notes.css             # Notes styles
│   ├── analytics.css         # Analytics styles
│   ├── calendar.css          # Calendar styles
│   ├── settings.css          # Settings styles
│   ├── about.css             # About styles
│   └── contact.css           # Contact styles
│
├── js/
│   ├── app.js                # Main app logic
│   ├── storage.js            # LocalStorage management
│   ├── dashboard.js          # Dashboard functionality
│   ├── tasks.js              # Tasks functionality
│   ├── pomodoro.js           # Pomodoro timer logic
│   ├── notifications.js      # Toast notifications
│   ├── productivity-score.js # Score calculations
│   ├── achievements.js       # Gamification system
│   └── validation.js         # Form validation
│
└── README.md
```

## 💾 Data Storage

All data is stored locally in browser LocalStorage:

- **Tasks**: Complete task list with metadata
- **Goals**: Goal tracking data
- **Notes**: All notes content
- **Pomodoro Sessions**: Focus session history
- **Calendar Events**: Scheduled events
- **User Preferences**: Theme, settings
- **Analytics Data**: Study statistics
- **Achievements**: Unlocked badges

### Data Persistence

- **Auto-save**: Data automatically saves every 5 minutes
- **Instant save**: Changes saved immediately on action
- **Export**: Download all data as JSON
- **Import**: Restore data from previously exported file
- **Manual backup**: Export feature for data backup

## 🎨 Design System

### Color Palette

**Light Mode:**
- Primary: #6366f1 (Indigo)
- Secondary: #8b5cf6 (Violet)
- Accent Green: #10b981
- Accent Blue: #0ea5e9
- Accent Yellow: #f59e0b
- Accent Red: #ef4444

**Dark Mode:** Automatically inverted with accessible contrast

### Typography
- Font Family: System fonts (iOS + Android + Windows)
- Headline: 700 weight
- Body: 400-600 weight
- Mono: Courier New (code/timers)

### Components
- Cards with subtle shadows
- Glassmorphism effects
- Smooth animations (150ms - 500ms)
- Mobile-first responsive design

## 📱 Responsive Design

- **Mobile** (0-640px): Full-screen navigation, stacked layout
- **Tablet** (641-1024px): Sidebar with reduced width
- **Laptop** (1025-1440px): Full sidebar + content
- **Desktop** (1441px+): Optimal width containers

### Touch Optimizations
- 44x44px minimum touch targets
- Simplified gestures
- No hover effects on touch devices
- Optimized spacing for fingers

## 🔐 Privacy & Security

- **100% Offline**: Works without internet
- **No Backend**: No data sent to servers
- **Local Storage**: Data stays on your device
- **Private**: No tracking or analytics
- **Your Data**: You control everything

## ✅ Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Productivity Features

### Productivity Score System
Calculates real-time productivity based on:
- Task completion rate (40%)
- Goal progress (30%)
- Focus sessions (20%)
- Daily consistency (10%)

### Streak System
- Tracks daily consistency
- Motivation through streaks
- Bonus XP for maintaining streaks

### Achievement System
15+ achievements including:
- First Task
- Task Master (10, 50 tasks)
- Goal Setter
- Focus Master
- Weekly Warrior
- Perfect Consistency
- And more...

## 🛠️ Customization

### Theme Customization
All colors defined in CSS variables. Edit `css/style.css`:
```css
:root {
  --primary-color: #6366f1;
  --primary-light: #818cf8;
  /* ... more variables */
}
```

### Daily Target
Customize daily study goal in Settings (default: 240 minutes)

### Timer Durations
Modify in Pomodoro page:
- Focus: 25 minutes (customizable)
- Break: 5 minutes (customizable)

## 📊 Analytics Explained

- **Productivity Score**: Overall performance metric (0-100%)
- **Study Hours**: Total focus time from Pomodoro sessions
- **Task Rate**: % of tasks completed
- **Goal Rate**: % of goals achieved
- **Streak**: Consecutive days of activity

## 🎓 Use Cases

- College students: Manage assignments and exams
- JEE/NEET aspirants: Structured study planning
- Placement preparation: Goal tracking and interviews
- Language learning: Consistent practice tracking
- Certification courses: Progress monitoring
- General productivity: Task and time management

## 💡 Tips & Tricks

1. **Daily Routine**: Set morning goals and review evening
2. **Pomodoro Best Practice**: 25 min focus + 5 min break
3. **Weekly Planning**: Plan subjects on Sunday evening
4. **Regular Exports**: Backup data weekly
5. **Streak Motivation**: Aim for 7-day and 30-day streaks
6. **Achievement Unlocking**: Unlock all 15 achievements for bonus motivation

## 🚀 Performance

- **Page Load**: < 1 second
- **Time to Interactive**: < 2 seconds
- **Storage**: ~50KB per 100 tasks/notes
- **Memory**: Minimal (~10-20MB active)

## 🐛 Known Limitations

- LocalStorage limited to ~5-10MB per browser
- Data unique per browser/device (no sync)
- No real-time collaboration
- Limited to one user per browser

## 📝 Future Enhancements

- Cloud sync (optional)
- Collaborative features
- Advanced analytics charts
- Mobile app (React Native)
- Study buddy system
- Subject-wise analytics
- Habit tracking

## 📄 License

MIT License - Free for personal and commercial use

## 🤝 Contributing

Found a bug or have a suggestion? Contact us through the Contact page.

## 📧 Support

- **Email**: contact@studyos.com
- **Contact Form**: Available in-app
- **Issues**: Report through Contact page

---

**StudyOS** - Built for students, by students 🎓

Transform your study routine today!
