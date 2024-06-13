import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BDEStudentsAppliedJobsList.css';
import axios from 'axios';
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx';
const BDEStudentsAppliedJobsList = () => {
  const { jobId } = useParams();
  const [appliedStudents, setAppliedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [jobSkills, setJobSkills] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCGPA, setSelectedCGPA] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [rejectedStudents, setRejectedStudents] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  useEffect(() => {
    const fetchAppliedStudents = async () => {
      try {
        console.log(jobId)
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/getappliedstudentslist?job_id=${jobId}`);
        console.log("students list", response.data)
        console.log(response.data.students_applied)
        setAppliedStudents(response.data.students_applied);
        setJobSkills(response.data.jobSkills)
        setSelectedStudents(response.data.selected_students_ids);
        setRejectedStudents(response.data.rejected_students_ids);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchAppliedStudents();
  }, [jobId]);
  const downloadResume = async () => {
    try {
      const selectedStudentIds = filteredStudents.map(student => student.student_id);
      console.log(selectedStudentIds, jobId)
      // Call your backend API with selectedStudentIds 
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/downloadresume`, {
        student_ids: selectedStudentIds
      }, {
        responseType: 'blob' // Set responseType to blob
      });
      console.log('Selected students accepted:', response.data);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resumes.zip'); // Set the filename for download
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download resumes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to download resumes. Please check the selected list',
      });
    }
  };
  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(appliedStudents);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'applied_students.xlsx');
  };
  //accepting students 
  const acceptSelectedStudents = async () => {
    // Display a confirmation dialog using SweetAlert
    const result = await Swal.fire({
      title: 'Confirm Acceptance',
      text: 'Are you sure you want to reject the remaining students?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Cancel'
    });
    // If the user confirms, send the selected student IDs to the backend API
    if (result.isConfirmed) {
      try {
        const selectedStudentIds = filteredStudents.map(student => student.student_id);
        console.log(selectedStudentIds, jobId)

        if (selectedStudentIds.length === 0) {
          alert("No students selected. Please select at least one student.");
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No students selected. Please check the selected list',
          });
          return; // Exit function to prevent API call
        }
        // Call your backend API with selectedStudentIds
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/updatejobapplicants`, {
          selected_student_ids: selectedStudentIds, job_id: jobId
        });
        console.log('Selected students accepted:', response.data);
        console.log(response)
        if (response.status === 200) {
          Swal.fire({
            title: "Accecpted these selected students",
            icon: "success"
          });
        }
      } catch (error) {
        console.error('Failed to accept selected students:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to accept selected students',
        });
      }
    }
  };
  // Filter applied students based on selected department, CGPA, and skill
  const filteredStudents = appliedStudents.filter(student => {
    let departmentMatch = true;
    let cgpMatch = true;
    let skillMatch = true;
    if (selectedDepartment && student.department !== selectedDepartment) {
      departmentMatch = false;
    }
    if (selectedCGPA && parseFloat(student.highestGraduationCGPA) < parseFloat(selectedCGPA)) {
      cgpMatch = false;
    }
    if (selectedSkill && student.studentSkills?.includes(selectedSkill)) {
      skillMatch = true;
    } else if (selectedSkill && !student.studentSkills?.includes(selectedSkill)) {
      skillMatch = false;
    }
    return departmentMatch && cgpMatch && skillMatch;
  });
  return (
    <div className='students-jobs-list'>
      <h2 style={{ textAlign: 'center' }}>
        Students Applied for Job
        <div className='btn-parent'>
          <button className='btn-excel' onClick={downloadExcel}>Download Excel</button>
          <button className='resume-download' onClick={downloadResume}>Get the Resumes</button>
          <button onClick={acceptSelectedStudents} className='btn-accept-job-students'>Accept the selected students</button>
        </div>
      </h2>
      <div className='filter-list'>
        <div>
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">All Department</option>
            <option value="CSE">CSE</option>
            <option value="CIS">CIS</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MECH">MECH</option>
            <option value="AIML">AIML</option>
            <option value="AIDS">AIDS</option>
            <option value="CSD">CSD</option>
            <option value="MBA">MBA</option>
            <option value="MTECH CSE">MTECH CSE</option>
            <option value="IoT">IoT</option>
            <option value="BBA">BBA</option>
            <option value="BCA">BCA</option>
            <option value="BSC">BSC</option>
            <option value="MCA">MCA</option>
            <option value="MSC">MSC</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <select
            className='cgpa'
            value={selectedCGPA}
            onChange={(e) => setSelectedCGPA(e.target.value)}
          >
            <option value="">Minimum CGPA</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        {/* Dropdown menu for selecting a skill */}
        <div>
          <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
            <option value="">All Skills</option>
            {jobSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ color: "white" }}>Applied Students   </th>
            <th style={{ color: "white" }}>Selected Students 
            </th>
            <th style={{ color: "white" }}>Rejected Students
            </th>
          </tr>
        </thead>
        <tbody>
          {
            loading ?
              (
                <tr>
                  <td colSpan="3">Loading...</td>
                </tr>
              ) :
              (
                filteredStudents.length > 0 ?
                  (
                    selectedStudents.length > 0 || rejectedStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <tr key={student.student_id}>
                          <td>
                            {student.name}<br />
                            {student.email}
                          </td>
                          <td>{selectedStudents.includes(student.student_id) ? 'Selected' : ''}</td>
                          <td>{rejectedStudents.includes(student.student_id) ? 'Rejected' : ''}</td>
                        </tr>
                      ))
                    ) : null

                  ) : (
                    <tr>
                        {console.log("empty filter")}
                        <td colSpan="3">No students have applied for this job.</td>
                      </tr>
                  )
              )
          }
        </tbody>
      </table>
    </div>
  );

};
export default BDEStudentsAppliedJobsList;


// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import './BDEStudentsAppliedJobsList.css';
// import axios from 'axios';
// import Swal from 'sweetalert2'
// import * as XLSX from 'xlsx';
// const BDEStudentsAppliedJobsList = () => {
//   const { jobId } = useParams();
//   const [appliedStudents, setAppliedStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [jobSkills, setJobSkills] = useState([])
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedCGPA, setSelectedCGPA] = useState('');
//   const [selectedSkill, setSelectedSkill] = useState(''); // State for selected skill filter
//   useEffect(() => {
//     const fetchAppliedStudents = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/getappliedstudentslist?job_id=${jobId}`);
//         console.log(response.data)
//         setAppliedStudents(response.data.students_applied);
//         setJobSkills(response.data.jobSkills)
//         setLoading(false);
//       } catch (error) {
//         setError('Failed to fetch applied students');
//         setLoading(false);
//       }
//     };
//     fetchAppliedStudents();
//   }, [jobId]);
//   const downloadResume = async () => {
//     try {
//       const selectedStudentIds = filteredStudents.map(student => student.student_id);
//       console.log(selectedStudentIds, jobId)
//       const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/downloadresume`, {
//         selected_student_ids: selectedStudentIds
//       }, {
//         responseType: 'blob' // Set responseType to blob
//       });
//       console.log('Selected students accepted:', response.data);
//       const blob = new Blob([response.data]);
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'resumes.zip'); // Set the filename for download
//       document.body.appendChild(link);
//       link.click();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Failed to download resumes:', error);
//     }
//   };
//   const downloadExcel = () => {
//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(appliedStudents);
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
//     XLSX.writeFile(workbook, 'applied_students.xlsx');
//   };

