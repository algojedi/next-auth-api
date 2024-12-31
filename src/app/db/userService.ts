import prisma from "../../../prisma/instance";
import bcryptjs from 'bcryptjs';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}


// console.log({prisma})

const SALT_FACTOR = process.env.SALT_FACTOR || '10';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export async function createUser(someData : any) {
//   console.log({someData}) 
// }

// Create a user
export async function createUser(data: CreateUserInput) {
  console.log('creating user with prisma')
  const saltWorkFactor = parseInt(SALT_FACTOR);
  const hashedPassword = await bcryptjs.hash(data.password, saltWorkFactor);

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    }
  });
}



// Find a user by email
// export async function findUserByEmail(email: string) {
//   return prisma.user.findUnique({
//     where: { email },
//   });
// }

// Compare passwords
export async function comparePassword(
  hashedPassword: string,
  candidatePassword: string,
): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, hashedPassword);
}

