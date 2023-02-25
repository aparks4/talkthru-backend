import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { IDecoded } from '../../types/types';

const router = express.Router();
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

// Get individual user
router.get('/', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(token);

  if (!token) {
    res.status(401).json({ message: 'User not logged in' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as IDecoded;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error decoding token' });
  }
});

export const userRouter = router;
