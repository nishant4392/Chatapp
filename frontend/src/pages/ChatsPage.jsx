import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import MyChatsBox from "../components/MyChatsBox";
import MessageHolder from "../components/MessageHolder";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const ChatsPage = () => {
  const { user,setEngagedChat} = ChatState();
  const engagedChat = true;
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    else{
      setEngagedChat(JSON.parse(localStorage.getItem("chatInfo")))
    }
  }, [navigate]);

  return (
    <>
      {!user ? null : (
        <div className="chat-page">
          <Navbar />
          <div className="below-content">
            <MyChatsBox />
            {engagedChat ? (
              <MessageHolder />
            ) : (
              <div className="no-chat center-items blue-border">
              No chats Yet
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatsPage;
