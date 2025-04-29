const express=require('express')
const router=express.Router()
const { admintokenverify, adminauthchack } = require('../../middlewire/authorization')
const imageuplode=require('../../helper/uplodeimage')
const blogController = require('../../controller/adminController/blogController')


// show blog table
router.get('/blog',admintokenverify,adminauthchack,blogController.blogs)
// show blog addition page
router.get('/addblog',admintokenverify,adminauthchack,blogController.addblog)
// add blog data
router.post('/addblogdata',imageuplode.single('image'),admintokenverify,adminauthchack,blogController.addblogdata)
// show blog updation page
router.get('/updateblog/:id',admintokenverify,adminauthchack,blogController.updateblogpage)
// add blog update data
router.post('/blogupdata/:id',imageuplode.single('image'),admintokenverify,adminauthchack,blogController.blogupdata)
// add blog update data
router.get('/blogdelete/:id',admintokenverify,adminauthchack,blogController.blogdelete)
// blog comment display
router.get('/blogcomments',admintokenverify,adminauthchack,blogController.blogcommentdisplay)
// admin blog comment delete
router.get('/delete/comment/:id',admintokenverify,adminauthchack,blogController.blogcommentdelete)
router.get('/delete/useraccount/:id',admintokenverify,adminauthchack,blogController.adminuseraccountdelete)
router.get('/restore/comment/:id',admintokenverify,adminauthchack,blogController.adminuseraccountrestore)
module.exports=router