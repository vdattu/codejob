import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentProfile.css';

export default function StudentProfile() {
  const [studentDetails, setStudentDetails] = useState(null);
  const student_id = localStorage.getItem("student_id");

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/getstudentdetails?student_id=${student_id}`);
        console.log("profile component",response.data)
        setStudentDetails(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchStudentDetails();
  }, [student_id]);

  return (
    <div className='studentprofile-main'>
      {/* Display student details here */}
    </div>
  );
}
