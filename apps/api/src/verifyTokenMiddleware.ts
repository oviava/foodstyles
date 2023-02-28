import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './tokenSecret';

export interface VerifiedRequest extends Request {
  userInfo?: { id: number; email: string };
}

export const verifyTokenMiddleware = (
  req: VerifiedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET);
    req.userInfo = decoded as { id: number; email: string };
  } catch (e) {
    return res.status(401).send({ message: 'Unauthorized!' });
  }
  return next();
};
