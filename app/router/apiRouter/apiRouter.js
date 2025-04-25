const express=require('express')
const router=express.Router()
const adminController = require('../../controller/adminController/adminController')
const {  usertokenverify, userauthenticationchack } = require('../../middlewire/authorization')
const imageuplode=require('../../helper/uplodeimage')
const departmentController = require('../../controller/adminController/departmentController')
const webController = require('../../webServises/webController')

// home page display
router.get('/',usertokenverify,webController.home)
// home about display
router.get('/about',usertokenverify,webController.about)
// home service display
router.get('/service',usertokenverify,webController.service)
// home departments display
router.get('/departments',usertokenverify,webController.departments)
// home doctor display
router.get('/doctors',usertokenverify,webController.doctors)
// home doctor display
router.get('/singledoctor/:id([a-fA-F0-9]{24})',usertokenverify,webController.singledoctors)
// home contact display
router.get('/contactus',usertokenverify,webController.constactus)
//blog page
router.get('/blog',usertokenverify,webController.blog)
//blog page
router.get('/singleblog/:id',usertokenverify,webController.blogsingle)
//blog page
router.post('/commenddatastore/:id',usertokenverify,userauthenticationchack,webController.commenddatastore)
router.get('/delete/:id',webController.deleteComment)
// home contact display
router.get('/error',usertokenverify,webController.errorpage)






// router.get('/forgotpassword_page',tokenverify,homecontroller.forgotpassdord_page_display)
// router.get('/changpassword_page',tokenverify,authenticationchack,homecontroller.changpassdord_page_display)
// router.get('/appoinment_page',tokenverify,homecontroller.appoinment_page_display)
// router.get('/appionment_table_page',tokenverify,authenticationchack,homecontroller.appionment_table_page)
// router.get('/user_personal_information_page',tokenverify,authenticationchack,homecontroller.user_personal_information_page)


module.exports=router