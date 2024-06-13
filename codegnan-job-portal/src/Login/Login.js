import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [activeLink, setActiveLink] = useState('student');
 

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className='login'>
      <div className="login-link-button">
        <Link
          className={`link ${activeLink === 'student' ? 'active' : ''}`}
          to="student"
          onClick={() => handleLinkClick('student')}
        >
          Student Login
        </Link>
        {/* commenting the login in here need to update in navigation also with /login only */}
        {/* <Link
          className={`link ${activeLink === 'company' ? 'active' : ''}`}
          to="company"
          onClick={() => handleLinkClick('company')}
        >
          Company Login
        </Link> */}
      </div>
      <Outlet />
    </div>
  );
};

export default Login;