import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
	req;
	res.send('Update Criteria Endpoint');
});

// Updates user search criteria
router.put('/', async (req: Request, res: Response) => {
	const { id, subject, expertise, matching, roomId } = req.body;

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

		const updatedUser = await prisma.user.update({
			where: { id },
			data: { subject, expertise, matching, roomId },
		});

		if (!updatedUser) {
			res.status(404).json({ message: 'Criteria was unable to be updated.' });
			return;
		}

		res.status(200).json(updatedUser);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error updating criteria.' });
	}
});

export const updateCriteriaRouter = router;
