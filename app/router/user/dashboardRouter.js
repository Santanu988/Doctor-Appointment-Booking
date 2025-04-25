const express=require('express')
const router=express.Router()
const webController=require('../../webServises/webController')
const { usertokenverify, userauthenticationchack } = require('../../middlewire/authorization')
const userController = require('../../controller/userController/userController')
const imageuplode=require('../../helper/uplodeimage')
const dashboardController = require('../../controller/userController/dashboardController')
// display user dashboard page
router.get('/',usertokenverify,userauthenticationchack,dashboardController.user_Dashboard_page)

// change password page display
router.get('/changepassword',usertokenverify,userauthenticationchack,dashboardController.changpassdord_page_display)
// after pcang password thend send data in the url
router.post('/changepassword_data',usertokenverify,userauthenticationchack,dashboardController.changepassword)
// user account delete page display
router.get('/deleteaccount',usertokenverify,userauthenticationchack,dashboardController.account_delete_page);
router.post('/deleteaccount_data',usertokenverify,userauthenticationchack,dashboardController.account_delete_data);

router.get('/profile',usertokenverify,userauthenticationchack,dashboardController.user_profile_page)
router.get('/profile/edit',usertokenverify,userauthenticationchack,dashboardController.edit_profile)
router.post('/profile/datastore',usertokenverify,userauthenticationchack,dashboardController.edit_profile_datastore)
// display user appoinments page
router.get('/appointments',usertokenverify,userauthenticationchack,dashboardController.user_appoiments_table)

router.get('/appointment/cancel/:id',usertokenverify,userauthenticationchack,dashboardController.user_appoiments_cancel)

module.exports=router