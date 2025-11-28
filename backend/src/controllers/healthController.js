import pool from '../config/database.js';

// Health check endpoint
export const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'DMAT Backend is running',
    timestamp: new Date().toISOString()
  });
};

// Database connection check endpoint
export const dbCheck = async (req, res) => {
  try {
    // Simple query to test DB connection
    const result = await pool.query('SELECT NOW() as current_time, COUNT(*) as user_count FROM users');

    res.status(200).json({
      status: 'ok',
      message: 'Database connection successful',
      data: {
        currentTime: result.rows[0].current_time,
        userCount: result.rows[0].user_count
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
