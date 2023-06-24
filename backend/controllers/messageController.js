const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const sender = req.user._id;
  const { content, chatId } = req.body;
  let newMessage = new Message({
    sender: sender,
    content: content,
    chat: chatId,
  });
  newMessage = await newMessage.save();

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: newMessage,
  });

  newMessage = await Message.populate(newMessage, [
    {
      path: "sender",
      model: "User",
      select: "-password",
    },
    {
      path: "chat",
      model: "Chat",
      populate: [
        {
          path: "latestMessage",
          model: "Message",
        },
        {
          path:"members",
          model:"User"
        }
      ],
    },
  ]);
  res.json(newMessage);
});

const fetchAllMessages = asyncHandler(async (req, res) => {
   const {chatId}=req.body;
    let messages = await Message.find({chat:chatId});
    messages = await Message.populate(messages,[
      {
        path:"sender",
        model:"User",
        select:"name"
      },
      {
        path: "chat",
        model: "Chat",
        populate: [
          {
            path: "latestMessage",
            model: "Message",
          },
        ],
      }
    ]);
    res.send(messages);
});

module.exports = { sendMessage,fetchAllMessages};
