import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import User from "./User";
import MyVerticallyCenteredModal from "./MyVerticallyCenteredModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import NotificationChat from "./NotificationChat";

const Navbar = () => {
  const { user,notifications} = ChatState();
  const userName = user.name;
  const userPic = user.pic;
  const userEmail = user.email;
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalShow, setModalShow] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    let token = user.token;
    let { data } = await axios.get(
      `http://localhost:5000/api/user/allUsers?search=${search}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setUsers(data);
  };

  useEffect(()=>{
    if(notifications.length>0){
      let element = document.querySelector(".notification-dot");
      element.classList.add("notification-on");
    }
    else{
      let element = document.querySelector(".notification-dot");
      element.classList.remove("notification-on");
    }
  },[notifications])

  return (
    <div>
      <div className="navbar blue-border">
        <div
          className="navbar-left blue-border no-space nav-blocks left-items "
          onClick={handleShow}
        >
          <SearchIcon className="search-icon" /> Search Users
        </div>
        <div className="navbar-mid blue-border center-items nav-blocks no-space">
          CHAT - APP
        </div>
        <div className="navbar-right blue-border center-items nav-blocks no-space">
          <div className="notification-bell ">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
              <NotificationsActiveIcon className="mg" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
              {
                notifications.length>0?notifications.map((item,index)=><Dropdown.Item key={index} ><NotificationChat newchat={item}/></Dropdown.Item>):null
              }
              </Dropdown.Menu>
            </Dropdown>

            <div className="notification-dot notification-on"></div>
          </div>
          <Dropdown>
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-basic"
              className="dropdown-color"
              size="sm"
            >
              <Avatar
                alt="Remy Sharp"
                src={userPic}
                sx={{ width: 30, height: 30 }}
                className="mg"
              />
              {userName}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setModalShow(true)}>
                My Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search Users</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="canvas blue-border">
          <div className="canvas-search blue-border center-items">
            <TextField
              fullWidth
              label="Search user by name or email"
              id="fullWidth"
              size="small"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Button
              variant="text"
              color="success"
              size="medium"
              onClick={handleSearch}
            >
              <SearchIcon className="search-icon" />
            </Button>
          </div>
          <div className="canvas-content blue-border">
            {users.length > 0 ? (
              users.map((item, index) => (
                <User
                  singleadd={true}
                  name={item.name}
                  email={item.email}
                  pic={item.pic}
                  userid={item._id}
                  key={index}
                />
              ))
            ) : (
              <div className="center-items blue-border">No such user found</div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        username={userName}
        userpic={userPic}
        useremail={userEmail}
      />
    </div>
  );
};

export default Navbar;
