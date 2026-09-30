import {  sendError  } from '../utils/response';

const isAuthenticated = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;
  if (!token) {
    return sendError(res, 'Unauthorized', 'No token provided', 401);
  }
  next();
};

export { 
  isAuthenticated,
 };
