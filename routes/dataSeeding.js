const express = require('express');
const userModel = require('../model/schema/Registeration');
const departmentModel = require("../model/schema/Department")
const AssignmentModel = require('../model/schema/assignment')
const router = express.Router();


const users = [
  { name: "Rohit Verma", email: "rohit@example.com", password: "pass123", phone: 9000000001, departement: "Computer Science", role: "Student" },
  { name: "Neha Sharma", email: "neha@example.com", password: "pass123", phone: 9000000002, departement: "Electronics and Communication", role: "Professor" },
  { name: "Aman Gupta", email: "aman@example.com", password: "pass123", phone: 9000000003, departement: "Mechanical Engineering", role: "HOD" },
  { name: "Pooja Singh", email: "pooja@example.com", password: "pass123", phone: 9000000004, departement: "Civil Engineering", role: "Student" },
  { name: "Vikas Mehta", email: "vikas@example.com", password: "pass123", phone: 9000000005, departement: "Information Technology", role: "Professor" },
  { name: "Sonal Jain", email: "sonal@example.com", password: "pass123", phone: 9000000006, departement: "Computer Science", role: "Student" },
  { name: "Rajat Khanna", email: "rajat@example.com", password: "pass123", phone: 9000000007, departement: "Electronics and Communication", role: "Professor" },
  { name: "Priya Nair", email: "priya@example.com", password: "pass123", phone: 9000000008, departement: "Mechanical Engineering", role: "Student" },
  { name: "Karan Yadav", email: "karan@example.com", password: "pass123", phone: 9000000009, departement: "Civil Engineering", role: "Professor" },
  { name: "Anjali Thakur", email: "anjali@example.com", password: "pass123", phone: 9000000010, departement: "Information Technology", role: "HOD" },

  { name: "Suresh Iyer", email: "suresh@example.com", password: "pass123", phone: 9000000011, departement: "Computer Science", role: "Professor" },
  { name: "Meena Reddy", email: "meena@example.com", password: "pass123", phone: 9000000012, departement: "Electronics and Communication", role: "Student" },
  { name: "Deepak Chauhan", email: "deepak@example.com", password: "pass123", phone: 9000000013, departement: "Mechanical Engineering", role: "Student" },
  { name: "Komal Joshi", email: "komal@example.com", password: "pass123", phone: 9000000014, departement: "Civil Engineering", role: "Professor" },
  { name: "Arjun Malhotra", email: "arjun@example.com", password: "pass123", phone: 9000000015, departement: "Information Technology", role: "Student" },

  { name: "Sneha Bhat", email: "sneha@example.com", password: "pass123", phone: 9000000016, departement: "Computer Science", role: "Student" },
  { name: "Harshit Pandey", email: "harshit@example.com", password: "pass123", phone: 9000000017, departement: "Electronics and Communication", role: "Professor" },
  { name: "Tanya Kapoor", email: "tanya@example.com", password: "pass123", phone: 9000000018, departement: "Mechanical Engineering", role: "HOD" },
  { name: "Nikhil Arora", email: "nikhil@example.com", password: "pass123", phone: 9000000019, departement: "Civil Engineering", role: "Professor" },
  { name: "Ritika Chauhan", email: "ritika@example.com", password: "pass123", phone: 9000000020, departement: "Information Technology", role: "Student" },

  { name: "Gaurav Dubey", email: "gaurav@example.com", password: "pass123", phone: 9000000021, departement: "Computer Science", role: "Professor" },
  { name: "Manisha Kaul", email: "manisha@example.com", password: "pass123", phone: 9000000022, departement: "Electronics and Communication", role: "Student" },
  { name: "Aditya Chauhan", email: "aditya@example.com", password: "pass123", phone: 9000000023, departement: "Mechanical Engineering", role: "Professor" },
  { name: "Pallavi Sinha", email: "pallavi@example.com", password: "pass123", phone: 9000000024, departement: "Civil Engineering", role: "Student" },
  { name: "Varun Ahuja", email: "varun@example.com", password: "pass123", phone: 9000000025, departement: "Information Technology", role: "Professor" },

  { name: "Reema Das", email: "reema@example.com", password: "pass123", phone: 9000000026, departement: "Computer Science", role: "Student" },
  { name: "Kunal Bansal", email: "kunal@example.com", password: "pass123", phone: 9000000027, departement: "Electronics and Communication", role: "HOD" },
  { name: "Nisha Tiwari", email: "nisha@example.com", password: "pass123", phone: 9000000028, departement: "Mechanical Engineering", role: "Professor" },
  { name: "Vivek Kumar", email: "vivek@example.com", password: "pass123", phone: 9000000029, departement: "Civil Engineering", role: "Student" },
  { name: "Divya Yadav", email: "divya@example.com", password: "pass123", phone: 9000000030, departement: "Information Technology", role: "Professor" },

  { name: "Rahul Sen", email: "rahul@example.com", password: "pass123", phone: 9000000031, departement: "Computer Science", role: "Student" },
  { name: "Mitali Ghosh", email: "mitali@example.com", password: "pass123", phone: 9000000032, departement: "Electronics and Communication", role: "Professor" },
  { name: "Ishaan Dey", email: "ishaan@example.com", password: "pass123", phone: 9000000033, departement: "Mechanical Engineering", role: "Student" },
  { name: "Preeti Nanda", email: "preeti@example.com", password: "pass123", phone: 9000000034, departement: "Civil Engineering", role: "Professor" },
  { name: "Alok Mishra", email: "alok@example.com", password: "pass123", phone: 9000000035, departement: "Information Technology", role: "HOD" },

  { name: "Simran Gill", email: "simran@example.com", password: "pass123", phone: 9000000036, departement: "Computer Science", role: "Student" },
  { name: "Devendra Patil", email: "devendra@example.com", password: "pass123", phone: 9000000037, departement: "Electronics and Communication", role: "Professor" },
  { name: "Kavita Menon", email: "kavita@example.com", password: "pass123", phone: 9000000038, departement: "Mechanical Engineering", role: "Student" },
  { name: "Rohini Joshi", email: "rohini@example.com", password: "pass123", phone: 9000000039, departement: "Civil Engineering", role: "Professor" },
  { name: "Sameer Puri", email: "sameer@example.com", password: "pass123", phone: 9000000040, departement: "Information Technology", role: "Student" },

  { name: "Swati Aggarwal", email: "swati@example.com", password: "pass123", phone: 9000000041, departement: "Computer Science", role: "Professor" },
  { name: "Aarti Bansal", email: "aarti@example.com", password: "pass123", phone: 9000000042, departement: "Electronics and Communication", role: "Student" },
  { name: "Puneet Bhalla", email: "puneet@example.com", password: "pass123", phone: 9000000043, departement: "Mechanical Engineering", role: "Professor" },
  { name: "Monika Jain", email: "monika@example.com", password: "pass123", phone: 9000000044, departement: "Civil Engineering", role: "HOD" },
  { name: "Ravi Kapoor", email: "ravi@example.com", password: "pass123", phone: 9000000045, departement: "Information Technology", role: "Student" },

  { name: "Dhruv Batra", email: "dhruv@example.com", password: "pass123", phone: 9000000046, departement: "Computer Science", role: "Professor" },
  { name: "Payal Raina", email: "payal@example.com", password: "pass123", phone: 9000000047, departement: "Electronics and Communication", role: "Student" },
  { name: "Rajeev Sood", email: "rajeev@example.com", password: "pass123", phone: 9000000048, departement: "Mechanical Engineering", role: "Professor" },
  { name: "Lavanya Pillai", email: "lavanya@example.com", password: "pass123", phone: 9000000049, departement: "Civil Engineering", role: "Student" },
  { name: "Tarun Joshi", email: "tarun@example.com", password: "pass123", phone: 9000000050, departement: "Information Technology", role: "HOD" }
];



