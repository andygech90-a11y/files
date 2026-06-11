# LoveConnect - React + Vite Migration ✨💗

Your project has been successfully converted from vanilla HTML/JavaScript to a modern React + Vite setup!

## 🚀 Features

- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool and dev server
- **React Router** - Client-side navigation
- **Context API** - State management for auth and app data
- **Glass Morphism UI** - Beautiful modern design

## 📁 Project Structure

```
src/
├── pages/              # Page components
│   ├── Home.jsx       # Landing page
│   ├── Login.jsx      # User login
│   ├── Register.jsx   # User registration
│   ├── Dashboard.jsx  # User dashboard
│   ├── Browse.jsx     # Browse women
│   ├── Profile.jsx    # User profile
│   ├── AdminLogin.jsx # Admin login
│   └── AdminPanel.jsx # Admin dashboard
├── components/        # Reusable components
│   ├── Nav.jsx        # Navigation bar
│   └── Toast.jsx      # Toast notifications
├── context/           # React Context
│   └── AppContext.jsx # App state management
├── App.jsx            # Main app component with routing
├── App.css            # Global styles
├── main.jsx           # Entry point
└── index.css          # Base styles
```

## 🎯 Key Components

### AppContext (src/context/AppContext.jsx)
- Manages authentication state
- Handles user registration and login
- Stores database (localStorage)
- Manages toast notifications
- Provides shared data (women, testimonials, gift plans)

### Pages
- **Home** - Landing page with features and testimonials
- **Login** - User authentication
- **Register** - New user registration (requires referral code)
- **Dashboard** - User dashboard with stats and quick actions
- **Browse** - Browse available women
- **Profile** - User profile and account information
- **AdminLogin** - Admin authentication
- **AdminPanel** - Admin dashboard with overview, users, transactions, and referral codes

## 🔧 Development

### Start Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 💾 Data Storage

The app uses browser's `localStorage` for persistence:
- **lcDB** - Main database with users, transactions, referrals, etc.
- **lcSession** - Current user session (sessionStorage)

### Default Admin Credentials
- Password: `admin123`

### Sample Referral Codes
- `LOVE2024`
- `HEART2024`
- `MATCH100`
- `VIP2024`
- `CONNECT1`

## 🎨 Styling

All styling is done inline using React style objects for component-level styling. Global styles are in `App.css` with CSS variables for consistent theming.

### Color Scheme
- **Rose** (#ff4d8d) - Primary accent
- **Gold** (#f5c842) - Secondary accent
- **Teal** (#00e5b0) - Success color
- **Purple** (#b04eff) - Tertiary accent

## 🔐 Authentication Flow

1. User registers with a valid referral code
2. Account is created in localStorage
3. User logs in with username and password
4. Session is stored in sessionStorage
5. User can access protected pages (Dashboard, Browse, Profile)
6. Admin can login with admin password

## 📦 Dependencies

- `react` - UI library
- `react-dom` - DOM rendering
- `react-router-dom` - Client-side routing

## 🚀 Migration Notes

This project was migrated from vanilla HTML/JS to React + Vite:
- All HTML pages converted to React components
- JavaScript logic migrated to React hooks and context
- CSS converted to inline styles with global App.css
- LocalStorage persistence maintained
- All functionality preserved

---

**Migration:** Vanilla HTML/JS → React + Vite
**Date:** June 2026
