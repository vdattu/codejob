import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './Home.css';
import placement from '../images/placement.png';
import noOfStudents from '../images/no_of_students.png'
import averagePackage from '../images/average_package.png'
import highestPackage from '../images/highest_package.png'
import drives from '../images/drives.png'
import CompanyDashboard from './CompanyDashboard';
import BranchDashboard from './BranchDashboard';
import CollegeDashboard from './CollegeDashboard'; // Import the CollegeDashboard component

export default function Home() {
  
   const dashboardData = {
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
       "ECE": 50,
       "CS": 23,
       "MCA": 20
     }
   };
   /*
   const [dashboardData, setDashboardData] = useState({})
  useEffect(() => {
    // Fetch dashboard data from the backend API
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/refreshdashboard`);
        setDashboardData(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);*/
  

  const companiesData = dashboardData.COMPANIES;
  const branchList = dashboardData.BRANCH_LIST;
  const collegesList = dashboardData.COLLEGES_LIST; // Get the colleges list data

  return (
    <div style={{ width: '100%' }}>
      {/* Display cover image */}
      <div className='coverpage-container'>
        <p>
          <span className='title'>
            <span style={{ color: "#c36" }}>100% </span>
            Placement Assistance</span><br />
          <span className='tag-line'>until you get placed</span>
        </p>
        <img src={placement} alt='coverpage-image' />
      </div>
      <div className="home-cards-container">
        <StudentComponent />
        <HighestSalaryComponent />
        <DrivesComponent />
        <AverageSalaryComponent />
      </div>
      
      <CompanyDashboard companiesData={companiesData} />
      <BranchDashboard branchList={branchList} />
      <CollegeDashboard collegesList={collegesList} />
     
    </div>
  );
}

const StudentComponent = () => {
  const [count, setCount] = useState(0);
  const targetNumber = 2170;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => (prevCount >= targetNumber ? prevCount : prevCount + 1));
    }, 2);

    return () => clearInterval(interval);
  }, [targetNumber]);

  return (
    <div className="home-card">
      <img src={noOfStudents} alt='noofstudents'/>
      <h1 className="home-card-title">{count}</h1>
      <p className="home-card-text">Total No. Of Students Till Date</p>
    </div>
  );
};

const DrivesComponent = () => {
  const [count, setCount] = useState(0);
  const targetNumber = 889;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => (prevCount >= targetNumber ? prevCount : prevCount + 1));
    }, 2);

    return () => clearInterval(interval);
  }, [targetNumber]);

  return (
    <div className="home-card">
       <img src={drives} alt='noofstudents'/>
      <h1 className="home-card-title">{count} Drives</h1>
      <p className="home-card-text">Total No. Of Drives Conducted</p>
    </div>
  );
};

const AverageSalaryComponent = () => {
  const [count, setCount] = useState(0);
  const targetNumber = 5; // adjusted for LPA

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => (prevCount >= targetNumber ? prevCount : prevCount + 1));
    }, 600);

    return () => clearInterval(interval);
  }, [targetNumber]);

  return (
    <div className="home-card">
       <img src={averagePackage} alt='noofstudents'/>
      <h1 className="home-card-title">{count} LPA</h1>
      <p className="home-card-text">Average Salary Package</p>
    </div>
  );
};

const HighestSalaryComponent = () => {
  const [count, setCount] = useState(0);
  const targetNumber = 18.3; // adjusted for LPA

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => {
        const nextCount = parseFloat((prevCount + 0.1).toFixed(1));
        return nextCount >= targetNumber ? prevCount : nextCount;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [targetNumber]);

  return (
    <div className="home-card">
       <img src={highestPackage} alt='noofstudents'/>
      <h1 className="home-card-title">{count} LPA</h1>
      <p className="home-card-text">Highest Salary Package</p>
    </div>
  );
};