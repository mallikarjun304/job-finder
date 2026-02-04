
//COMMON UTILITIES

function go(page) {
  window.location.href = page;
}

function logout() {
  localStorage.removeItem("currentUser");
  go("index.html");
}

function guest() {
  localStorage.setItem("currentUser", JSON.stringify({ role: "guest" }));
  go("dashboard.html");
}


//AUTO CREATE ADMIN

let users = JSON.parse(localStorage.getItem("users")) || [];
if (!users.find(u => u.role === "admin")) {
  users.push({
    name: "Admin",
    email: "admin@jobfinder.com",
    password: "admin123",
    role: "admin",
    verified: true
  });
  localStorage.setItem("users", JSON.stringify(users));
}

//REGISTER
function register() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.push({
    name: name.value,
    email: email.value,
    password: password.value,
    role: role.value,
    verified: role.value === "employer" ? false : true
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered successfully");
  go("login.html");
}

//LOGIN
function userLogin() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(
    u =>
      u.email === email.value &&
      u.password === password.value &&
      u.role !== "admin"
  );

  if (!user) {
    alert("Invalid user credentials");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  go("dashboard.html");
}


function adminLogin() {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let admin = users.find(
    u =>
      u.email === email.value &&
      u.password === password.value &&
      u.role === "admin"
  );

  if (!admin) {
    alert("Invalid admin credentials");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(admin));
  go("dashboard.html");
}

//DASHBOARD ROUTER
const user = JSON.parse(localStorage.getItem("currentUser"));
const title = document.getElementById("title");
const content = document.getElementById("content");

if (user) {
  if (user.role === "jobseeker") jobSeekerUI();
  else if (user.role === "employer") employerUI();
  else if (user.role === "admin") adminUI();
  else guestUI();
}

//JOB SEEKER DASHBOARD
function jobSeekerUI() {
  title.innerText = "Job Seeker Dashboard";

  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  let apps = JSON.parse(localStorage.getItem("applications")) || [];

  let approvedJobs = jobs.filter(j => j.status === "approved");

  content.innerHTML = `
    <h3>Approved Jobs</h3>
    ${approvedJobs.map(j => {
      let alreadyApplied = apps.some(
        a => a.jobId === j.id && a.applicantEmail === user.email
      );

      return `
        <div class="job">
          <p><b>${j.title}</b></p>
          ${
            alreadyApplied
              ? `<p>Status: ${
                  apps.find(
                    a => a.jobId === j.id && a.applicantEmail === user.email
                  ).status
                }</p>`
              : `
                <input type="file" id="resume-${j.id}">
                <button onclick="applyJob(${j.id})">Apply</button>
              `
          }
        </div>
      `;
    }).join("")}
  `;
}

function applyJob(jobId) {
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  let job = jobs.find(j => j.id === jobId);

  let file = document.getElementById(`resume-${jobId}`).files[0];
  if (!file) {
    alert("Please upload resume");
    return;
  }

  let apps = JSON.parse(localStorage.getItem("applications")) || [];

  apps.push({
    appId: Date.now(),
    jobId: job.id,
    jobTitle: job.title,
    employerEmail: job.employerEmail,
    applicantEmail: user.email,
    resumeName: file.name,
    status: "Applied"
  });

  localStorage.setItem("applications", JSON.stringify(apps));
  alert("Applied successfully");
  jobSeekerUI();
}

//EMPLOYER DASHBOARD
function employerUI() {
  title.innerText = "Employer Dashboard";

  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  let apps = JSON.parse(localStorage.getItem("applications")) || [];

  let myJobs = jobs.filter(j => j.employerEmail === user.email);
  let myApps = apps.filter(a => a.employerEmail === user.email);

  content.innerHTML = `
    <h3>Post Job</h3>
    <input id="jobTitle" placeholder="Job Title">
    <button onclick="postJob()">Post Job</button>

    <h3>My Job Applications</h3>
    ${myApps.map(a => `
      <div class="job">
        <p><b>${a.jobTitle}</b></p>
        <p>${a.applicantEmail}</p>
        <p>Resume: ${a.resumeName}</p>
        <p>Status: <b>${a.status}</b></p>

        ${
          a.status === "Hired" || a.status === "Rejected"
            ? ""
            : `
              <button onclick="setStatus(${a.appId}, 'Interview')">Interview</button>
              <button onclick="setStatus(${a.appId}, 'Hired')">Hire</button>
              <button onclick="setStatus(${a.appId}, 'Rejected')">Reject</button>
            `
        }
      </div>
    `).join("")}
  `;
}

function postJob() {
  if (user.verified === false) {
    alert("Waiting for admin approval");
    return;
  }

  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  jobs.push({
    id: Date.now(),
    title: jobTitle.value,
    employerEmail: user.email,
    status: "pending"
  });

  localStorage.setItem("jobs", JSON.stringify(jobs));
  alert("Job sent for admin approval");
  employerUI();
}

function setStatus(appId, status) {
  let apps = JSON.parse(localStorage.getItem("applications")) || [];
  let app = apps.find(a => a.appId === appId);

  if (!app) {
    alert("Application not found");
    return;
  }

  app.status = status;
  localStorage.setItem("applications", JSON.stringify(apps));
  alert("Status updated to " + status);
  employerUI();
}

//ADMIN DASHBOARD
function adminUI() {
  title.innerText = "Admin Dashboard";

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  let apps = JSON.parse(localStorage.getItem("applications")) || [];

  content.innerHTML = `
    <h3>Analytics</h3>
    <p>Total Users: ${users.length}</p>
    <p>Total Jobs: ${jobs.length}</p>
    <p>Total Applications: ${apps.length}</p>

    <h3>Verify Employers</h3>
    ${users
      .filter(u => u.role === "employer" && !u.verified)
      .map((u, i) => `
        <div class="job">
          ${u.name || u.email}
          <button onclick="verifyEmployer(${i})">Verify</button>
        </div>
      `).join("")}

    <h3>Pending Jobs</h3>
    ${jobs
      .filter(j => j.status === "pending")
      .map(j => `
        <div class="job">
          ${j.title}
          <button onclick="approveJob(${j.id})">Approve</button>
        </div>
      `).join("")}
  `;
}

function verifyEmployer(index) {
  let users = JSON.parse(localStorage.getItem("users"));
  users[index].verified = true;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Employer verified");
  adminUI();
}

function approveJob(jobId) {
  let jobs = JSON.parse(localStorage.getItem("jobs"));
  let job = jobs.find(j => j.id === jobId);
  if (!job) return;

  job.status = "approved";
  localStorage.setItem("jobs", JSON.stringify(jobs));
  alert("Job approved");
  adminUI();
}

//GUEST
function guestUI() {
  title.innerText = "Browse Jobs";
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  content.innerHTML = jobs
    .filter(j => j.status === "approved")
    .map(j => `<p>${j.title}</p>`)
    .join("");
}
