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
