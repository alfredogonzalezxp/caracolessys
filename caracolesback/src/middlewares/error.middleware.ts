import logger from '../utils/logger';
import env from '../config/env';

const errorHandler = (err: any, req: any, res: any, next: any) => {
  logger.error(err.message, err.stack);
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(env.nodeEnv === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
