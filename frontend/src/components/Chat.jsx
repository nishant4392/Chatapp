import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MembersInfoModal from "./MembersInfoModal";
import { ChatState } from "../Context/ChatProvider";

const Chat = (props) => {
  const{user,engagedChat,setEngagedChat} = ChatState();
  const [modalShow, setModalShow] = useState(false);
  const [showName,setShowName]=useState("");
  const [chatPerson,setChatPerson]=useState("");
  const chat = props.newchat;
  const latestMessage = chat.latestMessage;
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
  },[engagedChat])

  const changeEngagedChat=()=>{
    setEngagedChat({
      chat:chat,
      chatName:showName,
      chatPerson:chatPerson
    })
  }

  const selector=()=>{
    if(props.changeChat){
      changeEngagedChat();
    }
  }

  return (
    <>
      {latestMessage ? (
        <div className="chat blue-border" onClick={selector}>
          <div className="chat-left blue-border ">
            <h6>{showName}</h6>
            <div className="chat-msg">
              <b>{latestMessage.sender.name} : </b> {latestMessage.content}
            </div>
          </div>
          <div className="chat-members blue-border center-items" onClick={()=>setModalShow(true)}>
            <MoreVertIcon />
          </div>
        </div>
      ) : (
        <div className="chat blue-border" onClick={selector}>
          <div className="chat-left blue-border ">
            <h6>{showName}</h6>
            <div className="chat-msg">
              <b>No chats yet: </b> Start chatting...
            </div>
          </div>
          <div className="chat-members blue-border center-items" onClick={()=>setModalShow(true)}>
            <MoreVertIcon />
          </div>
        </div>
      )}
      <MembersInfoModal show={modalShow} onHide={() => setModalShow(false)} chat={chat}/>
    </>
  );
};

export default Chat;
