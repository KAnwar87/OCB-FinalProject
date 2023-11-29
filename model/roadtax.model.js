import { query } from "../database/connection.js";

const roadtax = async () => {
  try {
    await query(`
    CREATE TABLE IF NOT EXISTS 
    ocbproject_roadtax 
    (id SERIAL PRIMARY KEY, 
      reg_no VARCHAR(255) NOT NULL UNIQUE, 
      owner_name VARCHAR(255) NOT NULL,
      owner_nokp VARCHAR(255) NOT NULL, 
      veh_type VARCHAR(255) NOT NULL,
      veh_make VARCHAR(255) NOT NULL, 
      veh_model VARCHAR(255) NOT NULL, 
      veh_eng_cc VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("roadtax.model.js created ocbproject_roadtax table");
  } catch (error) {
    throw new Error(error);
  }
};

export default roadtax;
