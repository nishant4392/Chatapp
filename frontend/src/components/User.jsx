import React from "react";
import Avatar from "@mui/material/Avatar";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const User = (props) => {
  const {
    user,
    groupCreationList,
    setGroupCreationList,
    setGroupCreationListName,
    groupCreationListName,
  } = ChatState();

  const navigate=useNavigate();

  const handleSelection = () => {
    if (groupCreationList.includes(props.toAdd)) {
      setGroupCreationList((prev) =>
        prev.filter((item) => item !== props.toAdd)
      );
      setGroupCreationListName((prev) => {
        const index = prev.indexOf(props.toAddName);
        prev.splice(index, 1);
        return prev;
      });
      const element = document.querySelector(`.${props.val}`);
      element.classList.remove("selected-user");
    } else {
      setGroupCreationList([...groupCreationList, props.toAdd]);
      setGroupCreationListName([...groupCreationListName, props.toAddName]);
      const element = document.querySelector(`.${props.val}`);
      element.classList.add("selected-user");
    }
  };

  const makeSingleChat = async()=>{
    let token = user.token;
    let {data} = await axios.post(`http://localhost:5000/api/chat/accessChat`,{targetUserId:props.userid},{
      headers:{
        Authorization:token
      }
    });
    navigate("/");
  }

  const selector =()=>{
    if(props.groupadd){
      handleSelection();
    }
    if(props.singleadd){
      makeSingleChat();
    }
  }

  return (
    <div
      className={`user blue-border ${props.val}`}
      onClick={selector}
    >
      <div className="user-pic blue-border center-items">
        <Avatar
          alt="Remy Sharp"
          src={props.pic}
          sx={{ width: 50, height: 50 }}
        />
      </div>
      <div className="user-detail blue-border">
        <h6>{props.name}</h6>
        <b>Email : </b> {props.email}
      </div>
    </div>
  );
};

export default User;
