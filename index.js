import dotenv from 'dotenv'; 
import express from "express";
import session from "express-session";
import flash from "express-flash";
import methodOverride from "method-override"
import path from "path";
import { dbInit } from "./database/connection.js";
import apiRoutes from "./routes/apiRoutes.js";

// ### .ENV & RUN SERVER
dotenv.config();
const app = express();
const PORT = 3333;
dbInit();

// ### CORS
import cors from "cors";
app.use(cors());

// ### STATIC - PUBLIC FOLDER
app.use(express.static("public"));

// ### SESSION & FLASH
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(flash());

// ### API MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// app.use(bodyParser.json())
app.use(methodOverride('_method'))

// ### API ROUTES
app.use(apiRoutes);

// - - - TESTING API & ROUTE START - - -
app.get("/flash", (req, res) => {
  req.flash("info", "Flash Message Added");
  res.render("pages/register", { messages: req.flash("info") });
});

app.get("/calc", (req, res) => {
  res.render("pages/calc");
});

app.get("/test", (req, res) => {
  res.render("pages/testPage");
});

// - - - TESTING API & ROUTE END - - -

// ### APP ROUTES
app.get("/", (req, res) => {
  res.render("pages/login");
});

app.get("/register", (req, res) => {
  res.render("pages/register");
});

app.get("/dashboard", (req, res) => {
  const username = req.session.username;
  if (!username) {
    res.redirect("/");
    return;
  }
  res.render("pages/dashboard");
});

app.get("/roadtax-add", (req, res) => {
  res.render("pages/roadtax-add");
});

app.get("/about-me", (req, res) => {
  res.render("pages/about-me");
});

app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    // cannot access session here
  });
  res.redirect("/");
  return;
});

// ### 401, 403, 404 APP ROUTES - any requests that don't match the ones above
app.get("/bsod", (req, res) => {
  res.render("pages/bsod");
});

app.get("*", (req, res) => {
  res.render("pages/404");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
