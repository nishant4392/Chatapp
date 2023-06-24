const express= require("express");
const { registerUser, loginUser,getAllUsers } = require("../controllers/userControllers");
const {protect} = require("../middleware/authToken");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/allUsers").get(protect,getAllUsers);

module.exports = router;
