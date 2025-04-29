
const { Validator } = require('node-input-validator');
const { hasepassword } = require('../../middlewire/authorization');
const usermodel = require('../../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctormodel = require('../../model/doctor')
const deptmodel=require('../../model/depertment')


class serviceController{
    // show Services table
    async add_servises_page(req, res) {
        try {
            return res.render('admin_page/Department/add_depertment_page', {title:"Add Servises - Lifeline",
                user:req.user,isdep:false
            })
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    // show servises table
    async Show_services_page(req, res) {
        try { const deptdata=await deptmodel.find({ $and: [{isDept:'Services'}, {isDeleted: false}]});
            return res.render('admin_page/Department/departments', {title:"Show Services - Lifeline",
                user:req.user,deptdata,isdep:false

            })
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    // add Services data im mongdb
    async services_data_add(req, res) {
        try {
            // if(uploadError==null)
            // {
            //     req.flash('error', 'im')
            //     return res.redirect('/admin/adddeperment')
            // }
            const v = new Validator(req.body, {
                data: "required|minLength:10",
                name: "required|string|minLength:3|maxLength:30",
                isDept: "required|minLength:4", 
            });
            const matched = await v.check();
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                return res.redirect('/admin/addservises')
            }
            const { data, name, isDept } = req.body;
            
            const finddoct = await deptmodel.findOne({ name:name })
            if (finddoct) {
                req.flash('error', 'This Services is alrady in our database')
                return res.redirect('/admin/addservises')
            }            
            const createuser = await new deptmodel({
                data, name, isDept
            })
            // Handle uploaded file (if any)
            if (req.file) {
                createuser.image = req.file.path
            }
            await createuser.save()
            req.flash('success', 'Services Add Sucessfully')
            return res.redirect('/admin/addservises')

        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // show Service table
    async show_update_service_page(req, res) {
        try {
            const id=req.params.id
            const data=await deptmodel.findById(id)
            return res.render('admin_page/Department/update_depertment_page', {title:"Update Service Data - Lifeline",
                user:req.user,data,isdep:false
            })
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    // update services data
    async service_data_update(req, res) {
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
                
                return res.redirect(`/admin/updateservicedata/${id}`)
            }
            const { data, name, isDept } = req.body;
            
            
            if(req.file){
                image = req.file.path
                const user = await deptmodel.findByIdAndUpdate(id,{
                    data, name, isDept,image
                }) 
                req.flash('success', 'Services Update Sucessfully')
                return res.redirect(`/admin/servises`) 
            }else{
                const user = await deptmodel.findByIdAndUpdate(id,{
                    data, name, isDept
                })

                req.flash('success', 'Services Update Sucessfully')
                return res.redirect(`/admin/servises`) 
            }

        } catch (error) {
          
            console.log(error)
            return res.redirect('/error')
        }

    }
     // softdelete service data
     async deleteservices(req, res) {
        try {
            const id = req.params.id
            const finddata = await deptmodel.findById(id)
            if (!finddata) {
                req.flash('error', 'Services Not Found');
                return res.redirect('/admin/servises')
            }
            const deletedata = await deptmodel.findByIdAndUpdate(id, {
                isDeleted: 'true'
            });
            req.flash('success', 'Services Sucessfuly Detete');
            return res.redirect('/admin/servises')
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    //  async show_single_dept_service_page(req,res){
    //     try{
    //         const data=
    //     }catch(err){
    //         console.log(err)
    //     }
    //  }
}




module.exports = new serviceController();