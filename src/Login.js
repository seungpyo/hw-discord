import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false); // State to track if the user is in sign-up mode
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to track if the user is in forgot password mode
  const [username, setUsername] = useState(''); // State to store the username input
  const [password, setPassword] = useState(''); // State to store the password input
  const [email, setEmail] = useState(''); // State to store the email input
  const [error, setError] = useState(''); // State to store error messages

  // Handle login
  const handleLogin = () => {
    // Placeholder for login validation
    if (username === 'testuser' && password === 'password') {
      onLogin(username); // Call onLogin prop function with username
    } else {
      setError('Incorrect username or password. Please try again.');
    }
  };

  // Handle sign-up
  const handleSignUp = () => {
    // Placeholder for signup validation
    if (username === 'testuser') {
      setError('Username is already taken. Please choose another.');
    } else {
      // Assume success for now
      onLogin(username); // Call onLogin prop function with username
    }
  };

  // Handle password recovery
  const handlePasswordRecovery = () => {
    setError('Password recovery email has been sent to your registered email address.');
  };

  return (
    <div className="login-container">
      <h2>
        {isSignUp
          ? 'Sign Up'
          : isForgotPassword
          ? 'Forgot Password'
          : 'Login'}
      </h2>
      {error && <div className="error-message">{error}</div>}
      {!isForgotPassword && (
        <>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSignUp && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </>
      )}
      {isForgotPassword && (
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}
      <button
        onClick={
          isSignUp
            ? handleSignUp
            : isForgotPassword
            ? handlePasswordRecovery
            : handleLogin
        }
      >
        {isSignUp
          ? 'Sign Up'
          : isForgotPassword
          ? 'Recover Password'
          : 'Login'}
      </button>
      {!isSignUp && !isForgotPassword && (
        <>
          <button onClick={() => setIsSignUp(true)}>Sign Up</button>
          <button onClick={() => setIsForgotPassword(true)}>Forgot Password?</button>
        </>
      )}
      {(isSignUp || isForgotPassword) && (
        <button onClick={() => { setIsSignUp(false); setIsForgotPassword(false); }}>Back to Login</button>
      )}
    </div>
  );
}

export default Login;
