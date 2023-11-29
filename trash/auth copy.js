import { query } from "../database/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const reqBody = req.body;

    // hash password
    console.time("registerDuration");
    const salt = bcrypt.genSaltSync(10);
    var hashedValue = bcrypt.hashSync(reqBody.password, salt);
    // console.log(salt, "salt value", reqBody.username);
    // console.log(hashedValue, "hashed value", reqBody.username);
    console.timeEnd("registerDuration");

    const resDb = await query(
      `
        INSERT INTO ocbproject_users (username, email, password) 
        VALUES ($1, $2, $3)`,
      [reqBody.username, reqBody.email, hashedValue]
    );
    res.status(200).json({
      message: "New user created",
      data: { username: reqBody.username, email: reqBody.email },
    });
  } catch (error) {
    // Send res status 500 - Server error
    res.status(500).json({ message: "Server Error", error: error });
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
