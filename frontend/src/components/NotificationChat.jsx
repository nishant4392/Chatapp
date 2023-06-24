import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';

const NotificationChat = (props) => {
    const{user,engagedChat,setEngagedChat,notifications,setNotifications} = ChatState();
    const [showName,setShowName]=useState("");
    const [chatPerson,setChatPerson]=useState("");
    const chat = props.newchat;
    useEffect(()=>{
      if(chat.isGroupChat===false){
        let result=chat.members.filter((item)=>item._id!==user._id);
        setShowName(result[0].name);
        setChatPerson(result[0]);
       }
       else{
        setShowName(chat.chatName);
        setChatPerson(chat.groupAdmin);
       }
    },[]);
  
    useEffect(()=>{
      localStorage.setItem("chatInfo",JSON.stringify(engagedChat));
      let updatedList = notifications.filter((item)=>item._id!=engagedChat.chat._id);
      setNotifications(updatedList);
    },[engagedChat])
  
    const changeEngagedChat=()=>{
      setEngagedChat({
        chat:chat,
        chatName:showName,
        chatPerson:chatPerson
      })
    }
   
  return (
    <div className='notification-chat center-items bkue-border' onClick={changeEngagedChat}>
      {showName}
    </div>
  )
}

export default NotificationChat
