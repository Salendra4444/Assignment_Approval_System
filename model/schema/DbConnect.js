const mongoose = require('mongoose');
require('dotenv').config();

const mongoDBUrl = process.env.MONGODB_URL;

function DBconnect() {
  mongoose.connect(mongoDBUrl)
    .then(() => console.log("Database connected ...."))
    .catch((err) => console.log("error occured : " + err));
}

module.exports = DBconnect;
