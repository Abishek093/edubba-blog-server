import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import router from './routes/router';
import CustomError from '../errors/customError';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

const app = express();

app.use(express.json());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }, 
  xssFilter: true, 
}));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use(limiter); 

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use('/api', router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof CustomError) {
    res.status(err.statusCode).json(err.toJSON());
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default app;