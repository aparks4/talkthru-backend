import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  req;
  res.send('Update Room Id Endpoint');
});

// Updates user room id
router.put('/', async (req: Request, res: Response) => {
  const id = parseInt(req.body.id);
  const roomId = req.body.roomId;

  if (!roomId) {
    res.status(400).json({ message: 'Room id is empty' });
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

    const updatedRoomId = await prisma.user.update({
      where: { id },
      data: { roomId },
    });

    if (!updatedRoomId) {
      res.status(404).json({ message: 'Room id was unable to be updated.' });
      return;
    }

    res.status(200).json(updatedRoomId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating room id.' });
  }
});

export const updateRoomIdRouter = router;
