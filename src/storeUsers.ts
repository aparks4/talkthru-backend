import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function handler() {
    try {
        const users = await prisma.user.findMany();
        console.log('found users');
        return {
            statusCode: 200,
            header: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(users),
        };
    } catch (error) {
        return {
            stsusCode: 500,
            body: JSON.stringify(error),
        }
    }
}