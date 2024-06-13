import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

export default function CompanyLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setUsernameError('');
    setPasswordError('');


    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/companylogin`, { username, password });
      console.log("response from company login", response.data);
     
      if (response.status === 200) {
        localStorage.setItem("userType", response.data.userType);
        localStorage.setItem("student_id", response.data.student_id);
        navigate('/');
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      // handle error
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <h1 style={{ color: "black" }}>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username or email address</label>
          <input
            type="text" required
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password" required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        </div>
        <div className='forgot'>
          <button className="btn">Login</button>
          {/* <Link className='forgot-password'>Forgot password?</Link> */}
        </div>
      </form>
      <div className='bottom-div'>
          <span style={{ color: "black" }}>Don't have an account?</span>
          <Link style={{ fontWeight: "bold" }} to="/signup">Signup Here</Link>        
      </div>

    </div>
  );
}
