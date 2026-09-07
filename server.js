const express = require('express');
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');

const adminRoutes = require('./routes/adminRoutes');
const dataSeeding = require('./routes/dataSeeding');
const studentRoutes = require('./routes/studentRoutes');
const professorRoutes = require('./routes/professorRoutes');
const hodRoutes = require('./routes/hodRoutes');
const authRoutes = require('./routes/authRoutes');
const DBconnect = require('./model/schema/DbConnect');

DBconnect();

// dataSeeding.departmentSeeding()
// dataSeeding.Userseeding()
// dataSeeding.assignmentSeeding()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');

app.set('views', [
  path.join(__dirname, 'views/admin'),
  path.join(__dirname, 'views/student'),
  path.join(__dirname, 'views/professor'),
]);

app.get('/', (req, res) => {
  // Display appropriate error message based on auth error
  let msg1 = "";
  let msg2 = "";
  
  const error = req.query.error;
  if (error === 'login_required') {
    msg1 = "Please log in to access this page.";
  } else if (error === 'session_expired') {
    msg1 = "Your session has expired. Please log in again.";
  } else if (error === 'invalid_session') {
    msg1 = "Invalid session. Please log in again.";
  }
  
  res.render("login", {
    email: "",
    msg1: msg1,
    msg2: ""
  });
});

app.use('/', adminRoutes);
app.use('/', studentRoutes);
app.use('/', professorRoutes);
app.use('/', hodRoutes);
app.use('/', authRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
