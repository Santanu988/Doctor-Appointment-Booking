# 🏥 Doctor Appointment Booking System

A full-featured healthcare appointment booking platform built with **Node.js**, **Express**, **MongoDB**, and **EJS**. This system includes user and admin portals, dynamic appointment booking, authentication, email notifications, and PDF generation.

## 🚀 Features

## 👩‍⚕️ Admin Features
- Admin authentication and profile management
- Manage department & service & blog CRUD with image upload
- Manage Doctor CRUD with image and also manage doctor active inactive status
- Manage shifts, appointments, and user accounts
- Manage pending, approved, reject appointments 
- Resolve appointments and send PDF via email
- Manage user comment like delete comment and also manage user account like user account delete & user account restore
- show all patients details
- Soft  delete functionality for all entities

### 🧑‍💻 User Features
- User registration & login (with image upload)
- Forgot password with OTP verification
- Change password
- Account delete
- Edit profile
- Book appointment by selecting department, doctor, date & time
- View appointment status and get notifications at email
- PDF confirmation after appointment resolve & Approved

### 📧 Email & PDF
- Send emails for forgotpassword
- Send emails for approved, reject, resolve, delete comment.
- Attach PDF report after appointment resolution & Appoinment Approved
- Appointments details of specific user support in PDF



### ⚙️ Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Templating:** EJS
- **Validation:** node-input-validator
- **Auth:** JWT, bcrypt
- **File Upload:** Multer
- **Email:** Nodemailer (Gmail SMTP)
- **PDF Generation:** PDFKit

### Admin Login URL

 http://localhost:3007/admin/login
    email:admin@gmail.com
    password :123456

### User Login URL

 http://localhost:3007/login
    email:user@gmail.com
    password :123456

