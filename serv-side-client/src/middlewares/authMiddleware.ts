import { RequestHandler } from 'express';
import { ApiError } from '@lib/BaseError';


export const isUser: RequestHandler = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).send('Please login');
    next();
  } 
  catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}


export default {
  isUser,
  // isAdmin
}