//   const acceptSelectedStudents = async () => {
//     const result = await Swal.fire({
//       title: 'Confirm Acceptance',
//       text: 'Are you sure you want to reject the remaining students?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Accept',
//       cancelButtonText: 'Cancel'
//     });
//     if (result.isConfirmed) {
//       try {
//         const selectedStudentIds = filteredStudents.map(student => student.student_id);
//         console.log(selectedStudentIds, jobId)
//         const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/updatejobapplicants`, {
//           selected_student_ids: selectedStudentIds, job_id: jobId
//         });
//         console.log('Selected students accepted:', response.data);
//         console.log(response)
//         if (response.status === 200) {
//           Swal.fire({
//             title: "Accecpted these selected students",
//             icon: "success"
//           });
//         }
//         // Optionally, you can perform any additional actions after accepting the students, such as updating UI or showing a success message.
//       } catch (error) {
//         console.error('Failed to accept selected students:', error);
//       }
//     }
//   };
//   const filteredStudents = appliedStudents.filter(student => {
//     let departmentMatch = true;
//     let cgpMatch = true;
//     let skillMatch = true;
//     if (selectedDepartment && student.department !== selectedDepartment) {
//       departmentMatch = false;
//     }
//     if (selectedCGPA && parseFloat(student.highestGraduationCGPA) < parseFloat(selectedCGPA)) {
//       cgpMatch = false;
//     }
//     if (selectedSkill && student.studentSkills?.includes(selectedSkill)) {
//       skillMatch = true;
//     } else if (selectedSkill && !student.studentSkills?.includes(selectedSkill)) {
//       skillMatch = false;
//     }
//     return departmentMatch && cgpMatch && skillMatch;
//   });
//   return (
//     <div className='students-jobs-list'>
//       <h2 style={{ textAlign: 'center' }}>
//         Students Applied for Job
//         <div className='btn-parent'>
//           <button className='btn-excel' onClick={downloadExcel}>Download Excel</button>
//           <button className='resume-download' onClick={downloadResume}>Get the Resumes</button>
//           <button onClick={acceptSelectedStudents} className='btn-accept-job-students'>Accept the selected students </button>
//         </div>
//       </h2>
//       <div className='filter-list'>
//         <div>
//           <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
//             <option value="">All Departments</option>
//             <option value="CSE">CSE</option>
//             <option value="IT">IT</option>
//             <option value="EEE">EEE</option>
//             <option value="ECE">ECE</option>
//             <option value="MEC">MEC</option>
//             <option value="EIE">EIE</option>
//             <option value="MSC">MSC</option>
//             <option value="MCA">MCA</option>
//           </select>
//         </div>
//         <div>
//           <select
//             className='cgpa'
//             value={selectedCGPA}
//             onChange={(e) => setSelectedCGPA(e.target.value)}
//           >
//             <option value="">Minimum CGPA</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="4">4</option>
//             <option value="5">5</option>
//             <option value="6">6</option>
//             <option value="7">7</option>
//             <option value="8">8</option>
//             <option value="9">9</option>
//             <option value="10">10</option>
//           </select>
//         </div>
//         {/* Dropdown menu for selecting a skill */}
//         <div>
//           <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)}>
//             <option value="">All Skills</option>
//             {jobSkills.map(skill => (
//               <option key={skill} value={skill}>{skill}</option>
//             ))}
//             {/* Add more options as needed */}
//           </select>
//         </div>
//       </div>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           {filteredStudents.length > 0 ? (
//             <>
//               <ol>
//                 {filteredStudents.map(student => (
//                   <li className='student-jobs-list-card' key={student.student_id}>
//                     <p>Name: {student.name}</p>
//                     <p>Email: {student.email}</p>
//                   </li>
//                 ))}
//               </ol>
//             </>
//           ) : (
//             <p>No students have applied for this job.</p>
//           )}
//         </>
//       )}
//     </div>
//   );
// };
// export default BDEStudentsAppliedJobsList;



