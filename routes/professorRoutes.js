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
  const professor = await userModel.find({email:user.email});
  const stats = await professorQuerry(professor[0].name);
  const pendingAssignments = await AssignmentModel.find({status:"Submitted",currentReviewer:professor[0].name});
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

    // Get Professor Name
    const user = req.user;
    const professor = await userModel.findOne({ email: user.email });

    let filter = { currentReviewer: professor.name };
    if(status) filter.status = status;

    // Sorting
    let sortQuery = { submittedAt: sort === "new" ? -1 : 1 };

    // Paginated Data
    const assignments = await AssignmentModel
        .find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

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
  const user = await userModel.findOne({email:userDetail.email}); 
  console.log("User Details:", user);
  res.render("professorProfile", { activePage: "profile" , user });
});




router.get('/professor/review/:id',auth, async(req, res) => {
   const id = req.params.id;
   const assignment  = await AssignmentModel.findById(id);
   const student = await userModel.findById(assignment.studentId);
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












router.post('/review/submit',auth,upload.array("signature"), async (req, res) => {
    console.log("BODY ->", req.body);       // Now works 🎉
    console.log("FILES ->", req.files);     // Signature files available here
  
  res.redirect('/professor/myReview');
});



module.exports = router;