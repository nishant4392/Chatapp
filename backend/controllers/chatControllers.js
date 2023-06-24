const Chat = require("../models/chatModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const accessChat = asyncHandler(async (req, res) => {
  const { targetUserId } = req.body;
  let chat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { members: { $elemMatch: { $eq: req.user._id } } },
      { members: { $elemMatch: { $eq: targetUserId } } },
    ],
  });
  if (chat) {
    //examples to learn from  :
    // 1 chat = await User.populate(chat, {
    //   path: "latestMessage.sender",
    //   select: "-password",
    // });
    // 2 const populatedChatList = await Chat.populate(chatList, {
    //   path: "latestMessage",
    //   populate: [
    //     {
    //       path: "sender",
    //       model: "User",
    //       select: "-password",
    //       populate: {
    //         path: "profile",
    //         model: "Profile"
    //       }
    //     }
    //   ]
    // });
    // 3 the best example yet : make the list for multiple population, also make list for nested population.
    // const populatedChatList = await Chat.populate(chatList, [
    //   {
    //     path: "members",
    //     model: "User",
    //     select: "-password"
    //   },
    //   {
    //     path: "groupAdmin",
    //     model: "User",
    //     select: "-password"
    //   },
    //   {
    //     path: "latestMessage",
    //     populate: [
    //       {
    //         path: "sender",
    //         model: "User",
    //         select: "-password",
    //         populate: {
    //           path: "profile",
    //           model: "Profile"
    //         }
    //       }
    //     ]
    //   }
    // ]);
    chat = await Chat.populate(chat, [
      {
        path: "members",
        model: "User",
        select: "-password",
      },
      {
        path: "latestMessage",
        populate: [
          {
            path: "sender",
            model: "User",
            select: "-password",
          },
        ],
      },
    ]);
    // how to just get the id of an referenced field
    // console.log(`${chat.latestMessage.chat}`);
    res.send(chat);
  } else {
    let newChat = await new Chat({
      chatName: "sender",
      isGroupChat: false,
      members: [req.user._id, targetUserId],
    });
    newChat = await newChat.save();
    try {
      let fullChat = await Chat.findById(newChat._id);
      await fullChat.populate("members", "-password");
      res.send(fullChat);
    } catch (error) {
      throw new Error("Chat not created");
    }
  }
});

const fetchAllChat = asyncHandler(async (req, res) => {
  let allChats = await Chat.find({
    members: { $elemMatch: { $eq: req.user._id } },
  });
  allChats = await Chat.populate(allChats, [
    {
      path: "members",
      model: "User",
    },
    {
      path: "latestMessage",
      populate: [
        {
          path: "sender",
          model: "User",
          select: "-password",
        },
      ],
    },
    {
      path: "groupAdmin",
      model: "User",
      select: "-password",
    },
  ]);
  //.sort cannot be sorted without this function thing
  allChats = allChats.sort((a, b) => b.updatedAt - a.updatedAt);
  res.send(allChats);
});

const makeGroupChat = asyncHandler(async (req, res) => {
  try {
    //make sure that members and ChatName comes, members is not empty and members does not have the user id.
    let { members, chatName } = req.body;
    members.push(req.user._id);
    let chatToAdd = {
      chatName,
      isGroupChat: true,
      members,
      groupAdmin: req.user._id,
    };
    let finalChat = new Chat(chatToAdd);
    finalChat = await finalChat.save();
    await finalChat.populate("members", "-password");
    await finalChat.populate("groupAdmin", "-password");
    res.send(finalChat);
  } catch (error) {
    throw new Error("Could not make the group chat");
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    );
    await updatedChat.populate("members", "-password");
    await updatedChat.populate("groupAdmin", "-password");
    res.send(updatedChat);
  } catch (error) {
    throw new Error("Could not found Chat");
  }
});

const removeGroupChat = asyncHandler(async (req, res) => {
  try {
    const { targetUserId, chatId } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { members: targetUserId },
      },
      {
        new: true,
      }
    );
    await updatedChat.populate("members", "-password");
    await updatedChat.populate("groupAdmin", "-password");
    res.send(updatedChat);
  } catch (error) {
    res.send(error);
  }
});

const addGroupChat = asyncHandler(async (req, res) => {
  //somehow the approach for remove is not working here.
  //so had to change the code like this.
  const {chatId,targetUserId} = req.body;
  let toBeAdded = await Chat.findById(chatId);
  if(toBeAdded){
    if(toBeAdded.members.includes(targetUserId)){
      await toBeAdded.populate("members", "-password");
      await toBeAdded.populate("groupAdmin", "-password");
      res.send(toBeAdded);
    }else{
      let added = await Chat.findByIdAndUpdate(chatId,{
        $push:{members:targetUserId}
      },{
        new:true
      });
      await added.populate("members", "-password");
      await added.populate("groupAdmin", "-password");
      res.send(added);
    }
  }else{
    throw new Error("Chat not found");
  }
});

const leavechat = asyncHandler(async(req,res)=>{
  const {chatId} = req.body;
  let updatedChat = await Chat.deleteOne({_id:chatId});
  res.send(updatedChat);
})

module.exports = {
  accessChat,
  fetchAllChat,
  makeGroupChat,
  renameGroupChat,
  addGroupChat,
  removeGroupChat,
  leavechat
};
