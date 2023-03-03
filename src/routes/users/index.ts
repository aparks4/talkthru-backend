import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { IUser } from '../../../types/types';

const router = express.Router();
const prisma = new PrismaClient();

// GET endpoint for PlanetScale users
router.get('/', async (req: Request, res: Response) => {
  req;
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

// POST route for adding users to PlanetScale db when they sign up
router.post('/', async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  console.log('Received user data:', { email, name, password });
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hashedPassword);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      } as IUser,
    });
    await prisma.profile.create({
      data: {
        email: newUser.email,
        fullName: newUser.name,
        user: {
          connect: {
            id: newUser.id
          }
        }
      }
    });
    res.status(201).json(newUser);
    console.log('Created user: ', newUser);
  } catch (error) {
    console.log(error);
  }
});

// DELETE route for deleting a user
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    res.status(200).json(user);
    console.log('Deleted user: ', user);
  } catch (error) {
    console.log(error);
  }
});

export const usersRouter = router;
