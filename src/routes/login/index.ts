import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { IUser } from '../../../types/types';

const router = express.Router();
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

// POST route for user login
router.post('/', async (req: Request, res: Response) => {
  const { email, password }: IUser = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(401).send('Invalid email or password');
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).send('Invalid email or password');
      return;
    }
    const token = jwt.sign({ userId: user.id }, SECRET_KEY);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

export const loginRouter = router;
