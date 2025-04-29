const express=require('express')
const router=express.Router()
const { admintokenverify, adminauthchack } = require('../../middlewire/authorization')
const imageuplode=require('../../helper/uplodeimage')
const doctorController = require('../../controller/adminController/doctorController')
const errorhandal = require('../../helper/errorhandeler')



// for doctoe router
// display Doctor data Adding page after admin authentication
router.get('/adddoctor',admintokenverify,adminauthchack,doctorController.add_doctor_page)
// display Doctor page
router.get('/showdoctor',admintokenverify,adminauthchack,doctorController.show_doctor_page)
// update doctor page display
router.get('/update/:id',admintokenverify,adminauthchack,doctorController.update_doctor_page)
// router.get('/showsingledoctor/:id',admintokenverify,admincoltroller.authchackadmin,admincoltroller.shosingledoctor_page)
// active and incative doctor it show the avalable doctor and unavalable doctor 
router.get('/activedoctor',admintokenverify,adminauthchack,doctorController.show_active_doctor_list)
router.get('/inactivedoctor',admintokenverify,adminauthchack,doctorController.show_inactive_doctor_list)

// doctor api

// doctor add api send the data's data to store in mongbd
router.post('/doctorinfo',admintokenverify,adminauthchack,errorhandal,doctorController.doctorinfostore)
//  doctor update api send the data went data it's update
router.post('/doctor_update/:id',admintokenverify,adminauthchack,imageuplode.single('image'),doctorController.update_doctor)
// doctor delete api send requext for delte doctor it is soft delete
router.get('/delete/:id',admintokenverify,adminauthchack,doctorController.deletedoctor)
// dovtor inactive and active hear you can avalable and unavalable doctor status
// state change active and in active is active then unactive and is inactive then active
router.get('/activeingstatus/:id',admintokenverify,adminauthchack,doctorController.change_stutas)





// show depertment and service for a piticular detaile
// router.get('/showsingleserviseanddept/:id',admintokenverify,adminauthchack,departmentController.show_single_dept_service_page)
module.exports=router