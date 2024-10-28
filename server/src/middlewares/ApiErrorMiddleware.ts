import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@lib/BaseError';

export default function ApiErrorMiddleware(err: ApiError, req: Request, res: Response, next: NextFunction): Response {
    console.error('ApiErrorMiddleware', err);

    if (err.status) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
 
    return res.status(500).json({ message: 'Internal server error' });
}
