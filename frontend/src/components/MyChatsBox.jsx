import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import CreateGroupModal from "./CreateGroupModal";


const MyChatsBox = () => {
  const { user,setGroupCreationList,setGroupCreationListName} = ChatState();
  const [allChats, setAllChats] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  useEffect(() => {
    getAllChats();
  }, []);
  const getAllChats = async () => {
    try {
      let token = user.token;
      let { data } = await axios.get(
        "http://localhost:5000/api/chat/fetchAllChat",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setAllChats(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const hidingGroupCreationModal=()=>{
    setModalShow(false);
    setGroupCreationList([]);
    setGroupCreationListName([]);
  }

  return (
    <>
      <div className="left-panel blue-border">
        <div className="chat-header blue-border">
          <div className="chat-heading blue-border center-items">My Chats</div>
          <div className="create-group blue-border center-items" onClick={()=>setModalShow(true)}>
            <AddBoxIcon />
            Create Group
          </div>
        </div>
        <div className="chat-content blue-border">
          {allChats.length > 0 ? (
            allChats.map((item, index) => <Chat newchat={item} key={index} changeChat={true}/>)
          ) : (
            <div className="blue-border center-items">No chats yet</div>
          )}
        </div>
      </div>
      <CreateGroupModal show={modalShow} onHide={hidingGroupCreationModal} />
    </>
  );
};

export default MyChatsBox;
