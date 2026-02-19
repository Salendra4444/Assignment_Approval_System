const express = require('express');

const router = express.Router();



router.get('/hodDashboard', (req, res) => {
  res.render("hodDashboard");
});



module.exports = router;