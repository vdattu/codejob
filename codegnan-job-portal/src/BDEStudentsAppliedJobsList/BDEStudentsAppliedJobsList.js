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
  const [resumeName,setResumeName]=useState('')
  const [excelName,setExcelName]=useState('')
  const [jobSkills, setJobSkills] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCGPA, setSelectedCGPA] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [rejectedStudents, setRejectedStudents] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const fetchAppliedStudents = async () => {
    try {
      console.log(jobId)
      const resumeNameResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/getjobdetails?job_id=${jobId}`);
      const { companyName, jobRole } = resumeNameResponse.data;
      
      setExcelName(`${companyName}_${jobRole}`)
      setResumeName(`resumes_${companyName}_${jobRole}`)
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
  useEffect(() => {
    fetchAppliedStudents();
    // eslint-disable-next-line
  }, [jobId]);

  const downloadResume = async () => {
    try {
      const selectedStudentIds = filteredStudents.map(student => student.student_id);
      console.log(selectedStudentIds, jobId);
      const loadingSwal = Swal.fire({
        title: 'Downloading Resumes',
        html: 'Please wait...',
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        }
      });
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/downloadresume`, {
        student_ids: selectedStudentIds
      }, {
        responseType: 'blob' // Set responseType to blob
      });
      console.log('Selected students accepted:', response.data);
      loadingSwal.close();
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeName}.zip`); // Set the filename for download
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
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, `${excelName}.xlsx`);
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
          fetchAppliedStudents()
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
            <th style={{ color: "white" }}>Applied Students  ({filteredStudents.length})</th>
            <th style={{ color: "white" }}>Selected Students 
            ({filteredStudents.length>0?selectedStudents.length:null})</th>
            <th style={{ color: "white" }}>Rejected Students
            ({filteredStudents.length>0?rejectedStudents.length:null})</th>
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
                    selectedStudents.length >=0 || rejectedStudents.length > 0 ? (
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