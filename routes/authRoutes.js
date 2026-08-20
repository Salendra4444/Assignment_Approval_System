const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();




router.get('/register', (req, res) => {
  res.render("register", { name: "", email: "", msg1: "", msg2: "", role: "Student" });
});

router.post('/register', authController.signupPost);

router.post('/login', authController.loginPost);
 

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  console.log("User logged out, redirecting to login page.");
  res.redirect('/');
});




module.exports = router;
