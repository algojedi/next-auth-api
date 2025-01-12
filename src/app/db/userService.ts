import prisma from '../../../prisma/instance';
import { comparePassword, hashPassword } from '../util/password';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

// Create a user
export async function createUser(data: CreateUserInput) {
  const { name, email, password } = data;
  if (!name || !email || !password) {
    throw new Error('Missing required fields');
  }
  // TODO: check if email is already in use
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
}

// Find a user by email
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return false;
  
  const isValid = await comparePassword(password, user.password);
  if (!isValid) return false;
  return true;
}

export async function findUser(query: Partial<CreateUserInput>) {
  return prisma.user.findFirst({
    where: query,
  });
}
