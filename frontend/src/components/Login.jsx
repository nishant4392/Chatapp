import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from "react-bootstrap/Button";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate= useNavigate();

  const handleLogin = async() =>{
    setLoading(true);
    if(email && password){
      try {
        const {data}= await axios.post("http://localhost:5000/api/user/login",{email,password},{
          headers:{
            "Content-Type":"application/json"
          }
        });
        localStorage.setItem("userInfo",JSON.stringify(data));
        navigate("/chats");
      } catch (error) {
        alert("Please enter correct details");
      }
    }
    else{
      alert("Please enter all the fields")
    }
    setLoading(false); 
  }


  return (
    <div>
    <TextField fullWidth label="Email" id="fullWidth" margin="normal" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
    <TextField fullWidth label="Password" id="fullWidth" margin="normal"  value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
    <div className="d-grid gap-2 mt-3 mb-3">
        <Button variant="primary" size="lg" 
        onClick={handleLogin}
        disabled={isLoading}
        >
        {isLoading ? 'LoggingIn...': 'Login'}
        </Button>
      </div>
    </div>
  );
};

export default Login;
