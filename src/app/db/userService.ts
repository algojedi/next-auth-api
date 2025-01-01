import prisma from "../../../prisma/instance";
import { hashPassword } from "../util/password";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

// Create a user
export async function createUser(data: CreateUserInput) {
  const { name, email, password } = data;
  const hashedPassword = await hashPassword(password);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    }
  });
}

// Find a user by email
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}
