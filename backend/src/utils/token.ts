import jwt from 'jsonwebtoken';
import { config } from '../config/envirnoment';

interface AccessTokenPayload {
  userId: number;
  isAdmin: boolean;
}

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, config.jwtSecret) as AccessTokenPayload;
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, config.refreshTokenSecret, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

export const verifyRefreshToken = (token: string): { userId: number } => {
  return jwt.verify(token, config.refreshTokenSecret) as { userId: number };
};