const Userseeding = async () => {
  await userModel.insertMany(users)
  console.log("User data seeding ..... ")
}


// seeding();




const department = [
  { departmentName: "Computer Science", programmeType: "Undergraduate", address: "Building A, Floor 2" },
  { departmentName: "Information Technology", programmeType: "Postgraduate", address: "Building A, Floor 3" },
  { departmentName: "Electronics and Communication", programmeType: "Undergraduate", address: "Building B, Floor 1" },
  { departmentName: "Mechanical Engineering", programmeType: "Undergraduate", address: "Building C, Floor 2" },
  { departmentName: "Civil Engineering", programmeType: "Undergraduate", address: "Building D, Floor 1" },
  { departmentName: "Electrical Engineering", programmeType: "Postgraduate", address: "Building E, Floor 3" },
  { departmentName: "Automobile Engineering", programmeType: "Undergraduate", address: "Building F, Floor 1" },
  { departmentName: "Biotechnology", programmeType: "Undergraduate", address: "Building G, Floor 2" },
  { departmentName: "Chemical Engineering", programmeType: "Undergraduate", address: "Building H, Floor 2" },
  { departmentName: "Physics", programmeType: "Postgraduate", address: "Building I, Floor 3" },
  { departmentName: "Mathematics", programmeType: "Undergraduate", address: "Building I, Floor 1" },
  { departmentName: "English Literature", programmeType: "Undergraduate", address: "Building J, Floor 2" },
  { departmentName: "History", programmeType: "Postgraduate", address: "Building J, Floor 3" },
  { departmentName: "Political Science", programmeType: "Undergraduate", address: "Building K, Floor 1" },
  { departmentName: "Psychology", programmeType: "Undergraduate", address: "Building K, Floor 2" },
  { departmentName: "Sociology", programmeType: "Postgraduate", address: "Building L, Floor 1" },
  { departmentName: "Economics", programmeType: "Undergraduate", address: "Building L, Floor 3" },
  { departmentName: "Commerce", programmeType: "Undergraduate", address: "Building M, Floor 1" },
  { departmentName: "Management Studies", programmeType: "Postgraduate", address: "Building M, Floor 2" },
  { departmentName: "Accounting and Finance", programmeType: "Postgraduate", address: "Building N, Floor 3" },
  { departmentName: "Law", programmeType: "Undergraduate", address: "Building O, Floor 1" },
  { departmentName: "Fine Arts", programmeType: "Undergraduate", address: "Building P, Floor 2" },
  { departmentName: "Performing Arts", programmeType: "Postgraduate", address: "Building P, Floor 3" },
  { departmentName: "Architecture", programmeType: "Undergraduate", address: "Building Q, Floor 1" },
  { departmentName: "Interior Design", programmeType: "Postgraduate", address: "Building Q, Floor 2" },
  { departmentName: "Fashion Design", programmeType: "Undergraduate", address: "Building R, Floor 3" },
  { departmentName: "Media Studies", programmeType: "Undergraduate", address: "Building S, Floor 1" },
  { departmentName: "Mass Communication", programmeType: "Postgraduate", address: "Building S, Floor 2" },
  { departmentName: "Hotel Management", programmeType: "Undergraduate", address: "Building T, Floor 1" },
  { departmentName: "Tourism Management", programmeType: "Postgraduate", address: "Building T, Floor 3" },
  { departmentName: "Pharmacy", programmeType: "Undergraduate", address: "Building U, Floor 1" },
  { departmentName: "Pharmacology", programmeType: "Postgraduate", address: "Building U, Floor 2" },
  { departmentName: "Nursing", programmeType: "Undergraduate", address: "Building V, Floor 1" },
  { departmentName: "Medical Laboratory Technology", programmeType: "Undergraduate", address: "Building V, Floor 2" },
  { departmentName: "Radiology", programmeType: "Undergraduate", address: "Building W, Floor 1" },
  { departmentName: "Public Health", programmeType: "Postgraduate", address: "Building W, Floor 2" },
  { departmentName: "Data Science", programmeType: "Undergraduate", address: "Building X, Floor 3" },
  { departmentName: "Artificial Intelligence", programmeType: "Postgraduate", address: "Building X, Floor 2" },
  { departmentName: "Cyber Security", programmeType: "Undergraduate", address: "Building Y, Floor 1" },
  { departmentName: "Machine Learning", programmeType: "Postgraduate", address: "Building Y, Floor 2" },
  { departmentName: "Robotics", programmeType: "Undergraduate", address: "Building Z, Floor 1" },
  { departmentName: "Astronomy", programmeType: "Postgraduate", address: "Building Z, Floor 3" },
  { departmentName: "Geology", programmeType: "Undergraduate", address: "Building AA, Floor 1" },
  { departmentName: "Environmental Science", programmeType: "Postgraduate", address: "Building AB, Floor 2" },
  { departmentName: "Food Technology", programmeType: "Undergraduate", address: "Building AC, Floor 3" },
  { departmentName: "Agriculture", programmeType: "Undergraduate", address: "Building AD, Floor 1" },
  { departmentName: "Rural Development", programmeType: "Postgraduate", address: "Building AE, Floor 2" },
  { departmentName: "Sports Science", programmeType: "Undergraduate", address: "Building AF, Floor 1" },
  { departmentName: "Library Science", programmeType: "Undergraduate", address: "Building AG, Floor 3" },
  { departmentName: "Education", programmeType: "Postgraduate", address: "Building AH, Floor 2" }
];


