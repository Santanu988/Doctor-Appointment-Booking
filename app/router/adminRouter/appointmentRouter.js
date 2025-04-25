const express=require('express')
const router=express.Router()
const { admintokenverify, adminauthchack } = require('../../middlewire/authorization')
const adminController = require('../../controller/adminController/adminController')
const appoinmentController = require('../../controller/adminController/appoinmentController')

const ImageUpload = require('../../helper/uplodeimage')
// display pationt
router.get('/patient/list',admintokenverify,adminauthchack,appoinmentController.patient_list)
router.get('/appionment/approved/:id',admintokenverify,adminauthchack,appoinmentController.changeToApproved)
router.get('/appionment/reject/:id',admintokenverify,adminauthchack,appoinmentController.changeToReject)
router.get('/appionment/resolve/:id',admintokenverify,adminauthchack,appoinmentController.changeToResolve)
router.post('/appionment/rejectdatastore',admintokenverify,adminauthchack,appoinmentController.Rejectdatastore)
router.post('/appionment/resolvedatastore',ImageUpload.single('image'),admintokenverify,adminauthchack,appoinmentController.Resolveddatastore)

module.exports=router