const express=require('express')
const router=express.Router()
const webController=require('../../webServises/webController')
const { usertokenverify, userauthenticationchack } = require('../../middlewire/authorization')
const userController = require('../../controller/userController/userController')
const imageuplode=require('../../helper/uplodeimage')

// display the user register page
router.get('/register',usertokenverify,userController.register_page_display)
// user register after data store in mongdb
router.post('/userregister',imageuplode.single('image'),userController.user_register)
// user login page display
router.get('/login',usertokenverify,userController.login_page_display)
// after login dat send this url
router.post('/userlogin',userController.user_login)
// fprgot password
router.get('/forgotpassword',usertokenverify,userController.forgotpassword_page);
// display appoinemts page
router.get('/appointments',usertokenverify,userauthenticationchack,userController.appoiments_page_display)
// after submit the appoinments from dada send this url
router.post('/appointmentsdatastore',usertokenverify,userauthenticationchack,userController.apptdata_store)

// logout user
router.get('/logout',usertokenverify,userauthenticationchack,userController.logout)

router.get('/forgot_Password',userController.forgotPassPage);
router.post('/sendOtp',userController.sendotp);
router.post('/verifyotp',userController.verifyotp);
module.exports=router