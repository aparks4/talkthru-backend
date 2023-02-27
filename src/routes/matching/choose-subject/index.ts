import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  req;
  res.send('Choose Subject Endpoint');
});

// Update route to update subject
router.put('/', async (req: Request, res: Response) => {
  const subject = req.body.subject;
  const id = parseInt(req.body.id);

  if (!subject) {
    res.status(400).json({ message: 'Subject is empty' });
    return;
  }

  if (!id) {
    res.status(400).json({ message: 'User id is empty' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updatedSubject = await prisma.user.update({
      where: { id },
      data: { subject },
    });

    if (!updatedSubject) {
      res.status(404).json({ message: 'Subject was unable to be updated.' });
      return;
    }

    res.status(200).json(updatedSubject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating subject.' });
  }
});

export const chooseSubjectRouter = router;
