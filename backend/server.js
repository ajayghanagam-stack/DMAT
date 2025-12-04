import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './src/routes/healthRoutes.js';
import landingPageRoutes from './src/routes/landingPageRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
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
app.use('/api/admin/landing-pages', landingPageRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'DMAT Backend API',
    version: '1.0.0',
    phase: 'Phase 1 - Landing Pages & Leads',
    endpoints: {
      health: '/api/health',
      dbCheck: '/api/db-check',
      landingPages: '/api/admin/landing-pages',
      landingPagesCreate: 'POST /api/admin/landing-pages',
      landingPagesList: 'GET /api/admin/landing-pages',
      landingPageGet: 'GET /api/admin/landing-pages/:id',
      landingPageUpdate: 'PUT /api/admin/landing-pages/:id',
      landingPagePublish: 'POST /api/admin/landing-pages/:id/publish',
      landingPageDelete: 'DELETE /api/admin/landing-pages/:id'
    },
    note: 'All /api/admin/* endpoints require authentication. Use x-user-id header for testing.'
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
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 DMAT Backend Server - Phase 1`);
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n🔗 API Endpoints:`);
  console.log(`   Health Check:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/db-check`);
  console.log(`\n   Landing Pages (Phase 1):`);
  console.log(`   - POST   /api/admin/landing-pages`);
  console.log(`   - GET    /api/admin/landing-pages`);
  console.log(`   - GET    /api/admin/landing-pages/:id`);
  console.log(`   - PUT    /api/admin/landing-pages/:id`);
  console.log(`   - POST   /api/admin/landing-pages/:id/publish`);
  console.log(`   - DELETE /api/admin/landing-pages/:id`);
  console.log(`   - GET    /api/admin/landing-pages/stats`);
  console.log(`\n📝 Note: Admin endpoints require x-user-id header (e.g., x-user-id: 1)`);
  console.log('='.repeat(60));
});

export default app;
