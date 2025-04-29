const express=require('express')
const router=express.Router()
const { admintokenverify, adminauthchack } = require('../../middlewire/authorization')
const adminController = require('../../controller/adminController/adminController')


// for admin route
// display admin login page
router.get('/login',adminController.admin_login_page)
// display admin dashboard page after admin authentication
router.get('/dashboard',admintokenverify,adminauthchack,adminController.admin_dashboard_page)
// show appoiments
router.get('/showappoiments',admintokenverify,adminauthchack,adminController.show_appoiments_page)
// show admin info
router.get('/showadmindata',admintokenverify,adminauthchack,adminController.show_admin_personal_info_page)
// login api send the login creadencial to authenticate chack and lg in
router.post('/admin_login',adminController.admin_login)
// logout api send the logout request
router.get('/logout',admintokenverify,adminauthchack,adminController.adminlogout)







// show depertment and service for a piticular detaile
// router.get('/showsingleserviseanddept/:id',admintokenverify,adminauthchack,departmentController.show_single_dept_service_page)
module.exports=router