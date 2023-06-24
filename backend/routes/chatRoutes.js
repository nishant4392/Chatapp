const express = require("express");
const {protect}  = require("../middleware/authToken");
const {accessChat,fetchAllChat,makeGroupChat,renameGroupChat,addGroupChat,removeGroupChat,leavechat}= require("../controllers/chatControllers");

const router = express.Router();

router.route("/accessChat").post(protect,accessChat);
router.route("/fetchAllChat").get(protect,fetchAllChat);
router.route("/makeGroupChat").post(protect,makeGroupChat);
router.route("/renameGroupChat").put(protect,renameGroupChat);
router.route("/removeGroupChat").put(protect,removeGroupChat);
router.route("/addGroupChat").put(protect,addGroupChat,);
router.route("/leaveChat").put(protect,leavechat);

module.exports = router;