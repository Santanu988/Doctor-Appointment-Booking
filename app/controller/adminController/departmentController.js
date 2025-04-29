const { Validator } = require('node-input-validator');
const { hasepassword } = require('../../middlewire/authorization');
const usermodel = require('../../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctormodel = require('../../model/doctor')
const deptmodel=require('../../model/depertment')

const fs=require('fs')
class departmentController{

    // display add depertment page
    async add_department_page(req, res) {
        try {
            return res.render('admin_page/Department/add_depertment_page', {title:"Add Department - Lifeline",
                user:req.user,isdep:true
            })
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }


     // add departmet data im mongdb
     async depaertment_data_add(req, res) {
        try {
            
            const v = new Validator(req.body, {
                data: "required|minLength:10",
                name: "required|string|minLength:3|maxLength:30",
                isDept: "required|minLength:4", 
            });
            const matched = await v.check();
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                return res.redirect('/admin/adddeperment')
            }
            const { data, name, isDept } = req.body;
            
            const finddoct = await deptmodel.findOne({ name:name })
            if (finddoct) {
                req.flash('error', 'This Department is alrady in our database')
                return res.redirect('/admin/adddeperment')
            }            
            const createuser = await new deptmodel({
                data, name, isDept
            })
            // Handle uploaded file (if any)
            if (req.file) {
                createuser.image = req.file.path
            }
            await createuser.save()
            req.flash('success', 'Department Add Sucessfully')
            return res.redirect('/admin/adddeperment')

        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
     
     
  
    // show department table
    async Show_department_page(req, res) {

        try { 
            const deptdata=await deptmodel.find({ $and: [{isDept:'Department'}, {isDeleted: false}]});
            return res.render('admin_page/Department/departments', {title:"Show Department - Lifeline",
                user:req.user,deptdata,isdep:true

            })
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }

    // show department table
    async show_update_department_page(req, res) {
        try {
            const id=req.params.id
            const data=await deptmodel.findById(id)
            return res.render('admin_page/Department/update_depertment_page', {title:"Update Department Data - Lifeline",
                user:req.user,data,isdep:true
            })
        } catch (err) {
            console.log(err)
        }
    }
    // update department data
    async depaertment_data_update(req, res) {
        try {
            const id=req.params.id
            const v = new Validator(req.body, {
                data: "required|minLength:10",
                name: "required|string|minLength:3|maxLength:30",
                isDept: "required|minLength:4", 
            });
            const matched = await v.check();
 
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                
                return res.redirect(`/admin/updatedepartmentdata/${id}`)
            }
            const { data, name, isDept } = req.body;  
            
            if(req.file){
                image = req.file.path
                const user = await deptmodel.findByIdAndUpdate(id,{
                    data, name, isDept,image
                }) 
                req.flash('success', 'Department Update Sucessfully')
                return res.redirect('/admin/deperments') 
            }else{
                const user = await deptmodel.findByIdAndUpdate(id,{
                    data, name, isDept
                })

                req.flash('success', 'Department Update Sucessfully')
                return res.redirect('/admin/deperments') 
            }

        } catch (error) {
          
            console.log(error)
            return res.redirect('/error')
        }

    }

    // softdelete depertment data
    async deletedepertment(req, res) {
        try {
            const id = req.params.id
            const finddata = await deptmodel.findById(id)
            if (!finddata) {
                req.flash('error', 'Depertment Not Found');
                return res.redirect('/admin/deperments')
            }
            const deletedata = await deptmodel.findByIdAndUpdate(id, {
                isDeleted: 'true'
            });
            req.flash('success', 'Depertment Sucessfuly Detete');
            return res.redirect('/admin/deperments')
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }

    
}




module.exports = new departmentController();