import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; 
import logo from '../Images/Logo.svg';
import hidepassword from '../Images/hide-password.svg'

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { email: '', password: '' };

    if (!email) {
      valid = false;
      newErrors.email = 'Email is required';
    }

    if (!password) {
      valid = false;
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    if (valid) {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email: email,
        Pass: password
      });

      console.log("email and pass:",email,password)
      if (response.data.Success === 'true') {
        localStorage.setItem('token', response.data.Token);
        navigate('/dashboard');
      } else {
        setErrorMessage(response.data.Message);
      }
    } catch (error) {
      setErrorMessage('Invalid credentials');
    }
  };
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (errors.password) {
      setErrors(prevErrors => ({ ...prevErrors, password: '' }));
    }
  };


  return (
    
    <div className="login-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
          <h2 className="logo-title">Online Project Management</h2>
        
      <div className="login-card">
      
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Login to get started</h2>
            <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={handleEmailChange} 
            className={`input ${errors.email ? 'input-error' : ''}`} 
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group password-field">
          <label>Password</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={handlePasswordChange} 
            className={`input ${errors.password ? 'input-error' : ''}`} 
          />
          <img 
            src={showPassword ? hidepassword : hidepassword} 
            alt="Toggle Password Visibility" 
            className="eye-icon" 
            onClick={() => setShowPassword(!showPassword)} 
            style={{ cursor: 'pointer' }} 
          />
          {errors.password && <span className="error-message">{errors.password} </span>}
          <a href="#" className='forgot-password'>Forgot password?</a>
        </div>
        
        
        <button type="submit" className="login-button">Login</button>
        
      </form>
          </div>
        </div>
      </div>
      { <span className="invalid-message">{errorMessage}</span>}
      </div>
    </div>
  );
}

export default LoginPage;
