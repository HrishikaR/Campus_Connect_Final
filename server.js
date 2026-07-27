import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Routes imports
import authRoutes from './backend/routes/authRoutes.js';
import userRoutes from './backend/routes/userRoutes.js';
import resourceRoutes from './backend/routes/resourceRoutes.js';
import bookingRoutes from './backend/routes/bookingRoutes.js';
import clubRoutes from './backend/routes/clubRoutes.js';
import eventRoutes from './backend/routes/eventRoutes.js';
import announcementRoutes from './backend/routes/announcementRoutes.js';
import notificationRoutes from './backend/routes/notificationRoutes.js';
import reviewRoutes from './backend/routes/reviewRoutes.js';
import favoriteRoutes from './backend/routes/favoriteRoutes.js';
import adminRoutes from './backend/routes/adminRoutes.js';
import searchRoutes from './backend/routes/searchRoutes.js';
import uploadRoutes from './backend/routes/uploadRoutes.js';

import { errorHandler } from './backend/middleware/errorHandler.js';
import { connectDB } from './backend/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize MongoDB connection
  await connectDB();

  // Security and Logging Middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'CampusConnect API Server', time: new Date().toISOString() });
  });

  // Mount API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/resources', resourceRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/clubs', clubRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/announcements', announcementRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/favorites', favoriteRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/upload', uploadRoutes);

  // Global Error Handler for API
  app.use('/api', errorHandler);

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CampusConnect Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to boot server:', err);
});
