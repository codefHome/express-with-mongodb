const router = require("express").Router();
const fetchUserController=require('./controller/fetchUser')
const registerUserController=require('./controller/registerUser')
const updatePasswordController=require('./controller/updatePassword')
const loginController=require('./controller/login')
const twoFactorAuthController=require('./controller/twoFactorAuth')


//endpoints that client access to get server response
router.get("/getOne/:email", fetchUserController.getUserByEmail);
router.post("/users",fetchUserController.getAllUsers)
router.post("/registerUser",registerUserController.register)
router.put("/updatePassword/:email",updatePasswordController.update)
router.post("/login",loginController.login)
router.post("/twoFactorAuth",twoFactorAuthController.twoFactor)
router.put("/update/twoFactor/:email",twoFactorAuthController.updateTwoFactor)

module.exports=router