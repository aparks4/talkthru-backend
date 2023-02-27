import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// PUT endpoint to update current user's profile
router.put('/profile', async (req: Request, res: Response) => {
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