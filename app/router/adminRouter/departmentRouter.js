const express=require('express')
const router=express.Router()
const { admintokenverify, adminauthchack } = require('../../middlewire/authorization')
const imageuplode=require('../../helper/uplodeimage')
const departmentController = require('../../controller/adminController/departmentController')

// depertments router
// add department data page
router.get('/adddeperment',admintokenverify,adminauthchack,departmentController.add_department_page)
// show depertment data page
router.get('/deperments',admintokenverify,adminauthchack,departmentController.Show_department_page)
// show update depeartment from
router.get('/updatedepartmentdata/:id',admintokenverify,adminauthchack,departmentController.show_update_department_page)

// depertment api
// dept add api this is api where send the data to store in mongdb database
router.post('/departmentdataadd',admintokenverify,adminauthchack,imageuplode.single('image'),departmentController.depaertment_data_add)
// dept update api this is api where send the data to update and store in mongdb database
router.post('/updatedepartment/:id',admintokenverify,adminauthchack,imageuplode.single('image'),departmentController.depaertment_data_update)
// dept delete api by cend an delete request of a dept this is softdelete delete from UI bys not database
router.get('/deletedepertment/:id',admintokenverify,adminauthchack,departmentController.deletedepertment)
module.exports=router