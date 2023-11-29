import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    // Check if the token is present in the session
    const sessionToken = req.session.token;
    if (!sessionToken) {
      return res.render("pages/bsod"); 
      // res.status(401).json({ message: "Unauthorised - Token not found in session" });
    }

    // Verify the token from the session
    const decoded = jwt.verify(sessionToken, "KuNc1-R@h$iA");

    // Check if the decoded token contains user id
    if (!decoded?.id) {
      return res.render("pages/bsod");
      // res.status(401).json({ message: "Unauthorised - Decoded token does not contain user id" });
    }

    // Set the user id in the request object
    req.user = decoded.id;
    next();
  } catch (error) {
    res.render("pages/bsod");
    // res.status(401).json({ message: "Unauthorised - Error", error: error.message });
  }
};

export default isAuthenticated;





// const isAuthenticated = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, "KuNc1-R@h$iA");
//     // res.status(200).json({ message: "Protected route", data: decoded });
//     // IMPORTANT
//     // early guard clause, everything error or negative
//     if (!decoded?.id) 
//     return res.status(401).json({ message: "Unauthorised - Decoded not match" });
//     // IMPORTANT
//     req.user = decoded.id;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorised - Error" });
//   }
// };

// export default isAuthenticated;
