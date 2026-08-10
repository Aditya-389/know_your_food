import { Response } from 'express';
import { config } from '../config/envirnoment';

const cookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: "strict" as const,
};

export const setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
) => {
    res.cookie("access_token", accessToken, {
        ...cookieOptions,
        maxAge: 15*50*100
    });

    res.cookie("refresh_token", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

