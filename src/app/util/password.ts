import bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 10;
/**
 * Hash a plain-text password using bcrypt.
 * @param password - The plain-text password to hash.
 * @returns A promise resolving to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(SALT_ROUNDS); // Adjust salt rounds as needed
  return bcryptjs.hash(password, salt);
}

/**
 * Compare a plain-text password with a hashed password.
 * @param candidatePassword - The plain-text password to compare.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise resolving to a boolean indicating if the passwords match.
 */
export async function comparePassword(
  candidatePassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, hashedPassword);
}
