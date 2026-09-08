const express = require('express');
const auth = require('../controller/verifyAuthController');
const AssignmentModel = require('../model/schema/assignment');
const userModel = require('../model/schema/Registeration');

const router = express.Router();

const isHod = async (req, res, next) => {
  const hod = await userModel.findOne({ email: req.user.email });
  const tokenIsHod = ['HOD', 'H.O.D'].includes(req.user.role);
  const profileIsHod = ['HOD', 'H.O.D'].includes(hod?.role);
  if (!tokenIsHod && !profileIsHod) {
    return res.status(403).send('Only the Head of Department can access this page');
  }
  req.hod = hod || {
    name: 'Head of Department',
    email: req.user.email,
    role: 'HOD',
    departement: null
  };
  next();
};

router.get('/hodDashboard', auth, isHod, async (req, res) => {
  const hod = req.hod;
  const students = hod
    ? await userModel.find({ role: 'Student', departement: hod.departement }).select('_id name email departement')
    : [];
  const studentIds = students.map(student => student._id);
  const filter = hod && hod.departement
    ? { status: { $ne: 'Draft' }, studentId: { $in: studentIds } }
    : { status: { $ne: 'Draft' } };
  const assignments = await AssignmentModel.find(filter).sort({ submittedAt: -1 });
  const studentsById = new Map(students.map(student => [String(student._id), student]));
  const assignmentRows = assignments.map(assignment => ({
    assignment,
    student: studentsById.get(String(assignment.studentId)),
    teacherChecked: Boolean(assignment.professorReviewedAt)
  }));
  const dashboardStats = {
    total: assignmentRows.length,
    checked: assignmentRows.filter(row => row.teacherChecked).length,
    waitingForTeacher: assignmentRows.filter(row => !row.teacherChecked).length,
    waitingForHod: assignmentRows.filter(row => row.assignment.status === 'HOD Review').length
  };

  res.render('hodDashboard', {
    activePage: 'dashboard',
    assignmentRows,
    dashboardStats,
    hod: hod || { name: 'Head of Department', email: req.user.email }
  });
});

router.get('/hod/profile', auth, isHod, async (req, res) => {
  res.render('hodProfile', {
    activePage: 'profile',
    hod: req.hod,
    message: req.query.message,
    error: req.query.error
  });
});

router.post('/hod/profile/password', auth, isHod, async (req, res) => {
  if (!req.hod._id) {
    return res.redirect('/hod/profile?error=Create a database HOD account before changing the password');
  }
  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.redirect('/hod/profile?error=Password must be at least 6 characters');
  }
  if (newPassword !== confirmPassword) {
    return res.redirect('/hod/profile?error=Passwords do not match');
  }

  await userModel.findByIdAndUpdate(req.hod._id, {
    password: await require('bcrypt').hash(newPassword, 10)
  });
  res.redirect('/hod/profile?message=Password updated successfully');
});

router.post('/hod/assignment/:id/review', auth, isHod, async (req, res) => {
  const assignment = await AssignmentModel.findById(req.params.id);
  if (!assignment || assignment.status !== 'HOD Review') {
    return res.status(400).send('This assignment is not awaiting HOD review');
  }

  const hod = req.hod || await userModel.findOne({ email: req.user.email });
  const student = await userModel.findById(assignment.studentId);
  if (hod && student && hod.departement !== student.departement) {
    return res.status(403).send('You cannot review assignments from another department');
  }

  const reviewer = hod?.name || req.user.email;
  await AssignmentModel.findByIdAndUpdate(assignment._id, {
    status: req.body.action === 'approve' ? 'Approved' : 'Rejected',
    currentReviewer: reviewer,
    hodRemarks: req.body.remarks || '',
    hodReviewedBy: reviewer,
    hodReviewedAt: new Date()
  });

  res.redirect('/hodDashboard');
});



module.exports = router;