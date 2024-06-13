import React, { useEffect, useState } from 'react';
import './EmailApplyJob.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EmailApplyJob() {
    const { job_id, student_id } = useParams();
    const [job, setJob] = useState(null);
    useEffect(() => {
        alert("useeffect")
        // Define a function to fetch job details
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/getjobdetails?job_id=${job_id}`);
                console.log("fetchjobdetails",response)
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch job details. Please try again later.',
                });
            }
        };
        fetchJobDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log(job_id, student_id);
    async function applyJob() {
        console.log("apply job ")
       await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/applyforjob`, { job_id, student_id })
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
    return (
        <div className='email-apply-job'>
            
            {console.log("job details ",job)}
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
                <button  className="apply-job-list-btn">Apply</button>
            </div>
        </div>
    );
}


            <div className="email-apply-job-card">
                <h3>{jobDetails.companyName}</h3>
                <p><span className="email-apply-job-key">Job Role:</span> {jobDetails.jobRole}</p>
                <p><span className="email-apply-job-key">Salary:</span> {jobDetails.salary}</p>
                <p><span className="email-apply-job-key">Graduate:</span> {jobDetails.graduates}</p>
                <p><span className="email-apply-job-key">Education Qualification:</span> {jobDetails.educationQualification}</p>
                <p><span className="email-apply-job-key">Department:</span> {jobDetails.department}</p>
                <p><span className="email-apply-job-key">Percentage Criteria:</span> {jobDetails.percentage}</p>
                <p><span className="email-apply-job-key">Eligible Technologies:</span> {jobDetails.technologies}</p>
                <p><span className="email-apply-job-key">Bond:</span> {jobDetails.bond}</p>
                <p><span className="email-apply-job-key">Job Location:</span> {jobDetails.jobLocation}</p>
                <p><span className="email-apply-job-key">Special Note:</span> {jobDetails.specialNote}</p>
                <button  className="apply-job-list-btn">Apply</button>
            </div>