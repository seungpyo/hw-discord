import React, { useEffect, useState } from "react";
import "./Login.css";
import { Token, User } from "./types";
import { v4 } from "uuid";

export interface LoginScreenProps {
  onLogin: ({ user, token }: { user: User; token: Token }) => void;
}

const Login = ({ onLogin }: LoginScreenProps) => {
  const [isSignUp, setIsSignUp] = useState(false); // State to track if the user is in sign-up mode
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to track if the user is in forgot password mode
  const [username, setUsername] = useState(""); // State to store the username input
  const [password, setPassword] = useState(""); // State to store the password input
  const [email, setEmail] = useState(""); // State to store the email input
  const [error, setError] = useState(""); // State to store error messages
  const [serverGreetings, setServerGreetings] = useState(""); // State to store server greetings
  const [isReset, setIsReset] = useState(false); // State to reset password

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      setError("Invalid username or password");
      return;
    }
    const token: Token = await res.json();
    const userRes = await fetch(
      `http://localhost:3001/api/users/${token.userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token.id}` },
      }
    );
    const user = await userRes.json();
    onLogin({ user, token });
  };

  // Handle sign-up
  const handleSignUp = async () => {
    const newUser: User = {
      id: v4(),
      name: username,
      email,
      password,
      isMuted: false,
      isVideoOn: false,
      isSelf: false,
    };
    const res = await fetch("http://localhost:3001/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    if (!res.ok) {
      console.log("Error signing up");
      setError("Error signing up: " + (await res.text()));
      return;
    }
  };

  // Handle password recovery
  const handlePasswordRecovery = async () => {
    const res = await fetch("http://localhost:3001/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email }),
    });
    setError(
      "Password recovery email has been sent to your registered email address."
    );
    setIsReset(true);
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    const res = await fetch("http://localhost:3001/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password }),
    });
  }

  return (
    <div className="login-container">
      {serverGreetings}
      <h2>
        {isSignUp ? "Sign Up" : isForgotPassword ? "Forgot Password" : "Login"}
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
      {isForgotPassword && isReset && (
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}
      <button
        onClick={(e) => {
          (isSignUp
            ? async () => {
                await handleSignUp();
                setIsSignUp(false);
              }
            : isForgotPassword
            ? isReset ? handlePasswordReset : handlePasswordRecovery
            : handleLogin)();
        }}
      >
        {isSignUp ? "Sign Up" : isForgotPassword ? isReset ? "Reset password" : "Recover Password" : "Login"}
      </button>
      {!isSignUp && !isForgotPassword && (
        <>
          <button onClick={() => setIsSignUp(true)}>Sign Up</button>
          <button onClick={() => setIsForgotPassword(true)}>
            Forgot Password?
          </button>
        </>
      )}
      {(isSignUp || isForgotPassword) && (
        <button
          onClick={() => {
            setIsSignUp(false);
            setIsForgotPassword(false);
            setIsReset(false);
          }}
        >
          Back to Login
        </button>
      )}
    </div>
  );
};

export default Login;
