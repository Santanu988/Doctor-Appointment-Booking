const { Validator } = require('node-input-validator');
const { hasepassword } = require('../../middlewire/authorization');
const usermodel = require('../../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctormodel = require('../../model/doctor')
const fs = require('fs')
const moment = require("moment");
const departmentmodel = require('../../model/depertment');

class doctorController{
       // show doctor adding page
       async add_doctor_page(req, res) {
        try {
            // Example: Admin-defined available days (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
                // const allowedDays = [1, 3, 5]; // Monday, Wednesday, Friday

                // // Function to get the next available date for a given day
                // function getNextAvailableDate(day) {
                //     const today = moment();
                //     let nextDate = today.clone().day(day);

                //     // If today is the same day but past business hours, move to next week
                //     if (nextDate.isBefore(today, "day")) {
                //         nextDate.add(7, "days");
                //     }

                //     return nextDate.format("YYYY-MM-DD");
                // }
                // const availableDates = allowedDays.map(getNextAvailableDate);
              
            const depertment=await departmentmodel.aggregate([
               {
                $match:{
                 isDept:'Department' ,isDeleted: false
                }
               },
                {
                    $group:{
                        _id:"$name"
                    }
                }
            ])
          
            const user = req.user;
            return res.render('admin_page/Doctor/add_doctorpage', { title: " Doctor's Data Adding Page - Lifeline", user,depertment })
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }

    // add doctor data im mongdb
    async doctorinfostore(req, res) {
        try {
            const v = new Validator(req.body, {
                introduction: "required|minLength:10",
                name: "required|string|minLength:3|maxLength:30",
                email: "required|email",
                phone: "required|integer|minLength:10|maxLength:10",
                university: "required|minLength:1",
                experience: "required|minLength:1|min:0",
                passing_year: "required|minLength:4",
                day: "required|minLength:1",
                time: "required|minLength:1",
                degree: "required|minLength:1",
                message: "required|minLength:10",
                gander: "required|minLength:4"
            });
            const matched = await v.check();
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                return res.redirect('/admin/adddoctor')
            }
            const { introduction, name, phone, email, department, university, experience, passing_year, degree, message, gander } = req.body;
            //     const educationDetails = Array.isArray(university)
            // ? university.map((uni, index) => ({
            //     university: uni,
            //     passing_year: passing_year[index],
            //     degree: degree[index],
            // }))
            // : [];
            const finddoct = await doctormodel.findOne({ email: email })
            if (finddoct) {
                req.flash('error', 'Doctor email is alrady in our database')
                return res.redirect('/admin/adddoctor')
            }
            const educationDetails = [];
            if (Array.isArray(university)) {
                for (let i = 0; i < university.length; i++) {
                    educationDetails.push({
                        university: university[i],
                        passing_year: passing_year[i],
                        degree: degree[i],
                    });
                }
            } else {
                educationDetails.push({
                    university,
                    passing_year,
                    degree,
                });
            }

            const shiftDayAndTime = req.body.day.map((day, index) => ({
                day,
                time: req.body.time[index]
            }));

            const createuser = await new doctormodel({
                introduction, name, phone, email, department, date_and_time: shiftDayAndTime, experience, education: educationDetails, message, gander
            })
            // Handle uploaded file (if any)
            if (req.file) {
                createuser.image = req.file.path
            }
            await createuser.save()
            req.flash('success', 'Doctor Add Sucessfully')
            return res.redirect('/admin/adddoctor')

        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }

    }

    // Show doctor list page
    async show_doctor_page(req, res) {
        try {
            const user = req.user;
            const doctodata = await doctormodel.find({ isdelete: false })
            return res.render('admin_page/Doctor/show_doctor', { user, doctodata, title: "Show Doctor's List - Lifeline" })
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // display update doctor page
    async update_doctor_page(req, res) {
        try {
            const user = req.user;
            const id = req.params.id
            const doctodata = await doctormodel.findOne({ _id: id })
            return res.render('admin_page/Doctor/doctor_update', { user, doctodata, title: "Update Doctor Page - Lifeline" })
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }

    // update doctor info in mongodb

    async update_doctor(req, res) {
        try {

            const { introduction, name, phone, email, department, university, experience, passing_year, degree, message, gander, day, time } = req.body;
            //     const educationDetails = Array.isArray(university)
            // ? university.map((uni, index) => ({
            //     university: uni,
            //     passing_year: passing_year[index],
            //     degree: degree[index],
            // }))
            // : [];
            const id = req.params.id;

            const finddoct = await doctormodel.findOne({ _id: id })

            if (!finddoct) {
                req.flash('error', 'Doctor is not in our database')
                return res.redirect(`/admin/adddoctor/${id}`)
            }

            // const educationDetails = Array.isArray(university)
            // ? university.map((uni, index) => ({
            //     university: uni,
            //     passing_year: passing_year[index],
            //     degree: degree[index],
            // }))
            // : [];
            if (req.file) {
                if (editProducts.image) {
                    fs.unlink((editProducts.image), function (err) {
                        if (err) throw err
                    })
                }
                const image = req.file.path
                if (((department.length >= 2) && (university.length >= 2) && (passing_year.length >= 2) && (time.length >= 2) && (day.length >= 2))) {

                    const educationDetails = [];
                    if (Array.isArray(university)) {
                        for (let i = 0; i < university.length; i++) {
                            educationDetails.push({
                                university: university[i],
                                passing_year: passing_year[i],
                                degree: degree[i],
                            });
                        }
                    } else {
                        educationDetails.push({
                            university,
                            passing_year,
                            degree,
                        });
                    }
                    const shiftDayAndTime = req.body.day.map((day, index) => ({
                        day,
                        time: req.body.time[index]
                    }));

                    const dpdatedata = await doctormodel.findByIdAndUpdate(id, {
                        introduction, name, phone, email, department, date_and_time: shiftDayAndTime, experience, education: educationDetails, message, gander, image
                    })
                    req.flash('success', 'Doctor Update Sucessfully')
                    return res.redirect('/admin/showdoctor')
                } else if (((department.length >= 2) && (university.length >= 2) && (passing_year.length >= 2))) {

                    const educationDetails = [];
                    if (Array.isArray(university)) {
                        for (let i = 0; i < university.length; i++) {
                            educationDetails.push({
                                university: university[i],
                                passing_year: passing_year[i],
                                degree: degree[i],
                            });
                        }
                    } else {
                        educationDetails.push({
                            university,
                            passing_year,
                            degree,
                        });
                        const dpdatedata = await doctormodel.findByIdAndUpdate(id, {
                            introduction, name, phone, email, department, experience, education: educationDetails, message, gander, image
                        })
                        req.flash('success', 'Doctor Update Sucessfully')
                        return res.redirect('/admin/showdoctor')
                    }

                } else if (((time.length >= 2) && (day.length >= 2))) {

                    const shiftDayAndTime = req.body.day.map((day, index) => ({
                        day,
                        time: req.body.time[index]
                    }));

                    const dpdatedata = await doctormodel.findByIdAndUpdate(id, {
                        introduction, name, phone, email, department, date_and_time: shiftDayAndTime, experience, message, gander, image
                    })
                    req.flash('success', 'Doctor Update Sucessfully')
                    return res.redirect('/admin/showdoctor')

                } else {
                    const dpdatedata = await doctormodel.findByIdAndUpdate(id, {
                        introduction, name, phone, email, department, experience, message, gander, image
                    })
                    req.flash('success', 'Doctor Update Sucessfully')
                    return res.redirect('/admin/showdoctor')
                }

            } else {
                if (((department.length >= 2) && (university.length >= 2) && (passing_year.length >= 2) && (time.length >= 2) && (day.length >= 2))) {

                    const educationDetails = [];
                    if (Array.isArray(university)) {
                        for (let i = 0; i < university.length; i++) {
                            educationDetails.push({
                                university: university[i],
                                passing_year: passing_year[i],
                                degree: degree[i],
                            });
                        }
                    } else {
                        educationDetails.push({
                            university,
                            passing_year,
                            degree,
                        });
                    }
                    const shiftDayAndTime = req.body.day.map((day, index) => ({
                        day,
                        time: req.body.time[index]
                    }));

                    const dpdatedata = await doctormodel.findByIdAndUpdate(id, {
                        introduction, name, phone, email, department, date_and_time: shiftDayAndTime, experience, education: educationDetails, message, gander
                    })
                    req.flash('success', 'Doctor Update Sucessfully')
                    return res.redirect('/admin/showdoctor')
                } else if (((department.length >= 2) && (university.length >= 2) && (passing_year.length >= 2))) {

                    const educationDetails = [];
                    if (Array.isArray(university)) {
                        for (let i = 0; i < university.length; i++) {
                            educationDetails.push({
                                university: university[i],
                                passing_year: passing_year[i],
                                degree: degree[i],
                            });
                        }
                    } else {
                        educationDetails.push({
                            university,
                            passing_year,
                            degree,
                        });
                        const dpdatedata = await doctormodel.findByIdAndUpdate(id, {
                            introduction, name, phone, email, department, experience, education: educationDetails, message, gander
                        })
                        req.flash('success', 'Doctor Update Sucessfully')
                        return res.redirect('/admin/showdoctor')
                    }

                } else if (((time.length >= 2) && (day.length >= 2))) {

                    const shiftDayAndTime = req.body.day.map((day, index) => ({
                        day,
                        time: req.body.time[index]
                    }));

                    const dpdatedata = await doctormodel.findByIdAndUpdate(id, {
                        introduction, name, phone, email, department, date_and_time: shiftDayAndTime, experience, message, gander
                    })
                    req.flash('success', 'Doctor Update Sucessfully')
                    return res.redirect('/admin/showdoctor')

                } else {
                    const dpdatedata = await doctormodel.findByIdAndUpdate(id, {
                        introduction, name, phone, email, department, experience, message, gander
                    })
                    req.flash('success', 'Doctor Update Sucessfully')
                    return res.redirect('/admin/showdoctor')
                }
            }

        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }

    }

    // softdelete doctor data
    async deletedoctor(req, res) {
        try {
            const id = req.params.id
            const finddata = await doctormodel.findById(id)
            if (!finddata) {
                req.flash('error', 'Doctor Not Found');
                return res.redirect('/admin/showdoctor')
            }
            const deletedata = await doctormodel.findByIdAndUpdate(id, {
                isdelete: 'true'
            });
            req.flash('success', 'Doctor Sucessfuly Detete');
            return res.redirect('/admin/showdoctor')
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    // show avalabe doctor list or active doctor list
    async show_active_doctor_list(req, res) {
        try {
            const user = req.user;
            const doctodata = await doctormodel.find({ isavalable: true })
            return res.render('admin_page/Doctor/doctor_list_avalable_inavalable', { user, doctodata, title: "Show Active Docior's List -Lifeline", ac: true })
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // show unavalabe doctor list or active doctor list
    async show_inactive_doctor_list(req, res) {
        try {
            const user = req.user;
            const doctodata = await doctormodel.find({ isavalable: false })
            return res.render('admin_page/Doctor/doctor_list_avalable_inavalable', { user, doctodata, title: "Show Inactive Docior's List -Lifeline", ac: false })
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // status changer
    async change_stutas(req, res) {
        try {
            const id = req.params.id
            const doctorfind = await doctormodel.findById(id)
            if (doctorfind.isavalable) {
                const statusupdate = await doctormodel.findByIdAndUpdate(id, {
                    isavalable: false
                })
                req.flash('success', 'Doctor Inactive Sucessfully')
                return res.redirect('/admin/activedoctor')
            } else {
                const statusupdate = await doctormodel.findByIdAndUpdate(id, {
                    isavalable: true
                })
                req.flash('success', 'Doctor Active Sucessfully')
                return res.redirect('/admin/inactivedoctor')
            }
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }

}
module.exports=new doctorController()