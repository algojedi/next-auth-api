import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
}) as PrismaClient & { $on(event: 'beforeExit', callback: () => void): void };

// log when prisma is disconnecting
prisma.$on('beforeExit', () => {
	console.log('Disconnecting Prisma');
});

console.log('is this being run ???????????')
// Test the database connection and log a success message
async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`; // Simple query to check the connection
    console.log('Connected to the database successfully!');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
}

testDatabaseConnection().catch(console.error);

export default prisma;
