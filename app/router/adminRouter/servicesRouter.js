const express=require('express')
const router=express.Router()
const { admintokenverify, adminauthchack } = require('../../middlewire/authorization')
const imageuplode=require('../../helper/uplodeimage')
const serviceController = require('../../controller/adminController/serviceController')


// services router
// add services data page
router.get('/addservises',admintokenverify,adminauthchack,serviceController.add_servises_page)
// show services data page
router.get('/servises',admintokenverify,adminauthchack,serviceController.Show_services_page)
// show update services from
router.get('/updateservicedata/:id',admintokenverify,adminauthchack,serviceController.show_update_service_page)


// services api
// services add api this is api where send the data to store in mongdb database
router.post('/servicesdataadd',admintokenverify,adminauthchack,imageuplode.single('image'),serviceController.services_data_add)
// services update api this is api where send the data to update and store in mongdb database
router.post('/updateservice/:id',admintokenverify,adminauthchack,imageuplode.single('image'),serviceController.service_data_update)
// services delete api by cend an delete request of a service this is softdelete delete from UI bys not database
router.get('/deleteservices/:id',admintokenverify,adminauthchack,serviceController.deleteservices)
// show depertment and service for a piticular detaile
// router.get('/showsingleserviseanddept/:id',admintokenverify,adminauthchack,departmentController.show_single_dept_service_page)
module.exports=router