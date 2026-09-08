require('dotenv').config();
const express = require('express');
const AssignmentModel = require('../model/schema/assignment')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const assignmentStatus = require('../model/query/studentDashboardQuery');
const DepartmentModel = require('../model/schema/Department');
const router = express.Router();
const auth = require('../controller/verifyAuthController');
const userModel = require('../model/schema/Registeration');



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});






//-----------------------------------------------------------------------------------------------------------





router.get('/studentDashboard',auth, async(req, res) => {
  const data = await assignmentStatus();
  const assignment = await AssignmentModel.find();
  const assignments = await AssignmentModel.find().sort({ createdAt: -1 }).limit(5);   // newest first.limit(5);
  console.log('Rendering student dashboard' , assignments);
  res.render("studentDashbord", { activePage: "dashboard" ,data,assignments});
});





//-----------------------------------------------------------------------------------------------------------






router.get("/allAssignments",auth, async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 5; // 5 assignments per page
    let skip = (page - 1) * limit;

    const status = req.query.status || "";
    const sort = req.query.sort || "newest";

    let query = {};
    if (status) query.status = status;

    let sortOption = sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const totalAssignments = await AssignmentModel.countDocuments(query);

    const assignments = await AssignmentModel.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    res.render("allAssignments", {
        assignments,
        status,
        sort,
        page,
        totalPages: Math.ceil(totalAssignments / limit)
    });
});









//-----------------------------------------------------------------------------------------------------------







router.get('/studentProfile',auth, async (req, res) => {
  const email = req.user && req.user.email;

  if (!email) {
    return res.redirect('/?error=invalid_session');
  }

  try {
    let user = await userModel.findOne({ email });

    if (!user && req.user.role === 'Student') {
      user = await userModel.create({
        name: email.split('@')[0],
        email,
        role: 'Student'
      });
    }

    if (!user) {
      return res.status(404).send('Student profile not found');
    }

    res.render("studentProfile", {
      activePage: "profile",
      user,
      message: req.query.message,
      error: req.query.error
    });
  } catch (err) {
    console.error('Unable to load student profile:', err);
    res.status(500).send('Unable to load student profile');
  }
});

router.post('/studentProfile/phone', auth, async (req, res) => {
  const phone = String(req.body.phone || '').trim();

  if (!/^\d{10}$/.test(phone)) {
    return res.redirect('/studentProfile?error=Phone number must contain exactly 10 digits');
  }

  try {
    const user = await userModel.findOneAndUpdate(
      { email: req.user.email },
      { phone: Number(phone) },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.redirect('/studentProfile?error=Student account not found');
    }

    res.redirect('/studentProfile?message=Phone number updated');
  } catch (err) {
    console.error('Unable to update phone number:', err);
    res.redirect('/studentProfile?error=Unable to update phone number');
  }
});

router.post('/studentProfile/reset-password', auth, async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  const student = await userModel.findOne({ email: req.user.email, role: 'Student' });
  if (!student) {
    return res.status(403).send('Only student accounts can reset a student password');
  }

  if (!newPassword || newPassword.length < 6) {
    return res.redirect('/studentProfile?error=Password must be at least 6 characters');
  }

  if (newPassword !== confirmPassword) {
    return res.redirect('/studentProfile?error=Passwords do not match');
  }

  try {
    const password = await bcrypt.hash(newPassword, 10);
    const user = await userModel.findOneAndUpdate(
      { email: req.user.email },
      { password },
      { new: true }
    );

    if (!user) {
      return res.redirect('/studentProfile?error=Student account not found');
    }

    res.redirect('/studentProfile?message=Password reset successfully');
  } catch (err) {
    console.error('Unable to reset password:', err);
    res.redirect('/studentProfile?error=Unable to reset password');
  }
});




//-----------------------------------------------------------------------------------------------------------




router.get('/preview/:id',auth, async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const assignment = await AssignmentModel.findById(id);
  console.log("Assignment Details:", assignment);
  
  res.render("assignmentPreview", { activePage: "dashboard",assignment});
});









//-----------------------------------------------------------------------------------------------------------



router.get('/submitReview/:id',auth, async(req, res) => {
  const assignmentId = req.params.id;
  const assignment =  await AssignmentModel.findById(assignmentId);
  res.render("assignmentDetail", { activePage: "dashboard", assignment });
});


