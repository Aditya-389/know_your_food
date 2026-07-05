import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { hashToken } from '../utils/hashToken';
import { createUser, findUserByEmail } from '../db/queries/user';
import { storeRefreshToken } from '../db/queries/refreshToken';
import { ApiError } from '../utils/apiError'


export const registerUser = async(name: string, email: string, password: string) => {
    const isUserExists = await findUserByEmail(email);
    if(isUserExists) {
        throw new ApiError(409, 'Email Already Registered');
    } 

    const passwordHash = await hashPassword(password);
    const user = await createUser(name, email, passwordHash);

    const accessToken = generateAccessToken({ userId: user.id, isAdmin: user.isAdmin }); 
    const refreshToken = generateRefreshToken(user.id);

    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await storeRefreshToken(user.id, refreshTokenHash, expiresAt);

    return { user, accessToken, refreshToken };

}

export const loginUser = async(email: string, password: string) => {
    const user = await findUserByEmail(email);

    if(!user) {
        throw new ApiError(401, 'Invalid Email');
    }

    const isValid = await comparePassword(password, user.password_hash);
    if(!isValid) {
        throw new ApiError(401, 'Invalid Password');
    }

    const accessToken = generateAccessToken({ userId: user.id, isAdmin: user.is_admin });
    const refreshToken = generateRefreshToken(user.id);

    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await storeRefreshToken(user.id, refreshToken, expiresAt);

    return { user, accessToken, refreshToken };
}
