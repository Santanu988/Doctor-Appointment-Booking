const doctormodel=require('../model/doctor')
const depertmentModel=require('../model/depertment');
const blogmodel = require('../model/blog');
const departmentmodel = require('../model/depertment');
const commentModel=require('../model/comment')
const mongoose = require('mongoose');
const { fun } = require('../helper/idConverter');
class apiController{
      // display home page
    async home(req, res) {
        try {
            const user=req.user;
           return res.render('web_pages/home',{user,title:'Home Page  - Lifeline'})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
      // display about page
    async about(req, res) {
        try {
            const user=req.user;
           return res.render('web_pages/about',{user,title:'About Page  - Lifeline'})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    // display services page
    async service(req, res) {
        try {
            const user=req.user;
           
            const servicedata=await depertmentModel.find({isDept:'Services'})
           return res.render('web_pages/servieses',{user,title:'Service Page  - Lifeline',servicedata})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    // display departments page
    async departments(req, res) {
        try {
            const user=req.user;
            const depthdata=await depertmentModel.find({isDept:'Department'})
           return res.render('web_pages/department',{user,title:'Departments Page  - Lifeline',depthdata})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    
    async doctors(req, res) {
        try {
            const user=req.user;
            const doctordata=await doctormodel.find({ isdelete:false})
           return res.render('web_pages/doctor',{user,title:'Doctors Page  - Lifeline',doctordata})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    async singledoctors(req, res) {
        try {
            const user=req.user;
            const id=req.params.id;
            const doctorDetails=await doctormodel.findById(id);
           return res.render('web_pages/doctor_single',{user,title:'Single Doctors Page  - Lifeline',doctorDetails})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    async constactus(req, res) {
        try {
            const user=req.user;
            
           return res.render('web_pages/contactus',{user,title:'Contact Us Page  - Lifeline'})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    async blog(req, res) {
        try {
          const page = parseInt(req.query.page) || 1; 
            const limit = 3; 
            const skip = (page - 1) * limit;
    
            const blogDetails = await blogmodel
                .find({ isDeleted: false })
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(limit);
    
            const totalBlogs = await blogmodel.countDocuments({ isDeleted: false });
            const totalPages = Math.ceil(totalBlogs / limit);
    
            const user=req.user;
           
            const blog = await commentModel.aggregate([
                {
                  $match: {
                    isdelete:false
                  }
                },
                {
                  $group: {
                    _id: "$commentcatagoryid", // group by blog post ID
                    totalComments: { $sum: 1 }
                  }
                },
                {
                    $lookup: {
                      from: "blogmodels", // actual blog collection name
                      localField: "_id",
                      foreignField: "_id",
                      as: "blog"
                    }
                  },
                  {
                    $unwind: "$blog"
                  },
                  {
                    $project: {
                      _id: 0,
                      blogId: "$_id",
                      blogTitle: "$blog.title",
                      blogContent: "$blog.data",       // assuming you store blog content as `content`
                      blogCreatedAt: "$blog.createdAt",
                      blogimage: "$blog.image",
                      blogcatageroy: "$blog.category",
                      totalComments: 1
                    }
                  },
                  {
                    $sort: { blogCreatedAt: -1 } // optional: newest blogs first
                  }
              ]);
            
            
            const depertment  = await departmentmodel.find({ isDeleted: false, isDept: "Department"});
          
           // Extract unique departments
            const departments = [...new Set(depertment .map(doc => doc.name))];

            const result = await commentModel.aggregate([
                {
                  $match: { isdelete: false }
                },
                {
                  $group: {
                    _id: "$commentcatagoryid", // Group by post ID
                    totalComments: { $sum: 1 }
                  }
                },
                {
                  $lookup: {
                    from: "blogmodels",
                    localField: "_id",
                    foreignField: "_id",
                    as: "post"
                  }
                },
                { $unwind: "$post" },
                {
                  $project: {
                    _id: 0,
                    postId: "$_id",
                    postTitle: "$post.title",
                    postCreatedAt: "$post.createdAt",
                    totalComments: 1
                  }
                },
                {
                  $sort: { totalComments: -1 } // optional: sort by most comments
                }
              ]);       

           return res.render('web_pages/blog',{user,title:'Blog Page  - Lifeline',blog,departments,result,currentPage: page,
            totalPages})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
        

    // single blog
    async blogsingle(req, res) {
        try {        
            const user=req.user;
            const uid=req.params.id
            const commentcatagoryid =await fun(uid) 
           const blog=await blogmodel.findById(commentcatagoryid)
           const depertment = await departmentmodel.find({ isDeleted: false, isDept: "Department"});
           // Extract unique departments
           const departments = [...new Set(depertment .map(doc => doc.name))];
           const commentsdata = await commentModel.aggregate([               
            {
                $match: {    
                    commentcatagoryid: new mongoose.Types.ObjectId(commentcatagoryid),              
                    isdelete: false
                }
            },
            {
                $lookup: {
                    from: 'usermodels',
                    localField: 'commentuserid',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: "$user" },
            {
                $lookup: {
                  from: "blogmodels",
                  localField: "commentcatagoryid",
                  foreignField: "_id",
                  as: "post"
                },
            },
            { $unwind: "$post" },
            {
                $project: {
                  _id: 0,
                  comment: 1,
                  createdAt: 1,
                  _id:1,
                  "user.name": 1,
                  "user.email": 1,
                  "user.image": 1,
                  "post.title": 1,
                  "post._id":1
                }
            },
            {
              $group: {
                _id: null,
                comments: { $push: "$$ROOT" },
                totalComments: { $sum: 1 }
              }
            }
            
        ]);
        
        const result = await commentModel.aggregate([
            {
              $match: { isdelete: false }
            },
            {
              $group: {
                _id: "$commentcatagoryid", // Group by post ID
                totalComments: { $sum: 1 }
              }
            },
            {
              $lookup: {
                from: "blogmodels",
                localField: "_id",
                foreignField: "_id",
                as: "post"
              }
            },
            { $unwind: "$post" },
            {
              $project: {
                _id: 0,
                postId: "$_id",
                postTitle: "$post.title",
                postCreatedAt: "$post.createdAt",
                totalComments: 1
              }
            },
            {
              $sort: { totalComments: -1 } // optional: sort by most comments
            }
          ]);      
        // Extract comments and totalComments
        const comments = commentsdata[0]?.comments || [];
        const totalComments = commentsdata[0]?.totalComments || 0;   
           return res.render('web_pages/single_blog',{user,title:'Single Blog Page  - Lifeline',blog,departments, comments,
            totalComments,result})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }

    // comment dat store
    async commenddatastore(req, res) {
        try {
            const catagoryid=req.params.id               
            const user=req.user;
            const id=user._id     
            const {comment}=req.body         
            const commenddata=await new commentModel({               
                commentuserid:id,
                commentcatagoryid:catagoryid,          
                comment
                }).save()
   

            return res.redirect(`/singleblog/${catagoryid}`)
        } catch (err) {
            console.log(err)
        }
    }


// delete comment
    async deleteComment(req,res){
      try{
  
      
          const id = req.params.id;
          const blogId = req.query.blogId;
         
          
          await commentModel.findByIdAndUpdate(id, { 
            isdelete
            : true });
  
          req.flash('success', "Comment has been deleted successfully!!");
          return res.redirect(`/singleblog/${blogId}`);
  
  
      }catch(err){
          console.log(err);
          
      }
  }
    async errorpage(req, res) {
        try {
            const user=req.user;
            
           return res.render('404',{user,title:'Error  - Lifeline'})
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = new apiController();