import React, { useEffect, useState } from 'react';
import {ChatState} from "../Context/ChatProvider"

const Message = (props) => {
  const {user} = ChatState();
  const message=props.message;
  const [mine,setMine] = useState(false);


  useEffect(()=>{
    if(message.sender._id === user._id){
      setMine(true);
    }
  },[]);
  return (
    <>
    {
        mine?<div className="messages blue-border mine">{message.content}</div>:<div className="messages blue-border"><h6>{message.sender.name}</h6><div>{message.content}</div></div>
    }
    </>
  )
}

export default Message
