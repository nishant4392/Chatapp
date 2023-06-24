import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { MuiFileInput } from "mui-file-input";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = React.useState(null);
  const [isLoading, setLoading] = useState(false);
  const navigate= useNavigate()

  const handleChange = (newFile) => {
    setFile(newFile);
  };

  const picUpload = async (pic) => {
    const data = new FormData();
    data.append("file", pic);
    data.append("upload_preset", "ChatApp");
    data.append("cloud_name", "djbhi1xuw");
    let result = await fetch(
      "https://api.cloudinary.com/v1_1/djbhi1xuw/image/upload",
      {
        method: "post",
        body: data,
      }
    );
    result = await result.json();
    return result.url.toString();
  };

  const handleRegister = async() =>{
    setLoading(true);
    if((name && email && password && confirmPassword )&&(confirmPassword===password)){
      if(file){
        if(file.type==="image/jpeg" || file.type==="image/png"){
          const pic=await picUpload(file);
          const {data} = await axios.post("http://localhost:5000/api/user/register",{name, email, password, pic},{
            headers:{
              "Content-Type":"application/json"
            }
          });
          console.log(data);
          alert("Registered Succesfully")
          localStorage.setItem("userInfo",JSON.stringify(data));
          navigate("/chats");
        }
        else{
          alert("Please only upload an image")
        }
      }
      else{
          const {data}= await axios.post("http://localhost:5000/api/user/register",{name, email, password},{
            headers:{
              "Content-Type":"application/json"
            }
          });
          console.log(data);
          alert("Registered Succesfully")
          localStorage.setItem("userInfo",JSON.stringify(data));
          navigate("/chats");
      }
    }
    else{
      alert("Please enter the correct details");
    }
    setLoading(false);

  }

  return (
    <div>
      <TextField fullWidth label="Name" id="fullWidth" margin="normal" value={name} onChange={(e)=>{setName(e.target.value)}}/>
      <TextField fullWidth label="Email" id="fullWidth" margin="normal" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
      <TextField fullWidth label="Password" id="fullWidth" margin="normal" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
      <TextField fullWidth label="Confirm Password" id="fullWidth" margin="normal" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
      <MuiFileInput
        fullWidth
        label="Upload Picture"
        value={file}
        onChange={handleChange}
        margin="normal"
      />
      <div className="d-grid gap-2 mt-3 mb-3">
        <Button variant="primary" size="lg" 
        onClick={handleRegister}
        disabled={isLoading}
        >
        {isLoading ? 'Registering…' : 'Register'}
        </Button>
      </div>
    </div>
  );
};

export default Register;
