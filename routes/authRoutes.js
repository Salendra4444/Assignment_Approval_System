const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();




router.post('/login',authController.loginPost);
 

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  console.log("User logged out, redirecting to login page.");
  res.redirect('/');
});




module.exports = router;