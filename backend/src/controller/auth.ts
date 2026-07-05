import { Request, Response, NextFunction } from "express";
import { authRegisterSchema } from "../validators/auth.validator";
import { registerUser } from "../service/auth";
import { setAuthCookies } from "../config/cookie";


export const register = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = authRegisterSchema.parse(req.body);
        const { user, accessToken, refreshToken } = await registerUser(
            parsed.name,
            parsed.email,
            parsed.password
        );

        setAuthCookies(res, accessToken, refreshToken);

        res.status(201).json({ user });

    } catch(error) {
        next(error);
    }
}
