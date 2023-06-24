import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import User from "./User";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const MembersInfoModal = (props) => {
  const{user,setEngagedChat} = ChatState();
  const navigate=useNavigate();
  const chat = props.chat;
  const group = chat.isGroupChat;
  const [addMember, setAddMember] = useState("");
  const [removeMember, setRemoveMember] = useState("");
  const [newName, setNewName] = useState("");

  const handleAddMember = async () => {
    try {
      let token = user.token;
      let {data} = await axios.get(`http://localhost:5000/api/user/allUsers?search=${addMember}`,{
        headers:{
          Authorization:token
        }
      });
      let targetUserId=data[0]._id;
      if(data.length==1){
        let {data} = await axios.put(`http://localhost:5000/api/chat/addGroupChat`,{chatId:chat._id,targetUserId},{
          headers:{
            Authorization:token
          }
        });
        console.log(data);
        navigate("/")
      }
    } catch (error) {
      alert("user not found")
    }
  };

  const handleRemoveMember = async () => {
    try {
      let token = user.token;
      let {data} = await axios.get(`http://localhost:5000/api/user/allUsers?search=${removeMember}`,{
        headers:{
          Authorization:token
        }
      });
      let targetUserId=data[0]._id;
      if(data.length==1){
        let {data} = await axios.put(`http://localhost:5000/api/chat/removeGroupChat`,{chatId:chat._id,targetUserId},{
          headers:{
            Authorization:token
          }
        });
        navigate("/")
      }
    } catch (error) {
      alert("user not found")
    }
  };

  const handleNewName = async () => {
    if (newName) {
      let token = user.token;
      let {data} = await axios.put(`http://localhost:5000/api/chat/renameGroupChat`,{chatId:chat._id,chatName:newName},{
        headers:{
          Authorization:token
        }
      });
      navigate("/");
    }
    else{
      alert("please fill the field properly")
    }

  };

  const handleChatLeave = async()=>{
    let token = user.token;
    await axios.put("http://localhost:5000/api/chat/leaveChat",{chatId:chat._id},{
      headers:{
        Authorization:token
      }
    });
    setEngagedChat(null);
    localStorage.removeItem('chatInfo');
    navigate("/");
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div className="members-info-modal blue-border">
          <div className="members blue-border">
            <div className="mmb-head blue-border center-items">
              {" "}
              All Members
            </div>
            <div className="members-list blue-border">
              {chat.members
                ? chat.members.map((item, index) => (
                    <User
                      name={item.name}
                      email={item.email}
                      pic={item.pic}
                      key={index}
                    />
                  ))
                : console.log("nothing found")}
            </div>
          </div>
          {group ? (
            <div className="add-remove-members blue-border">
              <TextField
                className="mgtb"
                size="small"
                value={newName}
                fullWidth
                label="Enter New Name"
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
              />
              <Button
                className="mgtb"
                size="small"
                variant="contained"
                onClick={handleNewName}
              >
                Update Chat Name
              </Button>
              <TextField
                className="mgtb"
                size="small"
                value={addMember}
                fullWidth
                label="Enter Member Email"
                onChange={(e) => {
                  setAddMember(e.target.value);
                }}
              />
              <Button
                className="mgtb"
                size="small"
                variant="contained"
                onClick={handleAddMember}
              >
                Add Member
              </Button>
              <TextField
                className="mgtb"
                size="small"
                value={removeMember}
                fullWidth
                label="Enter Member Email"
                onChange={(e) => {
                  setRemoveMember(e.target.value);
                }}
              />
              <Button
                className="mgtb"
                size="small"
                variant="contained"
                onClick={handleRemoveMember}
              >
                Remove Member
              </Button>
            </div>
          ) : (
            <div className="add-remove-members blue-border center-items">
              Single conversation
            </div>
          )}
        </div>
        <div className="leave-btn blue-border">
          <Button variant="contained" onClick={handleChatLeave}>Leave Chat</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MembersInfoModal;