// from flask import request
// from flask_restful import Resource
// from pymongo import MongoClient

// class GetAppliedStudentList(Resource):
//     def __init__(self, client, db, job_collection, student_collection):
//         super().__init__()
//         self.client = client
//         self.db_name = db
//         self.job_collection_name = job_collection
//         self.student_collection_name = student_collection
//         self.db = self.client[self.db_name]
//         self.job_collection = self.db[self.job_collection_name]
//         self.student_collection = self.db[self.student_collection_name]

//     def get(self):
//         try:
//             # data = request.get_json()
//             # job_id = data.get('job_id')
//             job_id = request.args.get('job_id')
//             print("job id",job_id)
//             # Check if the database exists, if not, create it
//             if self.db_name not in self.client.list_database_names():
//                 self.client[self.db_name]

//             # Check if the job collection exists, if not, create it
//             if self.job_collection_name not in self.db.list_collection_names():
//                 self.db.create_collection(self.job_collection_name)

//             job_document = self.job_collection.find_one({"id": job_id})
//             print("students applied jobs",job_document)
//             if job_document:
//                 applicants_ids = job_document.get('applicants_ids', [])

//                 student_details = []
//                 for student_id in applicants_ids:
//                     student_document = self.student_collection.find_one({"id": student_id})
//                     if student_document:
//                         student_details.append({
//                             "student_id": student_document.get('id'),
//                             "name": student_document.get('name'),
//                             "email": student_document.get('email'),
//                             "highestGraduationCGPA": student_document.get('highestGraduationCGPA'),
//                             "studentSkills":student_document.get('studentSkills'),
//                             "phone": student_document.get('phone'),
//                             "age": student_document.get('age'),
//                             "state": student_document.get('state'),
//                             "tenthStandard":student_document.get('tenthStandard'),
//                             "twelfthStandard": student_document.get('twelfthStandard'),
//                             "qualification": student_document.get('qualification'),
//                             "yearOfPassing": student_document.get('yearOfPassing'),
//                             "city" : student_document.get('city'),
//                             "department" : student_document.get('department'),
//                             "collegeName": student_document.get('collegeName'),
//                         })
//                 return {"students_applied": student_details,"jobSkills":job_document["jobSkills"]}, 200
//             else:
//                 return {"error": "Job not found with the provided job_id"}, 404

