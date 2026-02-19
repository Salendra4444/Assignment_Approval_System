const express = require('express');
const userModel = require('../model/schema/Registeration');
const departmentModel = require("../model/schema/Department")
const router = express.Router();
const bcrypt = require('bcrypt');
const dashboardQuery = require('../model/query/dashBoardQuery');
const allDepartments = require('../model/query/DepartmentQuery');


      

router.get('/adminDashboard', async (req, res) => {
  const data = await dashboardQuery.getUserStats();
  const deptCount = await dashboardQuery.getDepartmentCount();
  console.log('Rendering admin dashboard');
  res.render("adminDashbord", { data, deptCount });
});


/************************************************************************************/

router.get('/Departments', async (req, res) => {
  console.log("Rendering Department page");

  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  // Get filters from query
  const search = req.query.search || "";
  const programmeType = req.query.programmeType || "";
  const address = req.query.address || "";

  // Build dynamic filter object
  const filter = {};

  // Search by department name, programmeType or address
  if (search) {
    filter.$or = [
      { departmentName: { $regex: search, $options: "i" } },
      { programmeType: { $regex: search, $options: "i" } },
      { address: { $regex: search, $options: "i" } }
    ];
  }

  // Filter by programme type
  if (programmeType) {
    filter.programmeType = programmeType;
  }

  // Filter by address
  if (address) {
    filter.address = address;
  }

  // Fetch distinct address list for filter dropdown
  const addressList = await departmentModel.distinct("address");

  // Count & Fetch paginated results
  const totalDepartments = await departmentModel.countDocuments(filter);
  const data = await departmentModel.find(filter).skip(skip).limit(limit);

  const totalPages = Math.ceil(totalDepartments / limit);

  res.render("Departments", {
    data,
    currentPage: page,
    totalPages,
    search,
    programmeType,
    address,
    addressList
  });
});





router.get('/addDepartment', async (req, res) => {
  console.log('Rendering addDepartment page');
  res.render("addDepartment");
});




router.post('/addDepartment', async (req, res) => {
  const { deptName, programType, address } = req.body;
  await departmentModel.create({
    departmentName: deptName,
    programmeType: programType,
    address: address
  })

  console.log(deptName, programType, address);

  res.redirect('/Departments');
});




router.get('/editDepartment/:id', async (req, res) => {
  console.log('Rendering edit users page');
  const deptData = await departmentModel.findById(req.params.id);
  res.render("editDepartment", { deptData });
});



router.post('/update-dept/:id', async (req, res) => {
  const { deptName, programType, address } = req.body;
  const id = req.params.id;
  await departmentModel.findByIdAndUpdate(id, {
    departmentName: deptName,
    programmeType: programType,
    address: address
  },
    { new: true, runValidators: true }
  )

  res.redirect('/Departments');
});




router.post('/deleteDepartment/:id', async (req, res) => {
  console.log('deleting department');
  await departmentModel.findByIdAndDelete(req.params.id);
  res.redirect("/departments")
});



// router.get('/Departments', async (req, res) => {
//   console.log('Rendering Department page');
//   const page = parseInt(req.query.page) || 1;
//   const limit = 5;
//   const skip = (page - 1) * limit;
//   const totalDepartments = await departmentModel.countDocuments();
//   const data = await departmentModel.find().skip(skip).limit(limit);
//   const totalPages = Math.ceil(totalDepartments / limit);
//   res.render("Departments", { data, currentPage: page, totalPages });
// });



/************************************************************************************/


  

router.get('/users', async (req, res) => {
  console.log('Rendering user page');

  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  // Get filters
  const search = req.query.search || "";
  const role = req.query.role || "";
  const department = req.query.department || "";

  const totalUsers = await userModel.countDocuments();

  // Fetch user data (your code had departmentModel by mistake)
  const users = await userModel.find().skip(skip).limit(limit);

  // Departments list for dropdown
  const departments = await departmentModel.find();

  const totalPages = Math.ceil(totalUsers / limit);

  res.render("users", {
    users,
    departments,
    search,
    role,
    department,
    currentPage: page,
    totalPages
  });
});




router.get('/addUsers', async (req, res) => {
  console.log('Rendering add users page');
  const alldepartments = await allDepartments();
 // console.log(alldepartments);
  res.render("addUser", { alldepartments });
});



router.post('/add-users', async (req, res) => {
  const { name, email, password, phone, department, role } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const ack = await userModel.create({
    name: name,
    email: email,
    password: hashedPassword,
    phone: phone,
    departement: department,
    role: role
  })

  res.redirect("/users");
})




router.post('/update-user/:id', async (req, res) => {
  const { name, email, password, phone, department, role } = req.body;
  const id = req.params.id;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const ack = await userModel.findByIdAndUpdate(id, {
    name: name,
    email: email,
    password: hashedPassword,
    phone: phone,
    departement: department,
    role: role
  },
    { new: true, runValidators: true }
  )

  res.redirect("/users");
})


router.get('/editUser/:id', async (req, res) => {
  console.log('Rendering edit users page');
  const userData = await userModel.findById(req.params.id);
  const alldepartments = await allDepartments();
 // console.log(alldepartments);
  res.render("editUser", { userData, alldepartments });
});



router.post('/deleteUser/:id', async (req, res) => {
  console.log('deleting user');
  await userModel.findByIdAndDelete(req.params.id);
  res.redirect("/users")
});




module.exports = router ;