import pg from "pg";
import {neon} from "@neondatabase/serverless";
import "dotenv/config";

const { Pool } = pg;
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false, // Enforces SSL without needing certificate verification
    },
})

export const client = await pool.connect();

// const sql = neon(process.env.DATABASE_URL);

// export default sql;
