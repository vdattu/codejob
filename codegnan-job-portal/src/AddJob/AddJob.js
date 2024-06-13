import React, { useState } from 'react'
import axios from 'axios'
import './AddJob.css'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

export default function AddJob() {
    const [companyName, setCompanyName] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [graduates, setGraduates] = useState('');
    const [salary, setSalary] = useState('');
    const [educationQualification, setEducationQualification] = useState('');
    const [department, setDepartment] = useState('');
    const [percentage, setPercentage] = useState('');
    const [bond, setBond] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [deadLine, setDeadLine] = useState('');
    const [specialNote,setSpecialNote]=useState('')
    const [designation,setDesignation]=useState('')
    const [companyNameError, setCompanyNameError] = useState('');
    const [jobRoleError, setJobRoleError] = useState('');
    const [graduatesError, setGraduatesError] = useState('');
    const [salaryError, setSalaryError] = useState('');
    const [educationQualificationError, setEducationQualificationError] = useState('');
    const [departmentError, setDepartmentError] = useState('');
    const [percentageError, setPercentageError] = useState('');
    const [technologiesError, setTechnologiesError] = useState('');
    const [bondError, setBondError] = useState('');
    const [jobLocationError, setJobLocationError] = useState('');
    // eslint-disable-next-line
    const [skills, setSkills] = useState(['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'NodeJS', 'Reactjs', 'Angular', 'Vuejs', 'ML', 'Django', 'Spring Boot', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'SQL', 'Shell Scripting', 'VB.NET', 'MATLAB', 'R', 'AWS', 'DevOps']);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState('');
    const [customSkill, setCustomSkill] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedYears, setSelectedYears] = useState([]);


    // const addSkill = () => {
    //     if (currentSkill && !selectedSkills.includes(currentSkill)) {
    //         setSelectedSkills([...selectedSkills, currentSkill]);
    //     }
    //     setCurrentSkill('')
    // };
    const addSkill = () => {
        let skillToAdd = currentSkill;
        if (currentSkill === 'Other' && customSkill.trim() !== '') {
            skillToAdd = customSkill.trim();
        }
        
        if (skillToAdd && !selectedSkills.includes(skillToAdd)) {
            setSelectedSkills([...selectedSkills, skillToAdd]);
        }
        
        setCurrentSkill('');
        setCustomSkill('');
    };
    const removeSkill = (skill) => {
        const updatedSkills = selectedSkills.filter(item => item !== skill);
        setSelectedSkills(updatedSkills);
    };
    const addDepartment = () => {
        if (department && !selectedDepartments.includes(department)) {
            setSelectedDepartments([...selectedDepartments, department]);
        }
        setDepartment('')
    };

    const removeDepartment = (departmentToRemove) => {
        const updatedDepartments = selectedDepartments.filter(dep => dep !== departmentToRemove);
        setSelectedDepartments(updatedDepartments);
    };

    const addYear = () => {
        if (graduates && !selectedYears.includes(graduates)) {
            setSelectedYears([...selectedYears, graduates]); 
        }
        setGraduates('')
    };

    const removeYear = (yearToRemove) => {
        const updatedYears = selectedYears.filter(year => year !== yearToRemove);
        setSelectedYears(updatedYears);
    };

    const years = Array.from({ length: 10 }, (_, index) => 2015 + index); // Generating years from 2015 to 2024


    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log(selectedSkills, selectedDepartments)
        e.preventDefault();
        let isValid = true;

        if (!companyName) {
            alert('Company name is required');
            isValid = false;
        }

        if (!jobRole || jobRole.length < 3) {
            alert('Job role is required.');
            isValid = false;
        }
        if (selectedYears.length === 0) {
            alert('Graduates field could not be empty.');
            isValid = false;
        }
        if (!salary) {
            alert('Salary field could not be empty.');
            isValid = false;
        }
        if (!educationQualification) {
            alert('Education qualification field could not be empty.');
            isValid = false;
        }
        if (selectedDepartments.length===0) {
            alert('Department could not be empty.');
            isValid = false;
        }
        if (!percentage) {
            alert('Percentage could not be empty');
            isValid = false;
        }
        if (selectedSkills.length===0) {
            alert('Skills field could not be empty.');
            isValid = false;
        }
        if (!bond) {
            alert('Bond field could not be empty.');
            isValid = false;
        }
        if (!jobLocation) {
            alert('Job location field could not be empty.');
            isValid = false;
        } 
        if (!deadLine) {
            alert("Deadline field is required")
            isValid = false
        }
        if (!buttonClicked && isValid) {
            setButtonClicked(true);
            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/postjobs`, {
                    companyName,
                    jobRole,
                    graduates:selectedYears,
                    salary,
                    educationQualification,
                    department: selectedDepartments,
                    percentage,
                    bond,
                    jobLocation,
                    deadLine,
                    specialNote,
                    designation,
                    jobSkills:selectedSkills
                }).then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Job added successfully!",
                            icon: "success"
                        });
                        // Redirect to dashboard or another page
                        navigate('/bdedashboard');
                    }
                })
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: "error",
                    title: "Something went wrong!!!",
                    text: "Please check the fields again"
                });
            } finally {
                setButtonClicked(false); // Re-enable the button after the action completes
            }
        }
    };
    return (
        <div className='apply-job-container'>
            <form onSubmit={handleSubmit}>
                <h2 className='job-page-title'>Job Description</h2>
                <div className="input-group">
                    <div className="form-group">
                        <label>Company Name <span style={{color:'red'}}>*</span></label>
                        <input
                            type="text" required
                            placeholder="Ex:Codegnan"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                        {companyNameError && <p className="error-message">{companyNameError}</p>}
                    </div>
                    <div className="form-group">
                        <label>Job Role <span style={{color:'red'}}>*</span></label>
                        <input
                            type="text" required
                            placeholder="Ex:Full stack developer"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                        />
                        {jobRoleError && <p className="error-message">{jobRoleError}</p>}
                    </div>
                </div>
                <div className='input-group'>
                <div>
                        <label>Education Qualification <span style={{color:'red'}}>*</span></label>
                        <input
                            type="text" required
                            placeholder="Ex:BTECH/MTECH"
                            value={educationQualification}
                            onChange={(e) => setEducationQualification(e.target.value)}
                        />
                        {educationQualificationError && <p className="error-message">{educationQualificationError}</p>}
                    </div>
                   
                    <div>
                        <label>Salary <span style={{color:'red'}}>*</span></label>
                        <input
                            type="text" required
                            placeholder="Ex:4.6LPA"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                        />
                        {salaryError && <p className="error-message">{salaryError}</p>}
                    </div>
                </div>
                <div className="input-group">
                    <div>
                        <label>Bond <span style={{color:'red'}}>*</span></label>
                        <input
                            type="number" required
                            placeholder="Ex:0"
                            value={bond}
                            onChange={(e) => setBond(e.target.value)}
                        />
                        {bondError && <p className="error-message">{bondError}</p>}
                    </div>
                    <div>
                        <label>Location <span style={{color:'red'}}>*</span></label>
                        <input
                            type="text" required
                            placeholder="Ex:Vijayawada"
                            value={jobLocation}
                            onChange={(e) => setJobLocation(e.target.value)}
                        />
                        {jobLocationError && <p className="error-message">{jobLocationError}</p>}
                    </div>
                </div>

                
                <div className="input-group">
                    <div>
                        <label>Academic Percentage <span style={{color:'red'}}>*</span></label>
                        <input
                            type="number" required
                            placeholder="Ex:70"
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                        />
                        {percentageError && <p className="error-message">{percentageError}</p>}
                    </div>
                    <div>
                        <label>Dead Line(yyyy-mm-dd hh:mm) Will be in 24 hours format <span style={{color:'red'}}>*</span></label>
                        <input
                            type="text" required
                            placeholder="Ex:2024-04-16 16:13"
                            value={deadLine}
                            onChange={(e) => setDeadLine(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="input-group">
                <div>
                        <label htmlFor="graduates">Graduated Year <span style={{color:'red'}}>*</span></label>
                        <select
                            id="graduates"
                            value={graduates}
                            onChange={(e) => setGraduates(e.target.value)}
                        >
                            <option value="">Select Graduated Year</option>
                            {years.map((year) => (
                                <option key={year} value={year} disabled={selectedYears.includes(year)}>
                                {year}
                              </option>
                            ))}
                        </select>
                        <button type="button" className='add-skill' onClick={addYear}>
                            Add Year
                        </button>
                        <div className='selected-skills'>
                            {selectedYears.map((year, index) => (
                                <p style={{ color: 'black' }} key={index}>
                                    {year}
                                    <button className='remove-skill'  type="button" onClick={() => removeYear(year)}>X</button>
                                </p>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="departments">Branch/Stream  <span style={{color:'red'}}>*</span></label>
                        <select
                            id="departments"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="">Select Department</option>
                            <option value="CSE">CSE</option>
                            <option value="ISE">ISE</option>
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
                        <button type="button" className='add-skill' onClick={addDepartment}>
                            Add Department
                        </button>
                        <div className='selected-skills'>
                            {selectedDepartments.map((dep, index) => (
                                <p style={{ color: 'black' }} key={index}>
                                    {dep}
                                    <button type="button" className='remove-skill' onClick={() => removeDepartment(dep)}>X</button>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="input-group">
                    <div>
                        <label>Designation</label>
                        <input
                            type="text" 
                            placeholder="Ex:HR"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />  
                    </div>
                    <div>
                        <label>Special Note<span style={{color:'red'}}>*</span></label>
                        <input
                            type="text" required
                            placeholder="Ex:Immediate recruitment"
                            value={specialNote}
                            onChange={(e) => setSpecialNote(e.target.value)}
                        />  
                    </div>
                </div>
                <div className="input-group">
                    <div>
                        <label htmlFor="skills">Skills  <span style={{color:'red'}}>*</span></label>
                        <select
                            id="skills"
                            name="skills"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                        >
                            <option value="">Select a skill</option>
                            {skills.map((skill, index) => (
                                <option key={index} value={skill}>{skill}</option>
                            ))}
                            <option value="Other">Other</option>
                        </select>
                        {currentSkill === 'Other' && (
                <input
                    type="text"
                    placeholder="Enter custom skill"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                />
            )}
                        {technologiesError && <p className="error-message">{technologiesError}</p>}
                        <button type="button" className='add-skill' onClick={addSkill}>
                            Add Skill
                        </button>
                        <div className='selected-skills'>
                            {selectedSkills.map((skill, index) => (
                                <p style={{ color: 'black' }} key={index}>
                                    {skill}
                                    <button className='remove-skill' type='button' onClick={() => removeSkill(skill)}>X</button>
                                </p>
                            ))}
                        </div>
                    </div> 
                </div>
                <button disabled={buttonClicked} className="btn">Add Job</button>
            </form>
        </div>
    )
}

