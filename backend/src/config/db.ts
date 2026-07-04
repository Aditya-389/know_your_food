import { config } from './envirnoment'

import { Pool } from 'pg';

const pool = new Pool({
    connectionString : config.databaseUrl
});

pool.on('connect', () => {
    console.log('Connected to database');
});

pool.on('error', (err) => {
    console.error('Unexpected DB error ', err);
    process.exit(1);
});

export default pool;