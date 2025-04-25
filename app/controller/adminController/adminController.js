const { Validator } = require('node-input-validator');
const { hasepassword } = require('../../middlewire/authorization');
const usermodel = require('../../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctormodel = require('../../model/doctor')
const fs = require('fs')
const moment = require("moment");
const Appointment = require('../../model/appoiment');
class adminController {
    // show admin personal information
    async show_admin_personal_info_page(req, res) {
        try {
            const user = req.user;
            return res.render('admin_page/personal/admin_personal_info', { user, title: "Admin Personal Information - Lifeline" })
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }


    // display admin login page
    async admin_login_page(req, res) {
        try {
            return res.render('admin_page/personal/admin_login_page', {
            })
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }

    // after loging page submit data comes in admin_login
    async admin_login(req, res) {
        try {
            const usertoken=  res.admintoken || req.cookies.admintoken
            if (usertoken) {
                           req.flash('error', "Already login")
                               return res.redirect('/admin/dashboard')            
                       }
            const token1 = res.usertoken || req.cookies.usertoken
            if (token1) {
                req.flash('error', "You already login in Admin Login")
                return res.redirect('/admin/login')
            }
            const v = new Validator(req.body, {
                email: "required|email",
                password: "required|minLength:5",
            });
            const matched = await v.check();
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                return res.redirect('/admin/login')
            }
            const { email, password } = req.body

            const existuser = await usermodel.findOne({ email })
            if (!existuser) {
                req.flash('error', "email dose'n exist on our system")
                return res.redirect('/admin/login')
            }
            const passwordchack = await bcrypt.compare(password, existuser.password)
            if (!passwordchack) {
                req.flash('error', "Password Dose'n Match")
                return res.redirect('/admin/login')
            }
            if (!existuser.isadmin) {
                req.flash('error', "Only Admin Can Login")
                return res.redirect('/admin/login')
            }
            const token = jwt.sign({
                _id: existuser._id,
                name: existuser.name,
                phone: existuser.phone,
                email: existuser.email,
                image: existuser.image,
                altphone:existuser.altphone,
                dateofbirth:existuser.dateofbirth,
                blood_group:existuser.blood_group,
                gender:existuser.gender,
                address:existuser.address,
                maritalstatus:existuser.maritalstatus,
                physical_disability:existuser.physical_disability,
                isadmin: existuser.isadmin
            }, process.env.ADMIN_SECRECT || "SANTANUADMINGMUGNVHVBJSFBUBVGGFGBFGFBF", { expiresIn: '2h' })
            res.cookie('admintoken', token, { maxAge: 7200000, httpOnly: true })
            //   res.cookie('usertoken',token)
            req.flash('success', 'Login Sucessfully')
            return res.redirect('/admin/dashboard')
        } catch (error) {
            req.flash('error', 'Not Register Error occoourd')
            console.log(error)
            return res.redirect('/error')
        }
    }


    // Display Admin Dashboard
    async admin_dashboard_page(req, res) {
        try {
            const totalDoctors = await doctormodel.countDocuments({ isdelete: false });
    
            const departmentStats = await doctormodel.aggregate([
                { $match: { isdelete: false } },
                {
                    $group: {
                        _id: "$department",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        department: "$_id",
                        count: 1,
                        percentage: {
                            $round: [
                                { $multiply: [{ $divide: ["$count", totalDoctors] }, 100] },
                                0
                            ]
                        }
                    }
                },
                { $sort: { count: -1 } }
            ]);
    
            // Area Chart: Monthly Appointments
            const allAppointments = await Appointment.find({ isdelete: false });
            const monthlyAppointments = Array(12).fill(0);
            allAppointments.forEach(app => {
                const month = new Date(app.appt_Date).getMonth();
                monthlyAppointments[month]++;
            });
    
            // Pie Chart: Appointments by Department
            const data = await Appointment.aggregate([
                { $match: { isdelete: false } },
                {
                    $group: {
                        _id: "$dept",
                        count: { $sum: 1 }
                    }
                }
            ]);
           
            const deptLabels = data.map(item => item._id);
            const deptCounts = data.map(item => item.count);
    
            // Appointment status summary
            const [total, pending, completed, cancelled] = await Promise.all([
                Appointment.countDocuments({ isdelete: false }),
                Appointment.countDocuments({ isApproved: "Pending", isdelete: false }),
                Appointment.countDocuments({ isApproved: "Resolved", isdelete: false }),
                Appointment.countDocuments({ isApproved: { $in: ["cancelled", "Reject"] }, isdelete: false }),
            ]);
    
            const user = req.user;
    
            return res.render('admin_page/personal/admin_dashbord', {
                user,
                title: 'Admin Dashboard - Lifeline',
                departmentStats,
                monthlyAppointments: JSON.stringify(monthlyAppointments),
                deptLabels: JSON.stringify(deptLabels),
                deptCounts: JSON.stringify(deptCounts),
                total,
                pending,
                completed,
                cancelled
            });
        } catch (err) {
            console.log(err);
            return res.redirect('/error');
        }
    }
    

    // logout
    async adminlogout(req, res) {
        try {
            req.flash('success', 'Logout Sucessfully');
            res.clearCookie('admintoken')
            return res.redirect('/admin/login')
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }


    // show appoiment table

    async show_appoiments_page(req, res) {
        try {
            const user = req.user;
            const data = await Appointment.find().sort({  appt_Date: -1 });
            return res.render('admin_page/show_appoiments', { user, title: "Show Appoiments Table -Lifeline", data })
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }









    // async show_admin_chang_password_page(req, res) {
    //     try {
    //         const user = req.user;
    //         return res.render('admin_page/admin_password_chang', { user })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    // async show(req, res) {
    //     try {
    //         const user = req.user;
    //         return res.render('admin_page/shosingledoctor_page', { user })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }



    // async admin_change_password(req, res) {
    //     try {
    //         const v = new Validator(req.body, {
    //             email: "required|email",
    //             password: "required|minLength:5",
    //         });
    //         const matched = await v.check();
    //         if (!matched) {
    //             req.flash('error', Object.values(v.errors).map(err => err.message))
    //             return res.redirect('/admin/changepassword')
    //         }
    //         const { email, password, confirm_password } = req.body
    //         if (!(password == confirm_password)) {
    //             req.flash('error', 'password and confirm password not match')
    //             return res.redirect('/admin/changepassword')
    //         }

    //         const existuser = await usermodel.findOne({ email })
    //         if (!existuser) {
    //             req.flash('error', 'email dosenot match');
    //             res.redirect('/admin/changepassword')
    //         }
    //         const hasepass = await hasepassword(password)
    //         const updatepassword = await usermodel.findOneAndUpdate({ email }, {
    //             $set: {
    //                 password: hasepass
    //             }
    //         });
    //         req.flash('success', 'Password Sucessfuly Change');
    //         return res.redirect('/admin/dashboard')
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

}




module.exports = new adminController();