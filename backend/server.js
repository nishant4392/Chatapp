const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { chats } = require("./data/data");
const connectdb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
connectdb();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("the server is running properly");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("listening to port 5000");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
  });

  socket.on("new-message", (newMessage) => {
    newMessage.chat.members.map((item,index)=>{
      socket.in(item._id).emit("message-recieved",newMessage);
    })
  });

  socket.off("setup",()=>{
    console.log("user disconnected");
    socket.leave(userData._id)
  });
});
