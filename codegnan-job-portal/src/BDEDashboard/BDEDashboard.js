import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './BDEDashboard.css'
const BDEDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/listopenings`);
            console.log(response.data)
            setJobs(response.data.jobs);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch job details');
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchJobs();
    }, []);
    return (
        <div>
            <h2 style={{ color: "black", textAlign: "center" }}>BDE Dashboard</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {jobs.length > 0 && (
                <div className="job-container">
                    {jobs.map(job => (
                        <div key={job.job_id} className="job-card">
                            <h3>{job.companyName}</h3>
                            <p><span className="job-key">Job Role:</span> {job.jobRole}</p>
                            <p><span className="job-key">Salary:</span> {job.salary}</p>
                            <p><span className="job-key">Graduate: </span> {job.graduates.join(', ')}</p>
                            <p><span className="job-key">Education Qualification:</span>  {job.educationQualification}</p>
                            <p><span className="job-key">Branch/Stream:</span>  {job.department.join(', ')}</p>
                            <p><span className="job-key">Percentage Criteria:</span>  {job.percentage}%</p>
                            <p><span className="job-key">Eligible Technologies:</span>  {job.technologies.join(', ')}</p>
                            <p><span className="job-key">Job Location:</span>  {job.jobLocation
                            }</p>
                            <p><span className="job-key">Special Note:</span>  {job.specialNote
                            }</p>
                            <p style={{ marginBottom: "5%" }}><span className="job-key">Bond:</span> {job.bond} years</p>
                            <div className='btns'>
                                <Link to={`/bdestudentsappliedjoblist/${job.job_id}`} className='applied-students-list'>Applied Students</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default BDEDashboard;