//         except Exception as e:
//             return {"error": str(e)}, 500

// from flask import request
// from flask_restful import Resource
// from pymongo import MongoClient
// import uuid
// from datetime import datetime
// import threading
// import smtplib
// from email.mime.multipart import MIMEMultipart
// from email.mime.text import MIMEText

// class JobEmailSender(threading.Thread):
//     def __init__(self, job_data, student_emails):
//         super().__init__()
//         self.job_data = job_data
//         self.student_emails = student_emails

//     def run(self):
//         # Email sending logic
//         for email in self.student_emails:
//             self.send_email(email, self.job_data)

//     def send_email(self, email, job_data):
//         # Email content in HTML format
//         html_content = f"""
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>New Job Opportunity at {job_data['companyName']}!</title>
//             <!-- CSS styles -->
//             <style>
//                 body {{
//                     font-family: Arial, sans-serif;
//                     margin: 0;
//                     padding: 0;
//                 }}
//                 .container {{
//                     max-width: 600px;
//                     margin: 0 auto;
//                     padding: 20px;
//                     background-color: #f9f9f9;
//                 }}
//                 .content {{
//                     text-align: left;
//                 }}
//                 h1, p {{
//                     margin-bottom: 20px;
//                 }}
//                 .button {{
//                     display: inline-block;
//                     padding: 10px 20px;
//                     background-color: #FFA500;
//                     color: #ffffff;
//                     text-decoration: none;
//                     border-radius: 5px;
//                 }}
//                 @keyframes fadeIn {{
//                     from {{ opacity: 0; }}
//                     to {{ opacity: 1; }}
//                 }}
//                 .fade-in {{
//                     animation: fadeIn 1s ease-in-out;
//                 }}
//             </style>
//         </head>
//         <body>
//             <div class="container fade-in">
//                 <h1>New Job Opportunity at {job_data['companyName']}!</h1>
//                 <p>Dear Student,</p>
//                 <p>We are excited to announce a new job opportunity available at {job_data['companyName']}.</p>
//                 <p>The position of {job_data['jobRole']} is now open for applications.</p>
//                 <p>Location: {job_data['jobLocation']}</p>
//                 <p>CTC: {job_data['salary']}</p>
//                 <p>Deadline to apply: {job_data['deadLine']}</p>
//                 <p>Apply now to seize this opportunity!</p>
//                 <a href="https://placements.codegnan.com" class="button">Apply Now</a>
//             </div>
//         </body>
//         </html>
//         """

//         # Email configuration
//         sender_email = "Placements@codegnan.com"
//         recipient_email = email
//         subject = f"New Job Opportunity at {job_data['companyName']}!"

//         # Create message container
//         msg = MIMEMultipart('alternative')
//         msg['From'] = sender_email
//         msg['To'] = recipient_email
//         msg['Subject'] = subject

//         # Attach HTML content to the email
//         msg.attach(MIMEText(html_content, 'html'))

//         # Send email using SMTP (for Gmail)
//         smtp_server = smtplib.SMTP('smtp.gmail.com', 587)  # Update SMTP server details for Gmail
//         smtp_server.starttls()
//         smtp_server.login(sender_email, 'Codegnan@0818')  # Update sender's email and password
//         smtp_server.sendmail(sender_email, recipient_email, msg.as_string())
//         smtp_server.quit()

