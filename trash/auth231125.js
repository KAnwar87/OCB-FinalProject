import { query } from "../database/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const reqBody = req.body;
    console.log("reqBody", reqBody);
    console.log("reqBody.password", reqBody.password);
    console.time("registerDuration");
    const salt = bcrypt.genSaltSync(10);
    const hashedValue = bcrypt.hashSync(reqBody.password, salt);
    console.timeEnd("registerDuration");

    // Check if reqBody and its properties are defined
    if (!reqBody || !reqBody.username || !reqBody.email || !hashedValue) {
      throw new Error("Invalid request body");
    }

    // Ensure the query function is properly defined
    if (typeof query !== "function") {
      throw new Error("Query function is not properly defined");
    }

    const resDb = await query(
      `
        INSERT INTO ocbproject_users (username, email, password) 
        VALUES ($1, $2, $3)`,
      [reqBody.username, reqBody.email, hashedValue]
    );

    const data = {
      username: reqBody.username,
      email: reqBody.email,
      password: hashedValue,
    };

    // Render dashboard page
    res.render("pages/dashboard", data);

    // Respond with json status
    // res.status(200).json({
    //   message: "New user created",
    //   data: { username: reqBody.username, email: reqBody.email },
    // });
  } catch (error) {
    console.error("Error during registration:", error);
    // Send res status 500 - Server error
    res.status(500).json({ message: "Server Error 500", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const reqBody = req.body;
    // select email from database
    const resDb = await query(
      `
      SELECT * FROM ocbproject_users WHERE email = $1`,
      [reqBody.email]
    );

    // no user returned
    if (resDb.rowCount === 0) {
      res.status(401).json({ message: "Unauthorised" });
      return;
    }

    // always return one user
    const userData = resDb.rows[0];

    // compare hash
    console.log(reqBody.password, userData.password);

    console.time("loginDuration");
    const isMatch = await bcrypt.compare(reqBody.password, userData.password);
    console.log(isMatch);
    console.timeEnd("loginDuration");

    // create access token
    const token = jwt.sign({ id: userData.id }, "KuNc1-R@h$iA");

    // compare password from body with database
    if (isMatch) {
      res
        .status(200)
        .json({ message: "User logged in", data: userData, token: token });
      return;
    } else {
      res.status(401).json({ message: "Unauthorised" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
    return;
  }
};

const publicController = (req, res) => {
  res.status(200).json({ message: "Public route" });
};

const protectedController = (req, res) => {
  res
    .status(200)
    // req.user came from middleware assignation
    .json({ message: "Protected controller route", data: { user: req.user } });
};

const authController = {
  register,
  login,
  publicController,
  protectedController,
};

export default authController;
