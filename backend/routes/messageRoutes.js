const express = require("express");
const {sendMessage, fetchAllMessages} = require("../controllers/messageController");
const {protect}  = require("../middleware/authToken");

const router = express.Router();

router.route("/sendMessage").post(protect,sendMessage);
router.route("/fetchAllMessages").post(protect,fetchAllMessages);

module.exports = router;