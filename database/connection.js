import pkg from "pg";
import ocb_users from "../model/user.model.js";
import roadtax from "../model/roadtax.model.js";
import { text } from "express";
const { Pool } = pkg;

// # Method 1
const config = {
  host: "db.bedhxgopcfhfuvnwosvh.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "ho5PCQXupQcCGJg4",
};
export const pool = new Pool(config);

// # Method 2
// const connectionString = "postgresql://postgres:YmiXUWma4jkqlHI4@db.hddheapbdmmqkioqyoiv.supabase.co:5432/postgres";
// export const pool = new Pool({ connectionString });

export const dbInit = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Supabase DB connected", result.rows[0].now);
    await ocb_users();
    await roadtax();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const query = async (text, params) => {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query:", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error("Error executing query", { text, params, error });
    throw error; // Re-throw the error to propagate it to the caller
  }
};
