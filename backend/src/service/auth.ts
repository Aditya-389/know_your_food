import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, 
         generateRefreshToken,
         verifyAccessToken,
         verifyRefreshToken
        } from '../utils/token';

import { hashToken } from '../utils/hashToken';

import { createUser, findUserByEmail, findUserById } from '../db/queries/user';
import { storeRefreshToken, 
         findRefreshToken, 
         revokeRefreshToken,  
         revokeAllUserTokens
        } from '../db/queries/refreshToken';

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
    await storeRefreshToken(user.id, refreshTokenHash, expiresAt);

    return { user, accessToken, refreshToken };
}

export const rotateRefreshToken = async(oldRefreshToken: string) => {
    let payload;
    try {
        payload = verifyRefreshToken(oldRefreshToken);
    }catch {
        throw new ApiError(401, 'Invalid refresh token');
    }

    const tokenHash = hashToken(oldRefreshToken);
    const storedToken = await findRefreshToken(tokenHash);

    if(!storedToken) {
        // Token not found or already revoked = possible theft/reuse
        // Revoke everything for this user as a precaution

        await revokeAllUserTokens(payload.userId);
        throw new ApiError(401, 'Refresh token resue detected. Please log-in again.');
    }

    if(new Date(storedToken.expires_at) < new Date()) {
        throw new ApiError(401, 'Refresh token expired');
    }

    // Rotation: revoke old, issue new 
    await revokeRefreshToken(tokenHash);

    const user = await findUserById(payload.userId);
    if(!user) {
        throw new ApiError(404, 'User not found');
    }

    const newAccessToken = generateAccessToken({ userId: user.id, isAdmin: user.is_admin });
    const newRefreshToken = generateRefreshToken(user.id);

    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await storeRefreshToken(user.id, newTokenHash, expiresAt);
    
    return { newAccessToken, newRefreshToken };
}
