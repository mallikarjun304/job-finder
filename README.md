# 🧑‍💼 Job Finder Portal

A professional **Job Finder web application** built using **HTML, CSS, and JavaScript**, designed to simulate real-world job portals like **LinkedIn** and **Naukri**.  
This project supports **role-based authentication**, **job posting**, **job application tracking**, and **admin moderation**, all handled on the frontend using **localStorage**.

---

## 🚀 Live Demo
🔗 https://mallikarjun304.github.io/job-finder/

---

## 📌 Features

### 👤 Job Seeker
- User registration & login
- View approved job listings
- Upload resume while applying
- Apply to a job only once
- Track application status:
  - Applied
  - Interview
  - Hired
  - Rejected

### 🏢 Employer
- Employer registration & login
- Post new jobs (subject to admin approval)
- View applications only for their jobs
- Download resume (file name reference)
- Update application status:
  - Interview / Hire / Reject

### 🛡️ Admin
- Separate admin login
- Verify employers
- Approve or reject job postings
- View analytics:
  - Total users
  - Total jobs
  - Total applications

### 👀 Guest User
- Browse approved job listings without login

---

## 🧱 Tech Stack

| Technology | Usage |
|----------|------|
| HTML5 | Structure |
| CSS3 | Styling & layout |
| JavaScript (ES6) | Logic & interactivity |
| localStorage | Data persistence |
| GitHub Pages | Deployment |

---

## 🧠 Application Flow

1. User selects role (Job Seeker / Employer / Admin)
2. Authentication is handled using localStorage
3. Employers post jobs → Admin approves them
4. Job seekers apply with resume upload
5. Employers manage application status
6. Admin monitors and controls the system

---

## 🔐 Admin Login Credentials

Email : admin@jobfinder.com
Password : admin123


*(Admin account is auto-created on first load)*

---

## 📁 Project Structure

job-finder/
│
├── index.html
├── register.html
├── login.html
├── admin-login.html
├── dashboard.html
├── style.css
└── script.js

---

## ⚙️ How to Run Locally

1. Clone the repository
git clone https://github.com/mallikarjun304/job-finder.git

## Author

Mallikarjun Pattigari
B.Tech – Computer Science
Aspiring Full Stack Developer

🔗 GitHub: https://github.com/mallikarjun304
