const { Validator } = require('node-input-validator');
const { hasepassword } = require('../../middlewire/authorization');
const usermodel = require('../../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctormodel = require('../../model/doctor')
const fs=require('fs');
const blogmodel = require('../../model/blog');
const departmentmodel = require('../../model/depertment');
const Comment = require('../../model/comment');
const transporter = require('../../config/emailComfig');
class blogController{

async blogs(req,res){
    try{
        const data=await blogmodel.find({isDeleted:false})
        res.render('admin_page/Blog/bloge',{
            user:req.user,title:'Blog Page -Lifeline',data,
        })
    }catch(err){
        console.log(err)
    }
}
async addblog(req,res){
    try{
            const user=req.user;
            const doctors = await departmentmodel.find({ isDeleted: false, isDept: "Department"});
          
           // Extract unique departments
            const departments = [...new Set(doctors.map(doc => doc.name))];
          
        res.render('admin_page/Blog/blogadd_page',{
            user:req.user,title:'Blog Page -Lifeline',departments,doctors
        })
    }catch(err){
        console.log(err)
    }
}

async addblogdata(req,res){
    try {
            
        const v = new Validator(req.body, {           
            title: "required|string|minLength:3",
            category: "required|string|minLength:3", 
            data: "required|minLength:10",         
        });
        const matched = await v.check();
        if (!matched) {
            req.flash('error', Object.values(v.errors).map(err => err.message))
            return res.redirect('/admin/blog')
        }
        const { title,category,data } = req.body;
        
        const finddoct = await blogmodel.findOne({  title: title })
        if (finddoct) {
            req.flash('error', 'This Blog is alrady in our database')
            return res.redirect('/admin/blog')
        }            
        const createuser = await new blogmodel({
            title,category,data
        })
        // Handle uploaded file (if any)
        if (req.file) {
            createuser.image = req.file.path
        }
        await createuser.save()
        req.flash('success', 'Blog Add Sucessfully')
        return res.redirect('/admin/blog')

    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
}
async updateblogpage(req,res){
    try{
        const id=req.params.id
        const data=await blogmodel.findById(id)
       
     
        res.render('admin_page/Blog/update_blog',{
            user:req.user,title:'Blog Page -Lifeline',id,data,
        })
    }catch(err){
        console.log(err)
    }
}  
async blogupdata(req,res){
  
        try {
            const id=req.params.id
            const v = new Validator(req.body, {
                title: "required|string|minLength:3",
                category: "required|string|minLength:3", 
                data: "required|minLength:10", 
            });
            const matched = await v.check();
 
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                
                return res.redirect(`/admin/updateblog/${id}`)
            }
            const { title,category,data } = req.body;
            
            if(req.file){
                image = req.file.path
                const user = await blogmodel.findByIdAndUpdate(id,{
                    title,category,data,image
                }) 
                req.flash('success', 'Department Update Sucessfully')
                return res.redirect('/admin/blog') 
            }else{
                const user = await blogmodel.findByIdAndUpdate(id,{
                    title,category,data
                })

                req.flash('success', 'Department Update Sucessfully')
                return res.redirect('/admin/blog') 
            }

        } catch (error) {
          
            console.log(error)
            return res.redirect('/error')
        }

    }
    async blogdelete(req, res) {
        try {
            const id = req.params.id           
            const deletedata = await blogmodel.findByIdAndUpdate(id, {
                isDeleted: 'true'
            });
            req.flash('success', 'Blog Sucessfuly Detete');
            return res.redirect('/admin/blog')
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    // blog comment display
    async blogcommentdisplay(req, res) {
        try {
          const data=await Comment.aggregate([
           
            {
                $lookup:{
                    from:'usermodels',
                    localField:'commentuserid',
                    foreignField:'_id',
                    as:'user_comment'
                }
            },{
                $unwind:'$user_comment'
            },{
                $lookup:{
                    from:'blogmodels',
                    localField:'commentcatagoryid',
                    foreignField:'_id',
                    as:'user_comment_blog'
                }
            },
            {
                $unwind:'$user_comment_blog'
            },{
                $project:{
                   commentid:"$_id",
                   comment:"$comment",
                   user:"$user_comment.name",
                   userid:"$user_comment._id",
                   commentdate:"$createdAt",
                   blog:"$user_comment_blog.category",
                   image:"$user_comment.image",
                   commentisdelete:"$isdelete",
                   userisdellete:"$user_comment.isadmindelete",
                   useremail:"$user_comment.email"
                }
            }
          ])
          return res.render('admin_page/blog/blogcommets',{
            user:req.user,title:'Blogcomments Page -Lifeline',data
          })
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    async blogcommentdelete(req,res){
        try{
            const id=req.params.id;
            const commentdata=await Comment.findById(id)
            const userid=commentdata.commentuserid.toString()
            const userdata=await usermodel.findById(userid)
            const info=await transporter.sendMail({
                from: `Lifeline Hospital ${process.env.EMAIL_FROM}`, // sender address
                    to: userdata.email, // list of receivers
                    subject: "Hello ✔", // Subject line
                    html:`<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8" />
                        <title>Final Warning: Wrong Comment</title>
                        <style>
                            body {
                            font-family: 'Helvetica Neue', sans-serif;
                            background-color: #f2f2f2;
                            padding: 30px;
                            }
                            .container {
                            max-width: 600px;
                            margin: auto;
                            background: #fff;
                            padding: 25px 30px;
                            border-radius: 10px;
                            border: 1px solid #e0e0e0;
                            }
                            .header {
                            font-size: 22px;
                            font-weight: bold;
                            color: #c0392b;
                            }
                            .content {
                            margin-top: 15px;
                            font-size: 16px;
                            color: #333;
                            line-height: 1.6;
                            }
                            .comment-box {
                            margin: 20px 0;
                            padding: 15px;
                            background-color: #fef1f1;
                            border-left: 4px solid #c0392b;
                            font-style: italic;
                            color: #444;
                            }
                            .alert {
                            font-weight: bold;
                            color: #b30000;
                            }
                            .footer {
                            margin-top: 30px;
                            font-size: 14px;
                            color: #777;
                            }
                            .signature {
                            margin-top: 20px;
                            font-weight: bold;
                            color: #444;
                            }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <div class="header">🚨 Final Warning: Wrong Information Shared</div>
                            <div class="content">
                            Dear <strong>${userdata.name}</strong>,<br><br>

                            We've noticed that your recent comment contains incorrect or misleading information, which goes against our platform's community standards.

                            <div class="comment-box">
                                ${commentdata.comment}
                            </div>

                            Such behavior negatively impacts the quality of discussions and misleads other users.

                            <p class="alert">⚠️ If you repeat this behavior, your account will be permanently deleted without further warning.</p>

                            We urge you to follow our community guidelines and ensure that your future comments are accurate, respectful, and constructive.<br><br>

                            If you have any questions or believe this message was sent in error, please reply to this email or contact our support team.

                            </div>
                            <div class="signature">
                            Sincerely,<br>
                            The Lifeline Team
                            </div>
                            <div class="footer">
                            Need help? Contact us at <a href="mailto:support@lifeliine.com">support@lifeline.com</a>
                            </div>
                        </div>
                        </body>
                        </html>
                        `
            })
            if(info){
                const updatecomment=await Comment.findByIdAndUpdate(id,{
                    isdelete:true
                })
                req.flash('success',"comment detete Sucessfully")
            }
            
            req.flash('error',"Comment Not Delete Error Occourd")
           return res.redirect('/admin/blogcomments')
        }catch(err){
            console.log(err)
            return res.redirect('/error')
        }
    }
    async adminuseraccountdelete(req,res){
        try{
            const id=req.params.id;
            const userdata=await usermodel.findById(id)
            const info=await transporter.sendMail({
                from: `Lifeline Hospital ${process.env.EMAIL_FROM}`, // sender address
                    to: userdata.email, // list of receivers
                    subject: "Hello ✔", // Subject line
                    html:`<!DOCTYPE html>
                            <html lang="en">
                            <head>
                            <meta charset="UTF-8" />
                            <title>Account Deleted - Policy Violation</title>
                            <style>
                                body {
                                font-family: 'Segoe UI', sans-serif;
                                background-color: #f9f9f9;
                                padding: 30px;
                                }
                                .container {
                                max-width: 600px;
                                margin: auto;
                                background: #ffffff;
                                padding: 30px;
                                border: 1px solid #e0e0e0;
                                border-radius: 10px;
                                }
                                .header {
                                font-size: 24px;
                                color: #b30000;
                                font-weight: bold;
                                margin-bottom: 15px;
                                }
                                .content {
                                font-size: 16px;
                                color: #333;
                                line-height: 1.6;
                                }
                                .comment-box {
                                margin: 20px 0;
                                padding: 15px;
                                background-color: #fff3f3;
                                border-left: 4px solid #c0392b;
                                font-style: italic;
                                color: #555;
                                }
                                .alert {
                                color: #a80000;
                                font-weight: bold;
                                margin-top: 10px;
                                }
                                .footer {
                                margin-top: 30px;
                                font-size: 14px;
                                color: #777;
                                }
                                .signature {
                                margin-top: 20px;
                                font-weight: bold;
                                color: #444;
                                }
                            </style>
                            </head>
                            <body>
                            <div class="container">
                                <div class="header">❌ Account Deleted: Repeat Policy Violation</div>
                                <div class="content">
                                Dear <strong>${userdata.name}</strong>,<br><br>

                                Your account has been permanently deleted from our platform due to a second violation of our community standards.<br><br>

                                The following comment was flagged as misleading or inappropriate:

                                

                                You had previously received a warning for a similar violation. As clearly stated, repeated offenses result in account deletion.<br><br>

                                <p class="alert">This action is final and your access to the platform has been revoked.</p>

                                If you believe this was a mistake or have any concerns, you may contact our support team for a final review.
                                </div>

                                <div class="signature">
                                Regards,<br>
                                The Lifeline Team
                                </div>
                                <div class="footer">
                                Need help? Contact us at <a href="mailto:support@example.com">lifeline@gmail.com</a>
                                </div>
                            </div>
                            </body>
                            </html>
                            `
            })
            const updatecomment=await usermodel.findByIdAndUpdate(id,{
                isadmindelete:true
            })
            req.flash('success',"User Account detete Sucessfully")
           return res.redirect('/admin/blogcomments')
        }catch(err){
            console.log(err)
            return res.redirect('/error')
        }
    }
    async adminuseraccountrestore(req,res){
        try{
            const id=req.params.id;
            const updatecomment=await usermodel.findByIdAndUpdate(id,{
                isadmindelete:false
            })
            req.flash('success',"User Account Restore Sucessfully")
           return res.redirect('/admin/blogcomments')
        }catch(err){
            console.log(err)
            return res.redirect('/error')
        }
    }

}




module.exports = new blogController();