router.post('/submitReview/:id',auth, async(req, res) => {
  const assignmentId = req.params.id;
  const user = await userModel.findOne({ email: req.user.email });
  const assignment = await AssignmentModel.findById(assignmentId);

  if (!user || !assignment || String(assignment.studentId) !== String(user._id)) {
    return res.status(403).send('You can only submit your own assignment');
  }

  await AssignmentModel.findByIdAndUpdate(assignmentId, {
    status: "Submitted",
    currentReviewer: null
  });

  res.redirect('/allAssignments');
});





//-----------------------------------------------------------------------------------------------------------












const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("application/pdf")) {
      const uploadpath = path.join(__dirname,"..", 'uploads')
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










//-----------------------------------------------------------------------------------------------------------



router.get('/single-upload',auth, (req, res) => {
  res.render("singleUpload", { activePage: "dashboard"});
});

router.get('/uploadAssignment', auth, (req, res) => {
  res.render("singleUpload", { activePage: "dashboard" });
});


router.post('/uploadAssignment', auth ,upload.single('singleUpload'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).render("singleUpload", {
        error: "Please select a PDF file to upload.",
        activePage: "dashboard"
      });
    }

    const { title, description } = req.body;
    const category = 'Assignment';

    if (!title || !description) {
      fs.unlinkSync(req.file.path);
      return res.status(400).render("singleUpload", {
        error: "Title and description are required.",
        activePage: "dashboard"
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'my-app-uploads',
      resource_type: 'raw', // required for PDF/docx/zip files
      filename_override: req.file.originalname, 
      use_filename: true,
      unique_filename: false
    });

    const preview_url = result.secure_url;
    const download_url = result.secure_url.replace("/upload/", "/upload/fl_attachment/");
  
  


    const userEmail = req.user && req.user.email;
    let user = userEmail ? await userModel.findOne({ email: userEmail }) : null;

    if (!user && req.user.role === 'Student') {
      user = await userModel.create({
        name: userEmail.split('@')[0],
        email: userEmail,
        role: 'Student'
      });
    }

    if (!user) {
      throw new Error('Student account not found');
    }

    const ack = await AssignmentModel.create({
      studentId: user._id,
      title:title,
      description:description,
      category:category,
      filename: [req.file.originalname],
      status: "Submitted",
      currentReviewer: null,
      download_url:[download_url],
      preview_url: [preview_url]
    });

    // delete the temp file from server
    fs.unlinkSync(req.file.path);

    console.log({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });

    res.redirect('/studentDashboard');
  } catch (err) {
    console.error(err);
    res.render("singleUpload", { error: "Something went wrong try again later..." ,activePage: "dashboard" });
  }
});



//-----------------------------------------------------------------------------------------------------------



router.get('/bulk-upload',auth, (req, res) => {
  res.render("bulkUpload", { activePage: "dashboard"});
});



router.post('/uploadBulkAssignments',auth, upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const { title, description } = req.body;
    const category = 'Assignment';

    // Arrays to store preview_url and download_url
    const preview_url = [] //result.secure_url;
    const download_url = [] // result.secure_url.replace("/upload/", "/upload/fl_attachment/");
    const filename = [];

    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'my-app-uploads',
        resource_type: 'raw',  // for PDF/docx/etc.
        filename_override: file.originalname,
        use_filename: true,
        unique_filename: false
      });
      filename.push(file.originalname);
      preview_url.push(result.secure_url);
      download_url.push(result.secure_url.replace("/upload/", "/upload/fl_attachment/"));

      fs.unlinkSync(file.path); // delete local file
    }


    const userDetail = req.user;
    const user = await userModel.findOne({email:userDetail.email}); 

    // Save to MongoDB
    await AssignmentModel.create({
      studentId: user._id,
      title,
      description,
      category,
      filename: filename,
      status: "Draft",
      currentReviewer: null,
      download_url: download_url,
      preview_url:preview_url
    });

    res.redirect('/studentDashboard');

  } catch (err) {
    console.error(err);
    res.render("bulkUpload", {
      error: "Something went wrong, try again later...",
      activePage: "dashboard"
    });
  }
});











module.exports = router;