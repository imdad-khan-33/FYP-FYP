import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { login, signup, resetPass } from '../../config/firebase'

// Login component definition
const Login = () => {
  // State variables for managing form inputs and current state
  const [currState, setCurrState] = useState("Sign up");
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = (e)=>{
    e.preventDefault();
    if(currState === "Sign up"){
      // Call signup function if current state is "Sign up"
      signup(username, email, password);
    }else{
      // Call login function if current state is "Login"
      login(email, password);
    }
  }

  return (
    <div className='login'>
      {/* Display logo */}
      <img src={assets.logo_big} alt="" className='logo'/>
      {/* Form for login/signup */}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{currState}</h2>
        {/* Show username input only if current state is "Sign up" */}
        {currState=== "Sign up" && <input onChange={(e)=>setUsername(e.target.value)} value={username} type="text" placeholder='username' className="form-input" required/>}
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='email address' className="form-input" required/>
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder='password' className="form-input" required/>
        <button type='submit'>{currState === "Sign up" ? "Create account" : "Login now"}</button>
        <div className="login-term">
          <input type="checkbox" required/>
          <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="login-forgot">
          {/* Toggle between login and signup */}
          {currState==="Sign up"
          ? <p className="login-toggle">Already have an account <span onClick={()=>setCurrState("Login")}>Login here</span></p>
          : <p className="login-toggle">Create an account <span onClick={()=>setCurrState("Sign up")}>click here</span></p>}
          {/* Show reset password option if current state is "Login" */}
          {currState === "Login" && <p className="login-toggle">Forgot password <span onClick={()=>resetPass(email)}>reset here</span></p>}
        </div>
      </form>
    </div>
  )
}

export default Login