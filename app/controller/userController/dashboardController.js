const { Validator } = require('node-input-validator');
const { hasepassword } = require('../../middlewire/authorization');
const appointmentmodel = require('../../model/appoiment')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const doctorModel = require('../../model/doctor');
const usermodel=require('../../model/user');
const Appointment = require('../../model/appoiment');
class dashboardController {

    // user change password
    async changpassdord_page_display(req, res) {
        try {
            const user=req.user;
          return res.render('user_pages/user_dashboard/chang_password_page',{user,title:'Appointments Table - Lifeline'})
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // after send data from forgotpage thane cnache password then store in mongodb
    async changepassword(req, res) {
        try {
            const v = new Validator(req.body, {
                email: "required|email",
                password: "required|minLength:5",
            });
            const matched = await v.check();
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                return res.redirect('/dashboard/changepassword')
            }
            const { email, password, confirm_password } = req.body

            if (!(password == confirm_password)) {
                req.flash('error', 'password and confirm password not match')
                return res.redirect('/dashboard/changepassword')
            }

            const existuser = await usermodel.findOne({ email })
            const passchack=await bcrypt.compare(password,existuser.password)
           if(passchack){
            req.flash('error', 'password not be same match');
                return res.redirect('/dashboard/changepassword')
            }
            if (!existuser) {
                req.flash('error', 'email dosenot match');
                return res.redirect('/dashboard/changepassword')
            }
            const hasepass = await hasepassword(password)
            const updatepassword = await usermodel.findOneAndUpdate({ email }, {
                $set: {
                    password: hasepass
                }
            });
            req.flash('success', 'Password Sucessfuly Change');
            return res.redirect('/dashboard/')
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }

     // user account page render
     async account_delete_page(req, res) {
        try {
            const user=req.user;
            return res.render('user_pages/user_dashboard/account_delete',{user,title:'Account Delete Page - Lifeline',name:null})
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
     // user account page render
     async account_delete_data(req, res) {
        try{
               
            if(req.user==null){
                req.flash('error','User is not loggedIn');
                return res.redirect('/dashboard/deleteaccount');
            }
            const{email}= req.body;
            
            const userDetails= await usermodel.findOne({email:email});
            console.log(userDetails.email)
            const id=userDetails._id
          
            if(!email){
                req.flash('error',"Email is required!!");
                return res.redirect(`/dashboard/deleteaccount`)
            }
            if(userDetails.email!==email){
                req.flash('error',"Invalid email!!");
                return res.redirect(`/dashboard/deleteaccount`)
            }
            await usermodel.findByIdAndUpdate(id,
                {
                    isdelete: true
                }
            );
            res.clearCookie('usertoken');
            req.flash('success',"Account deleted successfully!!");
            return res.redirect('/');
    
        }catch(err){
            console.log(err);
            
        }
    }
     // user profile display
     async user_profile_page(req, res) {
        try {
            const user=req.user;
            const id=user._id
            const data=await usermodel.findById(id)
           
            return res.render('user_pages/user_dashboard/dashboard',{user,title:'Dashboard Page - Lifeline',data})
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // user edit profile
    async edit_profile(req, res) {
        try {
           
            const user=req.user;
            console.log(user)
            return res.render('user_pages/user_dashboard/user_edit_profile',{user,title:'Edit Profile - Lifeline'})
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
   
    // upter data update data stode in mongo
    async edit_profile_datastore(req, res) {
        try {
            const v = new Validator(req.body, {
                email: "required|email",
                name: "required|minLength:3",
                phone:"required|minLength:10|maxLength:10",
                altphone:"required|minLength:3|maxLength:10",
                dateofbirth:"required",
                blood_group:"required",
                gender:"required",
                street:"required|minLength:3",
                city:"required|minLength:3",
                state:"required|minLength:3",
                zip:"required|minLength:3",
                country:"required|minLength:3",
                physical_disability:"required",
                maritalstatus:"required"
            });
            const matched = await v.check();
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                return res.redirect('/dashboard/changepassword')
            }
            const { name,email, phone,altphone,dateofbirth,blood_group,gender,street,city,state,zip,country,physical_disability,maritalstatus } = req.body
            
           const address= {street,city,state,zip,country}
            const existuser = await usermodel.findOne({ email })
            const id=existuser._id;
            await usermodel.findByIdAndUpdate(id,{
                name,email, phone,altphone,dateofbirth,blood_group,gender,address,physical_disability,maritalstatus
            })
           
            req.flash('success', 'Profile Sucessfuly Change');
            return res.redirect('/dashboard/profile')
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
   
    // user dashboard display
    async user_Dashboard_page(req, res) {
        try {
            const user=req.user;
            const id=req.user._id
            const data=await Appointment.find({isdelete:false,appuserid:`${id}`})
            return res.render('user_pages/user_dashboard/appionmenttablepage',{user,title:'Dashboard Page - Lifeline',data})
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
   // user appoiments
   async user_appoiments_table(req, res) {
    try {
        const user=req.user;
        const id=req.user._id
       const data=await Appointment.find({isdelete:false,appuserid:`${id}`})
        return res.render('user_pages/user_dashboard/appionmenttablepage',{user,title:'Appointments Table - Lifeline',data})
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
   }
// cancel appiontment
   async user_appoiments_cancel(req, res) {
    try {
        
        const id=req.params.id;
        await appointmentmodel.findByIdAndUpdate(id,{
            isdelete:true
        })
        req.flash('success', 'Appointment Cancel');
        return res.redirect('/dashboard/appointments')
        
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
}

    
}


module.exports = new dashboardController();