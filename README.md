# 🎓 Assignment Approval System

A web-based **Assignment Approval System** designed to simplify and digitize the process of assignment submission, review, and approval within a university environment.

The system provides different interfaces and functionalities for **Students, Professors, and Administrators**, helping manage assignments through a centralized platform.

## 🚀 Live Demo

[Assignment Approval System](https://assignment-approval-system.vercel.app/)

## 📌 Features

* 🔐 User authentication and login
* 👨‍🎓 Student dashboard
* 👨‍🏫 Professor dashboard
* 🛡️ Admin dashboard
* 📚 Assignment submission and approval workflow
* 📊 Dashboard and assignment management
* 🔎 Search and filtering functionality
* 📄 File upload and management
* ☁️ Cloudinary integration for file storage
* 🔑 Password encryption using bcrypt
* 🎟️ JWT-based authentication
* 🗄️ MongoDB database integration

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Token (JWT)
* bcrypt
* Cookie Parser

### File Management

* Multer
* Cloudinary

### Development Tools

* Nodemon
* dotenv

## 🏗️ Project Structure

```text
Assignment_Approval_System/
│
├── controller/
│
├── model/
│   ├── query/
│   └── schema/
│
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── professorRoutes.js
│   └── studentRoutes.js
│
├── views/
│   ├── admin/
│   ├── professor/
│   └── student/
│
├── public/
│
├── signature/
│
├── server.js
├── package.json
└── README.md
```

## 👥 User Roles

### 👨‍🎓 Student

Students can:

* Submit assignments
* Manage their assignments
* Track assignment status
* Access their dashboard

### 👨‍🏫 Professor

Professors can:

* View submitted assignments
* Review assignments
* Approve or reject assignments
* Manage assignment-related activities

### 🛡️ Administrator

Administrators can:

* Manage users
* Manage departments
* Monitor the system
* Access administrative functionality

## 🔄 Assignment Workflow

```text
Student
   │
   │ Submit Assignment
   ▼
Professor
   │
   │ Review Assignment
   ▼
Approve / Reject
   │
   ▼
Assignment Status Updated
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Salendra4444/Assignment_Approval_System.git
```

### 2. Navigate to the project

```bash
cd Assignment_Approval_System
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the values with your own credentials.

### 5. Start the application

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

## 🔒 Security

The application uses:

* Password hashing with **bcrypt**
* JWT-based authentication
* Cookie-based authentication
* Environment variables for sensitive credentials
* Protected routes

---

## 🔎 Test/demo accounts (development only)

To make it easy to try the app locally without creating users, a set of plain-text demo credentials was temporarily added to the authentication controller. These are intended for local development or demo purposes only.

Use the following credentials on the login page:

- Admin (admin dashboard)
  - Email: admin@gmail.com
  - Password: admin

- Student (student dashboard)
  - Email: student1@example.com
  - Password: student1

- Another Student
  - Email: student2@example.com
  - Password: student2

- Professor (professor dashboard)
  - Email: prof@example.com
  - Password: prof1

- H.O.D (hod dashboard)
  - Email: hod@example.com
  - Password: hodadmin

Important notes
- These demo credentials are stored in plain text in the code for convenience — DO NOT use them in production or on any public deployment.
- Recommended alternatives for safer testing:
  1. Use the `routes/dataSeeding.js` script to seed users with hashed passwords into your local database (I can update that script to insert these accounts with bcrypt-hashed passwords if you want).
  2. Store test credentials in a `.env` file and read them at runtime.
  3. Remove the hardcoded demo checks before deploying.

---

## 🗄️ Database

The application uses **MongoDB** with **Mongoose** for storing and managing application data.

## 📁 File Upload

The application uses **Multer** for handling file uploads and **Cloudinary** for cloud-based file storage.

## 🎯 Project Objective

The main objective of this project is to replace the manual assignment approval process with a centralized digital platform.

The system helps to:

* Reduce manual paperwork
* Simplify assignment submission
* Make assignment review easier
* Improve communication between students and professors
* Organize assignment records
* Track assignment approval status

## 🔮 Future Enhancements

* 📧 Email notifications for assignment status
* 🔔 Real-time notifications
* 📊 Assignment analytics and reports
* 🤖 AI-assisted assignment feedback
* 📝 Automated plagiarism detection
* 📱 Improved mobile responsiveness

## 👨‍💻 Author

**Salendra Singh Yadav**
