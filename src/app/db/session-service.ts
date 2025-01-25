import prisma from '../../../prisma/instance';

export async function createSession(userId: number, userAgent: string) {
  const session = await prisma.session.create({
    data: {
      userId,
      userAgent,
    },
  });
  return session;
}

export async function deleteSession(sessionId: number) {
  console.log('Deleting session with ID:', sessionId);
  await prisma.session.delete({
    where: { id: sessionId },
  });
}

