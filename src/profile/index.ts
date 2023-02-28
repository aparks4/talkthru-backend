import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { IDecoded } from '../../types/types';

const router = express.Router();
const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

// GET endpoint for current user's profile
router.get('/', async (req: Request, res: Response) => {
    // get current user's id
    const token = req.headers.authorization?.split(' ')[1];
      
    if (!token) {
        res.status(401).json({ message: 'User not logged in' });
        return;
    }

    // get current user's profile
    try {
        const decoded = jwt.verify(token, SECRET_KEY) as IDecoded;

        const profile = await prisma.profile.findUnique({
            where: { userId: decoded.userId },
        });

        if (!profile) {
            res.status(404).json({ message: 'Profile not found' });
            return;
        }
        res.status(200).json(profile);
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Error decoding token' });
    }
})

// PUT endpoint to update current user's profile
router.put('/', async (req: Request, res: Response) => {
    const { userId, picture, userName, bio, occupation, location } = req.body;

    try {
        // Update the user's profile
        const updatedProfile = await prisma.profile.update({
            where: { userId },
            data: { picture, userName, bio, occupation, location }
        });

        // Return the updated profile
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.log(error);
    }

  });
  
  
  export const profileRouter = router;