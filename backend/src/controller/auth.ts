import { Request, Response, NextFunction } from "express";
import { authLoginSchmea, authRegisterSchema } from "../validators/auth.validator";
import { registerUser, loginUser } from "../service/auth";
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

export const login = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = authLoginSchmea.parse(req.body);
        const { user, accessToken, refreshToken } = await loginUser(
            parsed.email,
            parsed.password
        );

        setAuthCookies(res, accessToken, refreshToken);

        res.status(200).json({
            user: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.is_admin
        })

    }catch(error) {
        next(error);
    }
}

