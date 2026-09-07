const jwt = require("jsonwebtoken");
const key = "this is secret key";

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    // Redirect to login with error message
    return res.redirect("/?error=login_required");
  }

  try {
    const decoded = jwt.verify(token, key);
    
    // Check if token is about to expire (less than 5 minutes remaining)
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp - now < 300) {
      res.clearCookie('token');
      console.log("Token about to expire, please log in again.");
      return res.redirect("/?error=session_expired");
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    // Clear invalid token
    res.clearCookie('token');
    console.log("Token verification failed:", err.message);
    return res.redirect("/?error=invalid_session");
  }
};
