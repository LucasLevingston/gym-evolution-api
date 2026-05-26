import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ClientError } from '@/domain/shared/errors/client-error';
import { env } from '@/env';

const { JWT_SECRET_KEY } = env;

interface JwtUserPayload {
  userId: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId } as JwtUserPayload, JWT_SECRET_KEY, { expiresIn: '10h' });
};

export const verifyToken = (token: string): JwtUserPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtUserPayload;
    return decoded;
  } catch (error) {
    throw new ClientError('Invalid token');
  }
};
