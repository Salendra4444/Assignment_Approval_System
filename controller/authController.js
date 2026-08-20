const jwt = require('jsonwebtoken');
const userModel = require('../model/schema/Registeration');
const key = "this is secret key";
const bcrypt = require('bcrypt');

// existing admin credentials (hardcoded)
const admin = { email: 'admin@gmail.com', password: 'admin' };

// Additional hardcoded accounts for testing/demo purposes
// NOTE: These are plain-text for convenience in development only.
// Do NOT use hardcoded credentials in production.
const hardcodedUsers = [
  { email: 'student1@example.com', password: 'student1', role: 'Student' },
  { email: 'student2@example.com', password: 'student2', role: 'Student' },
  { email: 'hod@example.com', password: 'hodadmin', role: 'H.O.D' },
  { email: 'prof@example.com', password: 'prof1', role: 'Professor' }
];

module.exports.loginPost = async (req, res) => {
  const {email, password } = req.body;
  console.log('Login attempt:', email, password);

  // Admin (already present)
  if (email === admin.email && password === admin.password) {
    const token = jwt.sign({ username: email, role: "admin" }, key, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('/adminDashboard');
  }

  // Check hardcoded demo users before DB lookup
  const demoUser = hardcodedUsers.find(u => u.email === email && u.password === password);
  if (demoUser) {
    const token = jwt.sign({ email: demoUser.email, role: demoUser.role }, key, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    if (demoUser.role === 'Student') return res.redirect('/studentDashboard');
    if (demoUser.role === 'Professor') return res.redirect('/professorDashboard');
    if (demoUser.role === 'H.O.D') return res.redirect('/hodDashboard');

    // fallback
    return res.redirect('/');
  }

  // Fallback: look up user in database
  let user;

  try{
    user = await userModel.findOne({ email: email});
    console.log(user);
  }
  catch(err){
    console.log("mongoose error....")
  }

  if (!user) {
    return res.render("login", {email:"", msg1: "User not found!", msg2: "" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("login", { email,msg1: "", msg2: "Incorrect password!" });
  }

  const token = jwt.sign({ email: user.email }, key, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });

  if (user.role === "Student") return res.redirect("/studentDashboard");
  if (user.role === "Professor") return res.redirect("/professorDashboard");
  if (user.role === "H.O.D") return res.redirect("/hodDashboard");
};

module.exports.signupPost = async (req, res) => {
  const { name, email, password, confirmPassword, role, phone, departement } = req.body;
  console.log('Signup attempt:', { name, email, role });

  // Validate that passwords match
  if (password !== confirmPassword) {
    return res.render("register", { 
      name: name,
      email: email, 
      msg1: "", 
      msg2: "Passwords do not match!",
      role: role
    });
  }

  // Check if user already exists
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.render("register", { 
        name: name,
        email: email, 
        msg1: "Email already registered!", 
        msg2: "",
        role: role
      });
    }
  } catch (err) {
    console.log("Mongoose error:", err);
    return res.render("register", { 
      name: name,
      email: email, 
      msg1: "Database error occurred", 
      msg2: "",
      role: role
    });
  }

  // Hash password
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      departement: departement,
      role: role
    });

    await newUser.save();
    console.log("User registered successfully:", email);

    // Redirect to login with success message
    return res.render("login", {
      email: email,
      msg1: "Registration successful! Please log in.",
      msg2: ""
    });
  } catch (err) {
    console.log("Error saving user:", err);
    return res.render("register", { 
      name: name,
      email: email, 
      msg1: "", 
      msg2: "Error creating account. Please try again.",
      role: role
    });
  }
};
