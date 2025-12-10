import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './src/routes/healthRoutes.js';
import landingPageRoutes from './src/routes/landingPageRoutes.js';
import leadRoutes from './src/routes/leadRoutes.js';
import leadNoteRoutes from './src/routes/leadNoteRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import publicRoutes from './src/routes/publicRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import templateRoutes from './src/routes/templateRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import { initializeStorage } from './src/services/storage.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Public API routes - allow all origins (for form submissions from any domain)
app.use('/api/public', cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Admin API routes - restrict to configured origin
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/landing-pages', landingPageRoutes);
app.use('/api/admin/leads', leadNoteRoutes); // Lead notes routes (must come before leadRoutes)
app.use('/api/admin/leads', leadRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/templates', templateRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/public', publicRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'DMAT Backend API',
    version: '1.0.0',
    phase: 'Phase 1 - Landing Pages & Leads',
    endpoints: {
      health: '/api/health',
      dbCheck: '/api/db-check',
      auth: {
        login: 'POST /api/auth/login',
        verify: 'GET /api/auth/verify'
      },
      landingPages: {
        create: 'POST /api/admin/landing-pages',
        list: 'GET /api/admin/landing-pages',
        get: 'GET /api/admin/landing-pages/:id',
        update: 'PUT /api/admin/landing-pages/:id',
        publish: 'POST /api/admin/landing-pages/:id/publish',
        delete: 'DELETE /api/admin/landing-pages/:id',
        stats: 'GET /api/admin/landing-pages/stats',
        preview: 'GET /api/admin/landing-pages/:id/preview'
      },
      leads: {
        list: 'GET /api/admin/leads',
        get: 'GET /api/admin/leads/:id',
        update: 'PATCH /api/admin/leads/:id',
        export: 'GET /api/admin/leads/export'
      },
      analytics: {
        dashboard: 'GET /api/admin/analytics/dashboard'
      },
      templates: {
        list: 'GET /api/admin/templates',
        get: 'GET /api/admin/templates/:id'
      },
      public: {
        leadSubmit: 'POST /api/public/leads'
      }
    },
    note: 'Admin endpoints require Authorization header with Bearer token. Public endpoints (/api/public/*) require no authentication.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, async () => {
  console.log('='.repeat(60));
  console.log(`🚀 DMAT Backend Server - Phase 2`);
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n🔗 API Endpoints:`);
  console.log(`   Health Check:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/db-check`);
  console.log(`\n   Authentication:`);
  console.log(`   - POST   /api/auth/login`);
  console.log(`   - GET    /api/auth/verify`);
  console.log(`\n   Landing Pages (Admin):`);
  console.log(`   - POST   /api/admin/landing-pages`);
  console.log(`   - GET    /api/admin/landing-pages`);
  console.log(`   - GET    /api/admin/landing-pages/:id`);
  console.log(`   - PUT    /api/admin/landing-pages/:id`);
  console.log(`   - POST   /api/admin/landing-pages/:id/publish`);
  console.log(`   - DELETE /api/admin/landing-pages/:id`);
  console.log(`   - GET    /api/admin/landing-pages/stats`);
  console.log(`   - GET    /api/admin/landing-pages/:id/preview`);
  console.log(`\n   Lead Management (Admin):`);
  console.log(`   - GET    /api/admin/leads`);
  console.log(`   - GET    /api/admin/leads/:id`);
  console.log(`   - PATCH  /api/admin/leads/:id`);
  console.log(`   - GET    /api/admin/leads/export`);
  console.log(`\n   Analytics (Admin):`);
  console.log(`   - GET    /api/admin/analytics/dashboard`);
  console.log(`\n   Templates (Admin):`);
  console.log(`   - GET    /api/admin/templates`);
  console.log(`   - GET    /api/admin/templates/:id`);
  console.log(`\n   Image Upload (Admin):`);
  console.log(`   - POST   /api/admin/upload/image`);
  console.log(`   - DELETE /api/admin/upload/image`);
  console.log(`\n   Lead Capture (Public):`);
  console.log(`   - POST   /api/public/leads`);
  console.log(`\n📝 Admin endpoints require Authorization header: Bearer <token>`);
  console.log(`📝 Public endpoints require no authentication`);
  console.log('='.repeat(60));

  // Initialize MinIO storage
  console.log(`\n🗄️  Initializing MinIO storage...`);
  await initializeStorage();
  console.log('='.repeat(60));
});

export default app;
