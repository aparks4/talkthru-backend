import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
	req;

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
	const expertise = req.body.expertise;
	const id = req.body.id;

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
			return;
		}

		res.status(200).json(updatedMatching);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Choose expertise put route error.' });
	}
});

export const chooseExpertiseRouter = router;
