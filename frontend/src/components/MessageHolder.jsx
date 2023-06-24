import React, { useEffect, useState,useRef  } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MyVerticallyCenteredModal from "./MyVerticallyCenteredModal";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { io } from "socket.io-client";

var socket; 
var selectedChatCompare ;

const MessageHolder = () => {
  const ENDPOINT = "http://localhost:5000";
  const { user, engagedChat,notifications,setNotifications } = ChatState();
  const [modalShow, setModalShow] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [messageToSend, setMessageToSend] = useState("");
  const containerRef = useRef(null);

  const getAllMessages = async () => {
    let token = user.token;
    let { data } = await axios.post(
      "http://localhost:5000/api/message/fetchAllMessages",
      { chatId: engagedChat.chat._id },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setAllMessages(data)
  };

  const sendMessage = async () => {
    if (messageToSend) {
      let token = user.token;
      let { data } = await axios.post(
        "http://localhost:5000/api/message/sendMessage",
        { content: messageToSend, chatId: engagedChat.chat._id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessageToSend("");
      socket.emit("new-message",data);
      console.log("my fault");
      setAllMessages([...allMessages,data]);
    } else {
      alert("please enter a message first");
    }
  };

  useEffect(() => {
    getAllMessages();
    selectedChatCompare=engagedChat;
  }, [engagedChat]);

  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("join-chat",user._id);
  },[])

  useEffect(()=>{
    socket.on("message-recieved",async(newMessage)=>{
      if(!selectedChatCompare || selectedChatCompare.chat._id!==newMessage.chat._id){
        if(!notifications.includes(newMessage.chat)){
          setNotifications([newMessage.chat,...notifications]);
        }
      }
      else{
        setAllMessages([...allMessages,newMessage]);
      }
    })
  });

  useEffect(() => {
    if(engagedChat){
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [allMessages]);

  return (
    <>
      <div className="right-panel blue-border">
        {engagedChat ? (
          <>
            <div className="message-head blue-border">
              <div className="chat-name blue-border left-items">
                {engagedChat.chatName}
              </div>
              <div
                className="chat-person blue-border center-items"
                onClick={() => setModalShow(true)}
              >
                <VisibilityIcon onClick={() => setModalShow(true)} />
              </div>
            </div>
            <div className="message-box blue-border" ref={containerRef}>
              {allMessages.length > 0
                ? allMessages.map((item, index) => (
                    <Message message={item} key={index} />
                  ))
                : null}
            </div>
            <div className="sending-field blue-border center-items">
              <TextField
                fullWidth
                label="Enter your message"
                id="fullWidth"
                size="small"
                value={messageToSend}
                onChange={(e) => {
                  setMessageToSend(e.target.value);
                }}
              />
              <Button
                variant="text"
                color="primary"
                size="medium"
                onClick={sendMessage}
              >
                <SendIcon />
              </Button>
            </div>
            <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              username={engagedChat.chatPerson.name}
              userpic={engagedChat.chatPerson.pic}
              useremail={engagedChat.chatPerson.email}
            />
          </>
        ) : (
          <h4 className="not-engaged-chat center-items blue-border">
            Tap on chats to start chatting
          </h4>
        )}
      </div>
    </>
  );
};

export default MessageHolder;
