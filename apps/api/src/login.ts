import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { parseExpressRequest } from './helpers';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './tokenSecret';

const prisma = new PrismaClient();

export const loginRouter = Router();

/**
 * LOGIN
 */

const loginSchema = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
});

loginRouter.post('/', async (req, res) => {
  try {
    const { body } = await parseExpressRequest(loginSchema, req);
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    // using hashing mechanism we'd compare passwords, some external tool like bcrypt
    if (user && user.password === body.password) {
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1d',
      });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

loginRouter.post('/register', async (req, res) => {
  try {
    const { body } = await parseExpressRequest(loginSchema, req);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        // for security we'd hash the password before storing it, for demo purposes this should work
        password: body.password,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(200).json({ token });
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
