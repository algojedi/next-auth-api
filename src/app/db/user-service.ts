import prisma from '../../../prisma/instance';
import { comparePassword, hashPassword } from '../util/shared/password';

export interface CreateUserInput {
  name: string;
  email: string;
  password?: string;
  picture?: string;
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
  if (!user) {
    return false;
  }
  const userPassword = user.password;
  const userEmail = user.email;

  if (!userPassword || !userEmail) {
    return false;
  }
  
  return await comparePassword(password, userPassword);
}

export async function findUser(query: Partial<CreateUserInput>) {
  return prisma.user.findFirst({
    where: query,
  });
}

// Update or create a user and assume picture is mandatory
export async function upsertUser(data: CreateUserInput) {
  const { name, email, picture } = data;
  if (!name || !email || !picture) {
    throw new Error('Missing required fields');
  }
  return prisma.user.upsert({
    where: { email },
    update: {
      email,
      name,
      picture  
    },
    create: {
      name,
      email,
      picture
    },
  });
}
