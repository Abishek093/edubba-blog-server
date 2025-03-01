import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import router from './routes/router';
import CustomError from '../errors/customError';

dotenv.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
})

const app = express()

app.use(express.json())

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
       status: 'success',
       message: 'Server is healthy',
       timestamp: new Date().toISOString(),
       environment: process.env.NODE_ENV
    });
 });

app.use('/api',router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    if (err instanceof CustomError) {
      res.status(err.statusCode).json(err.toJSON());
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

export default app