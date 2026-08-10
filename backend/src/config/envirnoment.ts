import dotenv from 'dotenv';
dotenv.config();

type NodeEnv = 'development' | 'test' | 'production';

const DEFAULT_PORT = 3000;

const parsePort = (value: string | undefined): number => {
    if(!value) return DEFAULT_PORT;

    const parsed = Number(value);

    if(!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error("Invalid PORT value. PORT must be a positive integer");
    }

    return parsed;
}

const parseNodeEnv = (value: string | undefined): NodeEnv => {
    if(value === 'production' || value === 'test' || value === 'development') {
        return value;
    }

    return 'development'; // default 
}

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
if (!refreshTokenSecret) {
  throw new Error("REFRESH_TOKEN_SECRET is required");
}

export const config = {
  port: parsePort(process.env.PORT),
  nodeEnv,
  databaseUrl,
  jwtSecret,
  refreshTokenSecret,
  isProduction: nodeEnv === 'production',
} as const;

/*

This is a configuration module. Its job is to:

-> Load environment variables (.env).
-> Validate them.
-> Convert them into the correct types.
-> Export a single config object that the rest of your application uses.
-> prevents from writing process.env repeatedly 
*/

