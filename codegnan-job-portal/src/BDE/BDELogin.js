import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BDE.css';
import axios from 'axios';

export default function BDELogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setUsernameError('');
    setPasswordError('');
    setError('');

    try {
      console.log("try block")
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/bdelogin`, { username, password });
      console.log("response from bdelogin", response.data);
      localStorage.setItem("userType", response.data.userType);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1 style={{ color: "black" }}>BDE Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email address</label>
          <input
            type="email" required
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
          <Link style={{ fontWeight: "bold" }} to="/bdesignup">Signup Here</Link>        
      </div>
    </div>
  );
}