const departmentSeeding = async () => {
  await departmentModel.insertMany(department);
  console.log("Department data seeding ..... ")
}

const assignments = [
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Data Structures Assignment",
    description: "Implement stack and queue using arrays",
    category: "assignment",
    status: "Draft",
    currentReviewer: null,
    submittedAt: new Date("2025-01-05")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "AI Research Thesis",
    description: "Thesis on deep learning optimization techniques",
    category: "thesis",
    status: "Approved",
    currentReviewer: "Dr. Rakesh Gupta",
    submittedAt: new Date("2025-01-02")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Web Development Report",
    description: "Report on frontend development trends",
    category: "report",
    status: "Submitted",
    currentReviewer: "Prof. Anita Desai",
    submittedAt: new Date("2025-01-10")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Computer Networks Assignment",
    description: "Explain OSI and TCP/IP models",
    category: "assignment",
    status: "Draft",
    currentReviewer: null,
    submittedAt: new Date("2025-01-11")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "ML Algorithms Thesis",
    description: "Study of KNN, SVM, and Naive Bayes",
    category: "thesis",
    status: "Rejected",
    currentReviewer: "Dr. Vivek Kashyap",
    submittedAt: new Date("2025-01-01")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Cloud Computing Report",
    description: "Analysis of AWS, Azure, and GCP services",
    category: "report",
    status: "Approved",
    currentReviewer: "Dr. Pooja Kulkarni",
    submittedAt: new Date("2025-01-08")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Operating Systems Assignment",
    description: "Study of memory management techniques",
    category: "assignment",
    status: "Submitted",
    currentReviewer: "Prof. Rahul Nair",
    submittedAt: new Date("2025-01-06")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Cybersecurity Thesis",
    description: "Thesis on network penetration testing",
    category: "thesis",
    status: "Draft",
    currentReviewer: null,
    submittedAt: new Date("2025-01-12")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "IoT Applications Report",
    description: "Report on IoT architecture and use cases",
    category: "report",
    status: "Approved",
    currentReviewer: "Dr. Neeraj Bansal",
    submittedAt: new Date("2025-01-04")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "DBMS Assignment",
    description: "Write SQL queries for employee database",
    category: "assignment",
    status: "Draft",
    currentReviewer: null,
    submittedAt: new Date("2025-01-13")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Robotics Thesis",
    description: "Thesis on autonomous robot navigation",
    category: "thesis",
    status: "Submitted",
    currentReviewer: "Dr. Hemant Joshi",
    submittedAt: new Date("2025-01-03")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Data Analysis Report",
    description: "Report on real-time data visualization",
    category: "report",
    status: "Rejected",
    currentReviewer: "Prof. Suresh Patel",
    submittedAt: new Date("2025-01-07")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Java Programming Assignment",
    description: "Write OOP-based student management system",
    category: "assignment",
    status: "Approved",
    currentReviewer: "Dr. Seema Kaur",
    submittedAt: new Date("2025-01-09")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Blockchain Thesis",
    description: "Thesis on blockchain-based authentication",
    category: "thesis",
    status: "Draft",
    currentReviewer: null,
    submittedAt: new Date("2025-01-15")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "AI Ethics Report",
    description: "Report on ethical issues in artificial intelligence",
    category: "report",
    status: "Submitted",
    currentReviewer: "Prof. Ritu Malhotra",
    submittedAt: new Date("2025-01-06")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Python Automation Assignment",
    description: "Automate tasks using Python scripts",
    category: "assignment",
    status: "Draft",
    currentReviewer: null,
    submittedAt: new Date("2025-01-14")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "AR/VR Thesis",
    description: "Thesis on virtual reality systems",
    category: "thesis",
    status: "Approved",
    currentReviewer: "Dr. Sneha Kapoor",
    submittedAt: new Date("2025-01-05")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Networking Report",
    description: "Report on LAN, MAN, and WAN differences",
    category: "report",
    status: "Draft",
    currentReviewer: null,
    submittedAt: new Date("2025-01-10")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Compiler Design Assignment",
    description: "Lexical analyzer design",
    category: "assignment",
    status: "Submitted",
    currentReviewer: "Prof. Akash Bhandari",
    submittedAt: new Date("2025-01-02")
  },
  {
    studentId: "6923f844adc18e3d5549bd59",
    title: "Quantum Computing Thesis",
    description: "Thesis on quantum gates and circuits",
    category: "thesis",
    status: "Draft",
    currentReviewer: null,
    submittedAt: new Date("2025-01-14")
  }
];




const assignmentSeeding = async () => {
  await AssignmentModel.insertMany(assignments);
  console.log("Assignment data seeding ..... ")
}


// departmentSeeding();


module.exports = { router, departmentSeeding, Userseeding,assignmentSeeding };