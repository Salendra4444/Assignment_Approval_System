const express = require('express');
const auth = require('../controller/verifyAuthController');
const AssignmentModel = require('../model/schema/assignment');
const userModel = require('../model/schema/Registeration');
const professorQuerry = require("../model/query/professorDashboardQuerry")
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();



router.get('/professorDashboard',auth, async(req, res) => {
  const user = req.user;
  const professor = await userModel.findOne({ email: user.email });
  const students = professor
    ? await userModel.find({ role: 'Student', departement: professor.departement }).select('_id name email')
    : [];
  const studentIds = students.map(student => student._id);
  const stats = await professorQuerry(studentIds);
  const pendingAssignments = await AssignmentModel
    .find({ status: "Submitted", studentId: { $in: studentIds } })
    .sort({ submittedAt: -1 });
  const studentsById = new Map(students.map(student => [String(student._id), student]));
  pendingAssignments.forEach(assignment => {
    assignment.student = studentsById.get(String(assignment.studentId));
  });
  console.log("Professor Details:", stats);
  res.render("professorDashboard", { activePage: "dashboard",pendingAssignments,stats});
});




// router.get('/professor/myReview',auth, async(req, res) => {
//    const assignments  = await AssignmentModel.find();
//    let pages = 0;
//   res.render("myReview", { activePage: "reviews",assignments,pages });
// });

router.get('/professor/myReview', auth, async (req, res) => {

    let { page = 1, status, sort = "new" } = req.query;
    page = Number(page);

    const limit = 5;
    const skip = (page - 1) * limit;

    // Get the logged-in professor's students by department.
    const user = req.user;
    const professor = await userModel.findOne({ email: user.email });
    const students = professor
      ? await userModel.find({ role: 'Student', departement: professor.departement }).select('_id')
      : [];
    const studentIds = students.map(student => student._id);

    let filter = { studentId: { $in: studentIds } };
    if(status) filter.status = status;

    // Sorting
    let sortQuery = { submittedAt: sort === "new" ? -1 : 1 };

    // Paginated Data
    const assignments = await AssignmentModel
        .find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

    const assignmentStudentIds = assignments.map(assignment => assignment.studentId);
    const assignmentStudents = await userModel
      .find({ _id: { $in: assignmentStudentIds } })
      .select('name email');
    const studentsById = new Map(assignmentStudents.map(student => [String(student._id), student]));
    assignments.forEach(assignment => {
      assignment.student = studentsById.get(String(assignment.studentId));
    });

    // Correct total count based on SAME FILTER
    const totalAssignments = await AssignmentModel.countDocuments(filter);
    const pages = Math.ceil(totalAssignments / limit);

    res.render("myReview", {
        activePage: "reviews",
        assignments,
        pages,
        currentPage: page
    });
});





router.get('/professor/profile',auth, async (req, res) => {
  const userDetail = req.user;
  const user = await userModel.findOne({email:userDetail.email}) || {
    name: userDetail.email ? userDetail.email.split('@')[0] : 'Professor',
    email: userDetail.email || '',
    phone: '',
    departement: ''
  };
  console.log("User Details:", user);
  res.render("professorProfile", { activePage: "profile" , user });
});

router.get('/professor/details/:id', auth, async (req, res) => {
  const assignment = await AssignmentModel.findById(req.params.id);
  const professor = await userModel.findOne({ email: req.user.email });
  const student = assignment ? await userModel.findById(assignment.studentId) : null;

  if (!assignment || !professor || !student || student.departement !== professor.departement) {
    return res.status(403).send('You cannot view this assignment');
  }

  res.render('review', { activePage: 'dashboard', assignment, student, detailsOnly: true });
});



router.get('/professor/review/:id',auth, async(req, res) => {
   const id = req.params.id;
   const assignment  = await AssignmentModel.findById(id);
  const professor = await userModel.findOne({ email: req.user.email });
  const student = assignment ? await userModel.findById(assignment.studentId) : null;

  if (!assignment || !professor || !student || student.departement !== professor.departement) {
    return res.status(403).send('You cannot review this assignment');
  }

   console.log("Assignment Details:", student);
  res.render("review", { activePage: "dashboard",assignment,student });
});

















const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("application/pdf")) {
      const uploadpath = path.join(__dirname,"..",'signature', 'uploads')
      console.log("upload path :",uploadpath)
      fs.mkdirSync(uploadpath, { recursive: true })
      cb(null, uploadpath)
    }
    else {
      return cb(new Error('Only image or PDF files are allowed!'));
    }
  },
  filename: (req, file, cb) => {
    let name = Date.now() + "-" + file.originalname
    cb(null, name)
  }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("application/pdf")) {
      cb(null, true)
    } else {
      cb(new Error('Only pdf files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
    fieldSize: 50 * 1024 * 1024
  }
})












router.post('/review/submit',auth, async (req, res) => {
    const assignment = await AssignmentModel.findById(req.body.assignmentId);
    if (!assignment || assignment.status !== 'Submitted') {
      return res.status(400).send('This assignment is not awaiting professor review');
    }

    const professor = await userModel.findOne({ email: req.user.email });
    if (req.user.role !== 'Professor' && professor?.role !== 'Professor') {
      return res.status(403).send('Only professors can review assignments');
    }
    const student = await userModel.findById(assignment.studentId);
    if (professor && student && professor.departement !== student.departement) {
      return res.status(403).send('You cannot review assignments from another department');
    }

    const reviewer = professor?.name || req.user.email;
    const update = {
      status: req.body.action === 'approve' ? 'HOD Review' : 'Rejected',
      currentReviewer: req.body.action === 'approve' ? 'Head of Department' : reviewer,
      professorRemarks: req.body.remarks || '',
      professorReviewedBy: reviewer,
      professorReviewedAt: new Date()
    };

    await AssignmentModel.findByIdAndUpdate(assignment._id, update);
    res.redirect('/professor/myReview');
});



module.exports = router;