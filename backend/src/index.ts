import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { db } from './database';
import { geminiConfig } from './config/gemini';
import geminiRoutes from './routes/gemini';
import usersRoutes from './routes/users';
import chatRoutes from './routes/chat';
import { requestLogger } from './middleware/validation';
import adminRoutes from './routes/admin';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:8080', 'http://localhost:3000'];
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Inter-Compass Service API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes will be added here as needed

app.use('/api/admin', adminRoutes);
// API Routes
app.use('/api/gemini', geminiRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Gemini API: http://localhost:${PORT}/api/gemini/status`);
  
  // Test database connection on startup
  try {
    await db.testConnection();
  } catch (error) {
    console.error('❌ Failed to connect to database on startup:', error);
  }

  // Test Gemini connection on startup
  if (geminiConfig.isConfigured()) {
    console.log('🔄 Testing Gemini connection...');
    await geminiConfig.testConnection();
  } else {
    console.log('⚠️  Gemini not configured. Set GEMINI_API_KEY to enable AI features.');
  }
});

export default app;
