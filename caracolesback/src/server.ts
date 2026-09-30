import app from './app';
import env from './config/env';
import {  connectDB  } from './config/database';
import logger from './utils/logger';

// Initialize Database connection
connectDB();

const server = app.listen(env.port, () => {
  logger.info(`Server is running on port ${env.port} in ${env.nodeEnv} mode`);
  logger.info(`Health check: http://localhost:${env.port}/api/health`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err: any) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
