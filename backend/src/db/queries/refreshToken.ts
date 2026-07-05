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

export const findRefreshToken = async(tokenHash: string) => {
    const result = await pool.query(
        ` SELECT * FROM refresh_tokens
            WHERE token_hash = $1 AND revoked = FALSE `,
        [tokenHash]
    );
    return result.rows[0];
}

export const revokeRefreshToken = async (tokenHash: string) => {
  await pool.query(
    ` UPDATE refresh_tokens 
      SET revoked = TRUE 
      WHERE token_hash = $1 `,
    [tokenHash]
  );
};

export const revokeAllUserTokens = async (userId: number) => {
  await pool.query(
    ` UPDATE refresh_tokens 
      SET revoked = TRUE 
      WHERE user_id = $1`,
    [userId]
  );
};