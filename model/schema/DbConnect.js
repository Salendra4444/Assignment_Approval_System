const mongoose = require('mongoose');
require('dotenv').config();

const mongoDBUrl = process.env.MONGO_URI;

function DBconnect() {
  if (!mongoDBUrl) {
    console.error('Database connection skipped: MONGO_URI is not configured in .env');
    return;
  }

  mongoose.connect(mongoDBUrl)
    .then(() => console.log("Database connected ...."))
    .catch((err) => console.log("error occured : " + err));
}

module.exports = DBconnect;
