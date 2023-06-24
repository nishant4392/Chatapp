import React, {  useState } from "react";
import TextField from "@mui/material/TextField";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";
import User from "./User";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import Badge from 'react-bootstrap/Badge';
import { useNavigate } from "react-router-dom";


const CreateGroupModal = (props) => {
  const navigate=useNavigate();
  const {user,groupCreationList,groupCreationListName} = ChatState();
  const [users,setUsers]=useState([]);
  const [searchedUser,setSearchedUser]=useState("");
  const [chatName,setChatName]=useState("")

  const handleSearchUsers=async()=>{
    let token = user.token;
    let {data} = await axios.get(`http://localhost:5000/api/user/allUsers?search=${searchedUser}`,{
      headers:{
        Authorization:token
      }
    });
    setUsers(data);
  }

  const searchingUser=(e)=>{
    setSearchedUser(e.target.value);
    handleSearchUsers();
  }

  const makeGroupChat=async()=>{
    if(groupCreationList.length>1 && chatName){
      let token = user.token;
      let {data} = await axios.post(`http://localhost:5000/api/chat/makeGroupChat`,{members:groupCreationList,chatName},{
        headers:{
          Authorization:token
        }
      });
      console.log(data);
      navigate("/");
    }
    else{
      alert("Choose at least two members and Name");
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <h2 className="blue-border center-items">Create Group Chat</h2>
        <div className="create-group-cnt blue-border">
          <div className="create-group-left blue-border">
            <TextField fullWidth label="Chat Name" size="large" value={chatName} onChange={(e)=>{setChatName(e.target.value)}}/>
            <TextField
              fullWidth
              label="Enter Member Names eg: Nishant, Rahul, Kashish"
              size="large"
              value={searchedUser}
              onChange={searchingUser}
            />
            <Button variant="contained" onClick={makeGroupChat}>Create Chat</Button>
          </div>
          <div className="create-group-list blue-border">
            {
              users.length>0?users.map((item,index)=><User toAdd={item._id} toAddName={item.name} groupadd={true} val={`z${index}`} key={index} name={item.name} pic={item.pic} email={item.email}/>):null
            }
          </div>
        </div>
          <div className="blue-border create-group-badges">
          {
            groupCreationListName?
            groupCreationListName.map((item,index)=><Badge bg="primary" key={index}>{item}</Badge>):console.log("nothing found")

          }
          </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGroupModal;
