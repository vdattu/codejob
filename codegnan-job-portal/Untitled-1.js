{/* Display cover image
      {
  "YOP_DICT": {
    "2022.0": 377,
    "2020.0": 363,
    "2021.0": 229,
    "2023.0": 88,
    "2019.0": 25,
    "2024.0": 3,
    "2018.0": 2,
    "NaN": 1
  },
  "COMPANIES": {
    "Mphasis": 292,
    "Bosch Global Technologies Pvt Ltd": 264,
    "Infinite Computers Solutions": 44,
    "Tech Mahindra": 42,
    "Capgemini": 38,
    "Microland": 30,
    "Accenture": 29,
    "TCS": 29,
    "MPHASIS": 26
  },
  "COLLEGES_LIST": {
    "NaN": 138,
    "CIT BANGALORE - CAMBRIDGE INSTITUTE OF TECHNOLOGY - BANGALORE": 21,
    "MVJCE Bengaluru - M.V.Jayaraman College of Engineering - Bengaluru": 18,
    "G Pulliah College of engineering and technology": 14,
    "KS School of Engineering and Management": 13,
    "Don Bosco Institute Of Technology": 12,
    "SVIOT Bangalore - Sai Vidya Institute of Technology - Bangalore": 12,
    "Vemu Institute of technology": 11,
    "R L Jalappa Institute of Technology": 11,
    "KSIT Bangalore - Kammavari Sangha Institute of Technology - Bangalore": 11,
    "PES Institute of Technology and Management": 10
  },
  "BRANCH_LIST": {
    "CSE": 336,
    "NaN": 297,
    "ECE": 269,
    "EEE": 74,
    "ISE": 68,
    "Electronics and Communication Engineering": 50,
    "CS": 23,
    "MCA": 20
  }
}

  /*
  useEffect(() => {
    // Fetch data from the API endpoint when the component mounts
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/refreshdashboard`)
      .then(response => {
        // Store the fetched data in the state
        console.log(response.data)
        setDashboardData(response.data);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
      });
  }, []); // Empty dependency array ensures this effect runs only once, when the component mounts

      
      */}




import React, { useEffect, useState } from 'react';
import './EmailApplyJob.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EmailApplyJob() {
    const { job_id, student_id } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        // Define a function to fetch job details
        const fetchJobDetails = async () => {
            try {
                // Make GET request to fetch job details based on job_id
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/getjobdetails?job_id=${job_id}`);
                console.log(response)
                // Set the job details in the state
                setJob(response.data);
            } catch (error) {
                // Handle error if request fails
                console.error('Error fetching job details:', error);
                // Display error message to the user
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch job details. Please try again later.',
                });
            }
        };

        // Call the fetchJobDetails function when the component mounts
        fetchJobDetails();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [job_id]); // Dependency array to ensure useEffect runs only when job_id changes

    console.log(job_id, student_id);

    return (
        <div className='email-apply-job'>
           <div className="email-apply-job-card">
           <h3>{job.companyName}</h3>
            <p><span className="email-apply-job-key">Job Role:</span> {job.jobRole}</p>
            <p><span className="email-apply-job-key">Salary:</span> {job.salary}</p>
            <p><span className="email-apply-job-key">Graduate:</span> {job.graduates}</p>
            <p><span className="email-apply-job-key">Education Qualification:</span> {job.educationQualification}</p>
            <p><span className="email-apply-job-key">Department:</span> {job.department}</p>
            <p><span className="email-apply-job-key">Percentage Criteria:</span> {job.percentage}</p>
            <p><span className="email-apply-job-key">Eligible Technologies:</span> {job.technologies}</p>
            <p><span className="email-apply-job-key">Bond:</span> {job.bond}</p>
            <p><span className="email-apply-job-key">Job Location:</span> {job.jobLocation}</p>
            <p><span className="email-apply-job-key">Special Note:</span> {job.specialNote}</p>
            <button onClick={applyJob} className="apply-job-list-btn">Apply</button>
           </div>
        </div>
    );
}


function applyJob() {
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/applyforjob`, { job_id, student_id })
        .then((response) => {
            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Job Applied Successfully",
                    showConfirmButton: false,
                    timer: 3000
                });
                window.location.href = "https://www.placements.codegnan.com/"
            }
        })
        .catch((error) => {
            if (error.response.status === 400)
                Swal.fire({
                    icon: "error",
                    title: "Already applied for the job",
                });
        });
}

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


http://localhost:3000/

http://localhost:3000/directapply/dd3bd3c6-b560-4ea8-8e61-c603df28ae09/f0edaac8-b798-4fbc-ac9e-742c3eae2dd3