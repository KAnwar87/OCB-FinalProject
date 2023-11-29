import { query } from "../database/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const reqBody = req.body;

    // Check if username exist in db
    const checkUsername = await query(
      `
      SELECT * FROM ocbproject_users WHERE username = $1`,
      [reqBody.username]
    );

    if (checkUsername instanceof Error) {
      // Handle the error (log, send response, etc.)
      console.error("Error checking username:", checkUsername);
      res
        .status(500)
        .json({ message: "Server Error 500", error: checkUsername.message });
      return;

    } else if (checkUsername.rowCount !== 0) {
      // If username is exist, render register page with flash message
      const usernameRequested = reqBody.username;
      req.flash(
        "flashUsernameTaken",
        `${usernameRequested} username is taken. Try another username.`
      );
      res.render("pages/register", {
        key: "flashUsernameTaken",
        messages: req.flash("flashUsernameTaken"),
      });
      return;

    } else {
      // If username is available to use
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

      // Render login page with flash message
      req.flash(
        "flashRegistrationSuccessful",
        `${data.username} successful registered! You may now login.`
      );
      res.render("pages/login", {
        key: "flashRegistrationSuccessful",
        messages: req.flash("flashRegistrationSuccessful"),
      });
      return;
    }
  } catch (error) {
    console.error("Error during registration:", error);
    // Send res status 500 - Server error
    res.status(500).json({ message: "Server Error 500", error: error.message });
    return;
  }
};

const login = async (req, res) => {
  try {
    const reqBody = req.body;

    // Find if username exist in  database
    const resDb = await query(
      `
      SELECT * FROM ocbproject_users WHERE username = $1`,
      [reqBody.username]
    );

    // If no user returned
    if (resDb.rowCount === 0) {
      // res.status(401).json({ message: "Unauthorised" });
      req.flash(
        "flashNoUser",
        `Login Failed: Your username or password is incorrect `
      );
      res.render("pages/login", {
        key: "flashNoUser",
        messages: req.flash("flashNoUser"),
      });
      return;
    }

    // always return one user
    const userData = resDb.rows[0];

    // compare hash
    console.log(reqBody.password, userData.password);

    // Ensure that the userData.password is not undefined before attempting to compare it with the provided password.
    if (!userData.password) {
      console.error("Password not found for the user:", userData.username);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    console.time("loginDuration");
    const isMatch = await bcrypt.compare(reqBody.password, userData.password);
    console.log(isMatch);
    console.timeEnd("loginDuration");

    // create access token
    const token = jwt.sign({ id: userData.id }, process.env.JWT_TOKEN, { expiresIn: 60 * 10 });

    // compare password from body with database
    if (isMatch) {
      // res.status(200).json({ message: "User logged in", data: userData.id, token: token });
      
      // Save session
      req.session.userid = userData.id;
      req.session.username = userData.username;
      req.session.token = token;
      req.session.save(function (err) {
        if (err) {
            console.error('Error saving session:', err);
        } else {
            console.log('Session saved successfully');
        }
    });

      // Render Dashboard page with flash message
      req.flash("flashLoginSuccessful", `Successfully login.`);
      res.render("pages/dashboard", {
        key: "flashLoginSuccessful",
        username: `${userData.username}`,
        messages: req.flash("flashLoginSuccessful"),
      });
      return;

    } else {
      // res.status(401).json({ message: "Unauthorised" });
      req.flash(
        "flashWrongPassword",
        `Login Failed: Your username or password is incorrect `
      );
      res.render("pages/login", {
        key: "flashWrongPassword",
        messages: req.flash("flashWrongPassword"),
      });
      return;
    }
  } catch (error) {
    // res.status(500).json({ message: "Server Error 500", error: error.message });
    console.log(error);
    return;
  }
};

const publicController = (req, res) => {
  res.status(200).json({ message: "Public route" });
};

const protectedController = (req, res) => {
  // res.status(200).json({ message: "Protected controller route", data: {user: req.user}  });
  res.render("pages/testPage")
};

const authController = {
  register,
  login,
  publicController,
  protectedController,
};

export default authController;
