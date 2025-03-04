import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helper/jwt';
import CustomError from '../errors/customError';
import HttpStatusCode from '../errors/httpStatusCodes';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
            };
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        
        if (!token) {
            throw new CustomError('Authentication required', HttpStatusCode.UNAUTHORIZED);
        }
        
        const decoded = verifyToken(token);
        if (typeof decoded === 'string' || !decoded.userId) {
            throw new CustomError('Invalid token', HttpStatusCode.UNAUTHORIZED);
        }
        
        req.user = {
            id: decoded.userId
        };
        
        next();
    } catch (error) {
        next(new CustomError('Authentication failed', HttpStatusCode.UNAUTHORIZED));
    }
};

export default authMiddleware;