// class JobPosting(Resource):
//     def __init__(self, client, db, collection, student_collection):
//         super().__init__()
//         self.client = client
//         self.db_name = db
//         self.collection_name = collection
//         self.student_collection_name = student_collection
//         self.db = self.client[self.db_name]
//         self.collection = self.db[self.collection_name]
//         self.student_collection = self.db[self.student_collection_name]

//     def post(self):
//         # Extract data from the request
//         data = request.get_json()
//         id = str(uuid.uuid4())
//         timestamp = datetime.now().isoformat()
//         companyName = data.get('companyName')
//         jobRole = data.get('jobRole')
//         graduates = data.get('graduates')
//         salary = data.get('salary')
//         educationQualification = data.get('educationQualification')
//         department = data.get('department')
//         percentage = data.get('percentage')
//         technologies = data.get('technologies')
//         bond = data.get('bond')
//         jobLocation = data.get('jobLocation')
//         specialNote = data.get("specialNote")
//         deadLine = data.get("deadLine")
//         jobSkills = data.get("selectedSkills", [])

//         # Insert job posting data into MongoDB
//         if self.db_name not in self.client.list_database_names():
//             self.client[self.db_name]

//         if self.collection_name not in self.db.list_collection_names():
//             self.db.create_collection(self.collection_name)

//         job_data = {
//             "id": id,
//             "timestamp": timestamp,
//             "companyName": companyName,
//             "jobRole": jobRole,
//             "graduates": graduates,
//             "salary": salary,
//             "educationQualification": educationQualification,
//             "department": department,
//             "percentage": percentage,
//             "technologies": technologies,
//             "bond": bond,
//             "jobLocation": jobLocation,
//             "specialNote": specialNote,
//             "deadLine": deadLine,
//             "jobSkills":jobSkills
//         }
//         result = self.collection.insert_one(job_data)
//         job_data['_id'] = str(result.inserted_id)

//         # Fetch only email addresses from student documents
//         student_emails_cursor = self.student_collection.find({}, {"email": 1})
//         student_emails = [student["email"] for student in student_emails_cursor]

//         # Start a thread to send emails in the background
//         email_sender_thread = JobEmailSender(job_data, student_emails)
//         email_sender_thread.start()

//         return {"message": "Job posting successful", "job_posting": job_data}, 200





//         from flask import request
//         from flask_restful import Resource
//         from pymongo import MongoClient
//         import uuid
//         from datetime import datetime
//         import threading
//         import smtplib
//         from email.mime.multipart import MIMEMultipart
//         from email.mime.text import MIMEText
        
//         class JobEmailSender(threading.Thread):
//             def __init__(self, job_data, student_emails):
//                 super().__init__()
//                 self.job_data = job_data
//                 self.student_emails = student_emails
        
//             def run(self):
//                 # Email sending logic
//                 for email in self.student_emails:
//                     self.send_email(email, self.job_data)
        
//             def send_email(self, email, job_data):
//                 # Email content in HTML format
//                 html_content = f"""
//                 <!DOCTYPE html>
//                 <html lang="en">
//                 <head>
//                     <meta charset="UTF-8">
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                     <title>New Job Opportunity at {job_data['companyName']}!</title>
//                     <!-- CSS styles -->
//                     <style>
//                         body {{
//                             font-family: Arial, sans-serif;
//                             margin: 0;
//                             padding: 0;
//                         }}
//                         .container {{
//                             max-width: 600px;
//                             margin: 0 auto;
//                             padding: 20px;
//                             background-color: #f9f9f9;
//                         }}
//                         .content {{
//                             text-align: left;
//                         }}
//                         h1, p {{
//                             margin-bottom: 20px;
//                         }}
//                         .button {{
//                             display: inline-block;
//                             padding: 10px 20px;
//                             background-color: #FFA500;
//                             color: #ffffff;
//                             text-decoration: none;
//                             border-radius: 5px;
//                         }}
//                         @keyframes fadeIn {{
//                             from {{ opacity: 0; }}
//                             to {{ opacity: 1; }}
//                         }}
//                         .fade-in {{
//                             animation: fadeIn 1s ease-in-out;
//                         }}
//                     </style>
//                 </head>
//                 <body>
//                     <div class="container fade-in">
//                         <h1>New Job Opportunity at {job_data['companyName']}!</h1>
//                         <p>Dear Student,</p>
//                         <p>We are excited to announce a new job opportunity available at {job_data['companyName']}.</p>
//                         <p>The position of {job_data['jobRole']} is now open for applications.</p>
//                         <p>Location: {job_data['jobLocation']}</p>
//                         <p>CTC: {job_data['salary']}</p>
//                         <p>Deadline to apply: {job_data['deadLine']}</p>
//                         <p>Apply now to seize this opportunity!</p>
//                         <a href="https://placements.codegnan.com" class="button">Apply Now</a>
//                     </div>
//                 </body>
//                 </html>
//                 """
        
