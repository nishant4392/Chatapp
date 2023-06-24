import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatState = () => {
  return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [groupCreationList,setGroupCreationList] = useState([]);
  const [groupCreationListName,setGroupCreationListName] = useState([]);
  const [notifications,setNotifications] = useState([]);
  const [engagedChat,setEngagedChat]=useState();
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const chatInfo = JSON.parse(localStorage.getItem("chatInfo"));
    setUser(userInfo);
    setEngagedChat(chatInfo);
    if (userInfo) {
      navigate("/chats");
    }
    else{
      navigate("/");
    }
  },[navigate]);

  return <ChatContext.Provider value={{user,setUser,groupCreationList,setGroupCreationList,groupCreationListName,setGroupCreationListName,engagedChat,setEngagedChat,notifications,setNotifications}}x>{children}</ChatContext.Provider>;
};



export default ChatProvider;
