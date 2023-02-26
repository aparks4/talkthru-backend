import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET endpoint for PlanetScale users
router.get('/', async (req: Request, res: Response) => {
  req;
  const allProfiles = await prisma.profile.findMany();
  res.json(allProfiles);
});

// POST route for adding users to PlanetScale db when they sign up
router.post('/', async (req: Request, res: Response) => {
  const { userId } = req.body;
  console.log('Current user data:', { userId });
  try {
    const newProfile = await prisma.profile.create({
      data: {
        userId
      },
    });
    res.status(201).json(newProfile);
    console.log('Created profile: ', newProfile);
  } catch (error) {
    console.log(error);
  }
});


export const profilesRouter = router;