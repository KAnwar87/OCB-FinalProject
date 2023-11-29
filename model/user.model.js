import { query } from "../database/connection.js";

const users = async () => {
  try {
    await query(`
    CREATE TABLE IF NOT EXISTS 
    ocbproject_users 
    (id SERIAL PRIMARY KEY, 
      username VARCHAR(255) NOT NULL UNIQUE, 
      email VARCHAR(255) NOT NULL UNIQUE, 
      password VARCHAR(255) NOT NULL, 
      created_at TIMESTAMP DEFAULT NOW(),
      last_login TIMESTAMP );
    `);
    console.log("user.model.js created ocbproject_users table");
  } catch (error) {
    throw new Error(error);
  }
};

export default users;
