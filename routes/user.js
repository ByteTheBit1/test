const express       = require("express");
const router        = express.Router();
const admin_auth    = require('../auth/admin_auth')
const UserController = require('../controllers/user');
const checkAuth = require('../auth/user_auth');

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.delete("/delete/:userId", checkAuth,admin_auth, UserController.user_delete);

module.exports = router;