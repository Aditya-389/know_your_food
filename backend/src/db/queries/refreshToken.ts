import pool from '../../config/db';

export const storeRefreshToken = async(userId: number, tokenHash: string, expiresAt: Date) => {
    const result = await pool.query(
        ` INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
          VALUES ($1, $2, $3)
          RETURNING id`,
          [userId, tokenHash, expiresAt]
    );
    return result.rows[0];
}