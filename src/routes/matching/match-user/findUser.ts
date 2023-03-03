import { User } from '@prisma/client';
interface ISearchProps {
	candidates: User[];
	userExpertise: string;
}

// Store the different expertise names in an array
const expertises = ['Beginner', 'Intermediate', 'Advanced'];
// Use the expertises array to initialize a hashmap that correlates the name to a number value
const expertiseMap = new Map();

for (let i = 0; i < expertises.length; i++) {
	expertiseMap.set(expertises[i], i);
}

export const findUser = ({ candidates, userExpertise }: ISearchProps) => {
	// Build graph of all candidates at each level
	const graph: Record<number, User[]> = {};
	for (const candidate of candidates) {
		const level = expertiseMap.get(candidate.expertise);

		if (!graph[level]) {
			graph[level] = [];
		}

		graph[level].push(candidate);
	}

	const startingLevel = expertiseMap.get(userExpertise);
	const seen = new Set();
	seen.add(startingLevel);
	// Keep track of the search order
	const que = [startingLevel];

	for (let i = 0; i < expertises.length; i++) {
		const currLevel = que[i];

		if (graph[currLevel]) {
			// Returns the first candidate
			return graph[currLevel][0];
		}

		// Search one level lower
		if (currLevel - 1 >= 0 && !seen.has(currLevel - 1)) {
			seen.add(currLevel - 1);
			que.push(currLevel - 1);
		}

		// Search one level higher
		if (currLevel + 1 < expertises.length && !seen.has(currLevel + 1)) {
			seen.add(currLevel + 1);
			que.push(currLevel + 1);
		}
	}

	return null;
};
