import React, { useState } from 'react';
import axios from 'axios'
import Swal from 'sweetalert2'
import './StudentSignup.css';
import { useNavigate } from 'react-router-dom';

const StudentSignup = () => {
    const navigate = useNavigate()
    // eslint-disable-next-line
    const [buttonClicked, setButtonClicked] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        mobileNumber: '',
        collegeUSNNumber: '',
        githubLink: '',
        arrears: null,
        qualification: '',
        department: '',
        password: '',
        cpassword: '',
        state: "",
        cityname: "",
        yearOfPassing: '',
        collegeName: '',
        tenthStandard: '',
        twelfthStandard: '',
        profilePic: '',
        resume: null,
        highestGraduationCGPA: 0,
    });
    const [age, setAge] = useState('');
    const handleAgeChange = (e) => {
        const selectedDate = e.target.value;
        const calculatedAge = calculateAge(selectedDate);
        console.log(calculatedAge)
        setAge(calculatedAge);
        setFormData({ ...formData, age: selectedDate });
    };
    const calculateAge = (selectedDate) => {
        const dob = new Date(selectedDate);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        const hasBirthdayOccuredThisYear = today.getMonth() > dob.getMonth() ||
            (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
        if (dob.getMonth() === 1 && dob.getDate() === 29) {
            const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
            const birthYear = dob.getFullYear();
            const currentYear = today.getFullYear();
            if (isLeapYear(birthYear) && hasBirthdayOccuredThisYear && !isLeapYear(currentYear)) {
                age--; // Subtract one year if the birthday hasn't occurred in a non-leap year
            }
        }
        return age;
    };
    // eslint-disable-next-line
    const [skills, setSkills] = useState(['HTML', 'CSS', 'JavaScript', 'Python', 'Java', 'NodeJS', 'Reactjs', 'Angular', 'Vuejs', 'ML', 'Django', 'Spring Boot', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'TypeScript', 'Go', 'Rust', 'Kotlin', 'SQL', 'Shell Scripting', 'VB.NET', 'MATLAB', 'R', 'AWS', 'DevOps']);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [currentSkill, setCurrentSkill] = useState('');

    const addSkill = () => {
        if (currentSkill && !selectedSkills.includes(currentSkill)) {
            setSelectedSkills([...selectedSkills, currentSkill]);
            setCurrentSkill('')
        }
    };
    const removeSkill = (skill) => {
        const updatedSkills = selectedSkills.filter(item => item !== skill);
        setSelectedSkills(updatedSkills);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const fieldName = e.target.name;
        const file = e.target.files[0];
    
        let validTypes = [];
    
        if (fieldName === 'resume') {
            validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        } else if (fieldName === 'profilePic') {
            validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        }
    
        if (file && validTypes.includes(file.type)) {
            setFormData({
                ...formData,
                [fieldName]: file,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File Type',
                text: fieldName === 'resume' ? 'Please upload a PDF or Word document.' : 'Please upload an image file (JPEG, PNG, GIF).',
            });
            e.target.value = ''; 
        }
    };
    


    const handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Signing up...',
            text: 'Please wait while we process your registration',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        // Handle form submission
        console.log(formData, formData.age)
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        const graduationRegex = /^\d*\.?\d*$/
        if (!passwordRegex.test(formData.password)) {
            alert('Password must contain at least one uppercase letter, one lowercase letter, and one digit, and be at least 6 characters long');
            return false;
        }
        if (selectedSkills.length === 0) {
            alert("select atleast one skill")
        }

        if (formData.password !== formData.cpassword) {
            alert('Password and Confirm Password do not match');
            return false;
        }
        if (!graduationRegex.test(formData.highestGraduationCGPA)) {
            alert("Highest graduation must be a number");
            return false
        }
        console.log("signup form \n", formData, selectedSkills, "\n\n")
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/signup`, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            cityName: formData.city,
            department: formData.department,
            yearOfPassing: formData.yearOfPassing,
            state: formData.state,
            collegeName: formData.collegeName,
            qualification: formData.qualification,
            mobileNumber: Number(formData.mobileNumber),
            age: Number(age),
            collegeUSNNumber: formData.collegeUSNNumber,
            githubLink: formData.githubLink,
            arrears: formData.arrears,
            resume: formData.resume,
            profilePic: formData.profilePic,
            tenthStandard: Number(formData.tenthStandard),
            twelfthStandard: Number(formData.twelfthStandard),
            highestGraduationCGPA: Number(formData.highestGraduationCGPA),
            studentSkills: selectedSkills // Include skills field
        }, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then((response) => {
                console.log("", response.data)
                console.log("student signup ", response.data)
                Swal.fire({
                    title: "Signup Successful!",
                    icon: "success"
                });
                navigate("/login/student")
            })
            .catch((error) => {
                console.log("error from student signup", error)
                if (error.response.status === 409) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Email already exists",
                    });
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Unable to make signup",
                    });
                }
            })
        //console.log(formData);

    };
    return (
        <div className='student-signup-container'>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="input-group">
                    <div className="form-group">
                        <label>Name <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="name"
                            placeholder='Ex:Siva Ram'
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="email"
                            name="email"
                            placeholder='Ex:sivaram@gmail.com'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <div className="form-group">
                        <label>Password <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="password"
                            name="password"
                            placeholder='Ex:Ram@123'
                            value={formData.passowrd}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="password"
                            name="cpassword"
                            placeholder='Ex:Ram@123'
                            value={formData.cpassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <div className="form-group">
                        <label>WhatsApp Number <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number"
                            name="mobileNumber"
                            placeholder='Ex:9999997654'
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Highest Qualification <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="qualification"
                            placeholder='Ex:Btech'
                            value={formData.qualification}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <div className="form-group">
                        <label>College USN/ID Number <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="collegeUSNNumber"
                            placeholder='Ex:100002108F00'
                            value={formData.collegeUSNNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Github Link <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="githubLink"
                            placeholder='Ex:https://github.com/ram-saddist.com'
                            value={formData.githubLink}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <div className="form-group">
                        <label>City Name <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="cityname"
                            placeholder='Ex:Vijayawada'
                            value={formData.cityname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>You are from which State <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="state"
                            placeholder='Ex:AndhraPradesh'
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <div className="form-group">
                        <label>Department <span style={{ color: 'red' }}>*</span></label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}

                        >
                            <option value="">Select Department <span style={{ color: 'red' }}>*</span></option>
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
                    </div>
                    <div className="form-group">
                        <label>Highest Qualification Year of Passing <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="yearOfPassing"
                            placeholder='Ex:2019'
                            value={formData.yearOfPassing}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <div className="form-group">
                        <label>10th Percentage <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number"
                            name="tenthStandard"
                            placeholder='Ex:92'
                            value={formData.tenthStandard}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>12th Percentage <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number"
                            name="twelfthStandard"
                            placeholder='Ex:92'
                            value={formData.twelfthStandard}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <div className="form-group">
                        <label>College Name <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="text"
                            name="collegeName"
                            placeholder='Ex:Codegnan'
                            value={formData.collegeName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>CGPA(UnderGraduate) <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number"
                            name="highestGraduationCGPA"
                            placeholder='Ex:9.2'
                            value={formData.highestGraduationCGPA}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="input-group">
                    <div className="form-group">
                        <label>Profile Picture <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="file"
                            name="profilePic"
                            accept=".jpg,.jpeg,.png,.gif"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Resume (doc,pdf,docx) <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                </div>
                {/* sill set*/}
                <div className="input-group">
                    <div className="form-group">
                        <label>Date of birth <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="date"
                            name="age"
                            placeholder='Ex:Enter your age'
                            value={formData.age}
                            onChange={handleAgeChange}
                            required
                        />
                        {/* Display calculated age */}
                        {age && (
                            <p>Your age: {age} years</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="skills">Skills: <span style={{ color: 'red' }}>*</span></label>
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
                        </select>

                        <button type="button" className='add-skill' onClick={addSkill}>
                            Add Skill
                        </button>
                        <div className='selected-skills'>
                            {selectedSkills.map((skill, index) => (
                                <p key={index}>
                                    <span style={{ color: 'black' }}>{skill}</span>
                                    <button className='remove-skill' type='button' onClick={() => removeSkill(skill)}>X</button>
                                </p>
                            ))}
                        </div>
                    </div>

                </div>
                <div className="input-group">
                    <div className="form-group">
                        <label>Arrears <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="number"
                            name="arrears"
                            placeholder='Ex:0'
                            value={formData.arrears}
                            onChange={handleChange}
                            required
                        />
                    </div>

                </div>
                <button onClick={() => { console.log(age) }} disabled={buttonClicked} className='btn'>Signup Now</button>
            </form>
        </div>
    );
};

export default StudentSignup;
