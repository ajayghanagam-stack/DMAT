# DMAT Frontend

React + Vite frontend for the Digital Marketing Automation Tool.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

**Default Login:**
- Username: `admin`
- Password: `admin123`

## 📦 Available Scripts

### Development
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Lint code with ESLint
```

## 🛠 Tech Stack

- **React 18+** - UI library with Hooks
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS Modules** - Component-scoped styling
- **ESLint** - Code linting

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, etc.
│   ├── components/      # React components
│   ├── pages/           # Page components
│   ├── services/        # API service calls
│   ├── hooks/           # Custom React hooks
│   ├── context/         # Context providers
│   ├── utils/           # Helper functions
│   ├── styles/          # Global styles
│   ├── App.jsx          # Root component
│   ├── App.css          # App styles
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## ⚙️ Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Available variables:
```env
VITE_API_BASE_URL=http://localhost:5001    # Backend API URL
VITE_APP_NAME=DMAT                         # Application name
VITE_APP_VERSION=2.0.0                     # Application version
```

## 📝 Development Guidelines

### Component Structure
- Keep components small and focused
- Use functional components with hooks
- Place reusable components in `/src/components`
- Place page components in `/src/pages`

### Styling
- Use CSS modules or styled-components
- Follow BEM naming convention for CSS classes
- Keep global styles minimal

### API Calls
- Use the `/src/services` directory for API calls
- Create service files per feature (e.g., `authService.js`, `leadsService.js`)
- Use async/await for API calls

### State Management
- Use React Context for global state
- Use local state for component-specific state
- Consider Redux or Zustand for complex state

## 🔗 Related Documentation

- [Main README](../README.md) - Full project documentation
- [Database Schema](../docs/Database-Schema.md) - Database structure
- [MVP Scope](../docs/MVP-Scope.md) - MVP features and scope

## 📊 Phase 0 Status

✅ React app initialized with Vite
✅ Clean boilerplate setup
✅ Simple layout with header and body
✅ Development server running on port 5173

**Current View:**
- Header: "DMAT – Digital Marketing Automation Tool"
- Body: "Hello DMAT – Phase 0"

---

**Built by the Innovate Electronics Team**
