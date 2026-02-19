const mongoose = require('mongoose');
require('dotenv').config();

const mongoDBUrl = process.env.MONGODB_URL;

function DBconnect(){
mongoose.connect("mongodb+srv://singhsalendra095_db_user:<db_password>@cluster0.ar46wut.mongodb.net/Assigment")
.then(()=> console.log(" Database connected ...."))
.catch((err)=> console.log("error occured   :  " + err));
}


module.exports = DBconnect;
