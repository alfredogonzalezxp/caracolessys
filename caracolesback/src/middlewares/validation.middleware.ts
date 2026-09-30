import {  sendError  } from '../utils/response';

const validateRequest = (schema) => {
  return (req: any, res: any, next: any) => {
    // Implement validation logic using a library like Joi or Zod
    next();
  };
};

export { 
  validateRequest,
 };