//                 # Email configuration
//                 sender_email = "Placements@codegnan.com"
//                 recipient_email = email
//                 subject = f"New Job Opportunity at {job_data['companyName']}!"
        
//                 # Create message container
//                 msg = MIMEMultipart('alternative')
//                 msg['From'] = sender_email
//                 msg['To'] = recipient_email
//                 msg['Subject'] = subject
        
//                 # Attach HTML content to the email
//                 msg.attach(MIMEText(html_content, 'html'))
        
//                 # Send email using SMTP (for Gmail)
//                 smtp_server = smtplib.SMTP('smtp.gmail.com', 587)  # Update SMTP server details for Gmail
//                 smtp_server.starttls()
//                 smtp_server.login(sender_email, 'Codegnan@0818')  # Update sender's email and password
//                 smtp_server.sendmail(sender_email, recipient_email, msg.as_string())
//                 smtp_server.quit()
        
//         class JobPosting(Resource):
//             def __init__(self, client, db, collection, student_collection):
//                 super().__init__()
//                 self.client = client
//                 self.db_name = db
//                 self.collection_name = collection
//                 self.student_collection_name = student_collection
//                 self.db = self.client[self.db_name]
//                 self.collection = self.db[self.collection_name]
//                 self.student_collection = self.db[self.student_collection_name]
        
//             def post(self):
//                 # Extract data from the request
//                 data = request.get_json()
//                 id = str(uuid.uuid4())
//                 timestamp = datetime.now().isoformat()
//                 companyName = data.get('companyName')
//                 jobRole = data.get('jobRole')
//                 graduates = data.get('graduates')
//                 salary = data.get('salary')
//                 educationQualification = data.get('educationQualification')
//                 department = data.get('department')
//                 percentage = data.get('percentage')
//                 technologies = data.get('technologies')
//                 bond = data.get('bond')
//                 jobLocation = data.get('jobLocation')
//                 specialNote = data.get("specialNote")
//                 deadLine = data.get("deadLine")
//                 jobSkills = data.get("selectedSkills", [])
        
//                 # Insert job posting data into MongoDB
//                 if self.db_name not in self.client.list_database_names():
//                     self.client[self.db_name]
        
//                 if self.collection_name not in self.db.list_collection_names():
//                     self.db.create_collection(self.collection_name)
        
//                 job_data = {
//                     "id": id,
//                     "timestamp": timestamp,
//                     "companyName": companyName,
//                     "jobRole": jobRole,
//                     "graduates": graduates,
//                     "salary": salary,
//                     "educationQualification": educationQualification,
//                     "department": department,
//                     "percentage": percentage,
//                     "technologies": technologies,
//                     "bond": bond,
//                     "jobLocation": jobLocation,
//                     "specialNote": specialNote,
//                     "deadLine": deadLine,
//                     "jobSkills":jobSkills
//                 }
//                 result = self.collection.insert_one(job_data)
//                 job_data['_id'] = str(result.inserted_id)
        
//                 # Fetch only email addresses from student documents
//                 student_emails_cursor = self.student_collection.find({}, {"email": 1})
//                 student_emails = [student["email"] for student in student_emails_cursor]
        
//                 # Start a thread to send emails in the background
//                 email_sender_thread = JobEmailSender(job_data, student_emails)
//                 email_sender_thread.start()
        
//                 return {"message": "Job posting successful", "job_posting": job_data}, 200
        