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


export const profilesRouter = router;