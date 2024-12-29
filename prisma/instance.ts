import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
}) as PrismaClient & { $on(event: 'beforeExit', callback: () => void): void };

// log when prisma is disconnecting
prisma.$on('beforeExit', () => {
	console.log('Disconnecting Prisma');
});

export default prisma;
