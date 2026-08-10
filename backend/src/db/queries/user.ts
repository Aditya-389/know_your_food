import pool from "../../config/db";

export const createUser = async(name: string, email: string, passwordHash: string) => {
    const result = await pool.query(
        ` INSERT INTO users (name, email, password_hash)
          VALUES ($1, $2, $3)
          RETURNING id, name, email, is_admin`,
          [name, email, passwordHash]
    );
    return result.rows[0];
}

export const findUserByEmail = async(email: string) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
}

export const findUserById = async(userId: number) => {
    const result = await pool.query(
        ` SELECT * FROM  users
          WHERE id = $1 `,
        [userId]
    );
    return result.rows[0];
}

/*
1. pool.query() -> sends an SQL query to PostgreSQL.
2. $1, $2, $3 -> They are parameter placeholders. Provide safety from SQL injection attacks 
3. Rows are always an array : since it has only one row that's why result.rows[0];

*/