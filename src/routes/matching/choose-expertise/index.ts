import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// First create a map for expertise levels
const expertiseMap = new Map();

expertiseMap.set('beginner', 1);
expertiseMap.set('intermediate', 2);
expertiseMap.set('advanced', 3);

router.get('/', async (req: Request, res: Response) => {
  req;
  console.log(expertiseMap);

  const allUsersMatching = await prisma.user.findMany({
    where: {
      matching: true,
    },
  });

  allUsersMatching.forEach((user) => {
    console.log(user);
  });

  res.send('Choose Expertise Endpoint');
});

// Update route to update expertise
router.put('/', async (req: Request, res: Response) => {
  const subject = req.body.subject;
  const expertise = req.body.expertise;
  const id = parseInt(req.body.id);

  if (!subject) {
    res.status(400).json({ message: 'subject is empty' });
    return;
  }

  if (!expertise) {
    res.status(400).json({ message: 'expertise is empty' });
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

    const updatedExpertise = await prisma.user.update({
      where: { id },
      data: { expertise },
    });

    if (!updatedExpertise) {
      res.status(404).json({ message: 'expertise was unable to be updated.' });
      return;
    }

    const updatedMatching = await prisma.user.update({
      where: { id },
      data: { matching: true },
    });

    if (!updatedMatching) {
      res.status(404).json({ message: 'could not update matching to true' });
    }

    // Algorithm
    // Current user Id
    // Iterate through all users, see who is matching.
    const allUsersMatching = await prisma.user.findMany({
			where: {
				matching: true,
				subject,
			},
		});

		// Keep track of the order to search by
		let que = [1, 2, 3];

		if (expertiseMap.get(expertise) === 3) {
			// Searches: 3 -> 2 -> 1
			que = que.reverse();
		} else if (expertiseMap.get(expertise) === 2) {
			// Searches: 2 -> 1 -> 3
			[que[0], que[1]] = [que[1], que[0]];
		}

		for (let currLevel of que) {
			allUsersMatching.forEach(async (user) => {
				const userLevel = expertiseMap.get(user.expertise);
				if (userLevel === currLevel) {
					res.status(200).json(user);
				}
			});
		}
    
    // Check to see if current user subject matches with any of the iterated user's subject.
    // Nested iteration to check expertise level

    res.status(200).json(updatedExpertise);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating expertise.' });
  }
});

export const chooseExpertiseRouter = router;
