import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
// import { findUser } from './findUser';

const router = express.Router();
const prisma = new PrismaClient();

// First create a map for expertise levels
const expertiseMap = new Map();

expertiseMap.set('Beginner', 1);
expertiseMap.set('Intermediate', 2);
expertiseMap.set('Advanced', 3);

// Route to match user
router.put('/', async (req: Request, res: Response) => {
	const id = parseInt(req.body.id);

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

		// Iterate through all users, see who is matching.
		const candidates = await prisma.user.findMany({
			where: {
				matching: true,
				subject: user.subject,
			},
		});

		// Keep track of the order to search by
		let que = [1, 2, 3];

		if (expertiseMap.get(user.expertise) === 3) {
			// Searches: 3 -> 2 -> 1
			que = que.reverse();
		} else if (expertiseMap.get(user.expertise) === 2) {
			// Searches: 2 -> 1 -> 3
			[que[0], que[1]] = [que[1], que[0]];
		}

		// Finds user with closest expertise in the desired subject
		let matchedUser = null;

		for (const currLevel of que) {
			for (const candidate of candidates) {
				const candidateLevel = expertiseMap.get(candidate.expertise);

				if (candidateLevel === currLevel && candidate.id !== user.id) {
					matchedUser = candidate;
					break;
				}
			}
			if (matchedUser) {
				break;
			}
		}

		// const matchedUser = findUser({ candidates, userExpertise: user.expertise });

		// No matchedUser found --> Creates new room
		if (!matchedUser) {
			const newRoom = uuid();
			const updatedRoom = await prisma.user.update({
				where: { id },
				data: { roomId: newRoom },
			});

			if (!updatedRoom) {
				res.status(404).json({ message: 'New room was was unable to be created.' });
				return;
			}

			// Returns created roomId
			res.status(201).json(updatedRoom.roomId);
			return;
		}

		// matchedUser found --> Join matchedUser's roomId
		const updatedRoom = await prisma.user.update({
			where: { id },
			data: { roomId: matchedUser.roomId },
		});

		if (!updatedRoom) {
			res.status(404).json({ message: 'RoomId was unable to be updated.' });
			return;
		}

		// Returns roomId
		res.status(202).json(matchedUser.roomId);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Choose expertise put route error.' });
	}
});

export const matchUserRouter = router;
