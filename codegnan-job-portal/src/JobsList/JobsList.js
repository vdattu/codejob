import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobsList.css';
import Swal from 'sweetalert2'
const JobsList = () => {
    // State variables to store job details
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const student_id = localStorage.getItem("student_id");
    const [studentDetails, setStudentDetails] = useState(null); // Initialize studentDetails with applied_jobs as an empty array
    console.log(studentDetails)
    // Function to fetch job details from the backend API
    const fetchJobs = async () => {
        try {
            const studentResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/getstudentdetails?student_id=${student_id}`);
            setStudentDetails(studentResponse.data)
            // Fetch job details
            const jobResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/listopenings`);
            setJobs(jobResponse.data.jobs);
            setLoading(false);
            // let studentDetails; // Retrieve student details here
        } catch (error) {
            setError('Failed to fetch job details');
            setLoading(false);
        }
    };
    // Fetch job details when the component mounts
    useEffect(() => {
        fetchJobs();
        // eslint-disable-next-line 
    }, []);
    function applyJob(job_id) {
        const job = jobs.find(job => job.job_id === job_id);
        if (job.isActive) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/applyforjob`, { job_id, student_id })
                .then((response) => {
                    if (response.status === 200){
                        Swal.fire({
                            icon: "success",
                            title: "Job Applied Successfully",
                            showConfirmButton: false,
                            timer: 3000
                        });
                        fetchJobs();
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
        else {
            Swal.fire({
                icon: "error",
                title: "This job is not active. You cannot apply.",
            });
        }
    }
    return (
        <div>
            {console.log("studentdetails",studentDetails)}
            {console.log("job details",jobs)}
            <h2 style={{ color: "black", textAlign: "center" }}>Student Dashboard</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {jobs.length > 0 && (
                <div className="job-list-container">
                    {jobs.map(job => (
                        <div key={job.job_id} className="job-list-card">
                            <h3>{job.companyName}</h3>
                            <p><span className="job-list-key">Job Role:</span> {job.jobRole}</p>
                            <p><span className="job-list-key">Salary:</span> {job.salary}</p>
                            <p><span className="job-list-key">Graduate:</span> {job.graduates.join(', ')}</p>
                            <p><span className="job-list-key">Education Qualification:</span> {job.educationQualification}</p>
                            <p><span className="job-list-key">Branch/Stream:</span> {job.department.join(', ')}</p>
                            <p><span className="job-list-key">Percentage Criteria:</span> {job.percentage}%</p>
                            <p><span className="job-list-key">Eligible Technologies:</span> {job.technologies.join(', ')}</p>
                            <p><span className="job-list-key">Bond:</span> {job.bond} years</p>
                            <p><span className="job-list-key">Job Location:</span> {job.jobLocation}</p>
                            <p><span className="job-list-key">Special Note:</span> {job.specialNote}</p>
                            <button className={`apply-job-list-btn ${!job.isActive ? 'disabled' : ((studentDetails && studentDetails.applied_jobs && studentDetails.applied_jobs.includes(job.job_id)) ? 'applied' : '')}`} onClick={() => applyJob(job.job_id)} disabled={!job.isActive}>
                                {(!job.isActive) ? 'Timeout' : ((studentDetails && studentDetails.applied_jobs && studentDetails.applied_jobs.includes(job.job_id)) ? 'Applied' : 'Apply')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default JobsList;
