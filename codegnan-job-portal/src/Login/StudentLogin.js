import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import './Login.css';
import axios from 'axios';

export default function StudentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/studentlogin`, { username, password });
      console.log("response from studentlogin", response.data);
      if (response.status === 200) {
        localStorage.setItem("userType", response.data.userType);
        localStorage.setItem("student_id", response.data.student_id);
        navigate('/');
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      Swal.fire({
        icon: "error",
        title: "Login failed. User not found",
      });
    }
  };

  return (
    <div className="login-container">
      <h1 style={{ color: "black" }}>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username or email address</label>
          <input
            type="email" required
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
        </div>
        <div>
          <label>Password</label>
          <input
            type="password" required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
         
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
