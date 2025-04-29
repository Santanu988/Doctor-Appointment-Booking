const { Validator } = require('node-input-validator');
const { hasepassword } = require('../../middlewire/authorization');
const usermodel = require('../../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctormodel = require('../../model/doctor')
const deptmodel = require('../../model/depertment')
const appointmentmodel = require('../../model/appoiment')
const { name } = require('ejs');
const transporter = require('../../config/emailComfig');
const fs = require("fs");
const path = require("path");
const { generatePDF } = require('../../helper/pdfhelper');
class appointmentController {


    async patient_list(req, res) {
        try {
            const apptDetails = await appointmentmodel.find({
                isdelete: false,
            }).sort({  appt_Date: -1 });
            return res.render('admin_page/patient/patient_details', {
                title: "Add Department - Lifeline",
                user: req.user, apptDetails
            })

        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    // for approved status
    async changeToApproved(req, res) {

        try {

            const id = req.params.id;
           
            const findApptDetails = await appointmentmodel.findById(id);
            console.log(findApptDetails)
            const email=findApptDetails.email
            if (!findApptDetails) {
                req.flash('error', 'No data is exit!!');
               return res.redirect('/admin/showappoiments');
            }

            if (findApptDetails.isApproved == 'Approved') {
                req.flash('error', 'Appointment allredy Approved!!');
               return res.redirect('/admin/showappoiments');
            }
            // if (findApptDetails.isApproved == 'Reject') {
            //     req.flash('error', "Appointment Is Reject you Can't  Approved!!");
            //    return res.redirect('/admin/showappoiments');
            // }
            if (findApptDetails.isApproved == 'Resolved') {
                req.flash('error', "Appointment Is Resolved you Can't Approved!!");       
                res.redirect('/admin/showappoiments');
            }
            
                // const doc= new pdf()
                // doc.pipe(fs.createWriteStream('output.pdf'))
                const fileName = `approved_appt_${findApptDetails.name}_${Date.now()}.pdf`;
                const filepath="pdfs"
                const pdfPath = path.join(filepath, fileName);
                const pdf=generatePDF(findApptDetails,fileName)
                const info = await transporter.sendMail({
                    from: `Lifeline Hospital ${process.env.EMAIL_FROM}`, // sender address
                    to: email, // list of receivers
                    subject: "Hello ✔", // Subject line
                    html: `<!DOCTYPE html>
                                <html>
                                <head>
                                <meta charset="UTF-8">
                                <title>Appointment Approved</title>
                                <style>
                                    body {
                                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                    background-color: #f0f2f5;
                                    margin: 0;
                                    padding: 0;
                                    }
                                    .container {
                                    max-width: 600px;
                                    margin: 40px auto;
                                    padding: 30px;
                                    background-color: #ffffff;
                                    border-radius: 10px;
                                    box-shadow: 0 0 10px rgba(0,0,0,0.05);
                                    }
                                    h2 {
                                    color: #28a745;
                                    }
                                    p {
                                    color: #333;
                                    line-height: 1.6;
                                    }
                                    .details {
                                    background-color: #f8f9fa;
                                    padding: 20px;
                                    border-left: 5px solid #28a745;
                                    border-radius: 5px;
                                    margin-top: 20px;
                                    }
                                    .footer {
                                    text-align: center;
                                    color: #888;
                                    font-size: 13px;
                                    margin-top: 30px;
                                    }
                                </style>
                                </head>
                                <body>
                                <div class="container">
                                    <h2>Appointment Approved</h2>
                                    <p>Dear <strong>${findApptDetails.name}</strong>,</p>

                                    <p>Your appointment with <strong>${findApptDetails.doctor}</strong> at <strong>Lifeline Hospital</strong> has been <strong>approved</strong>.</p>

                                    <div class="details">
                                    <p><strong>Patient Name:</strong> ${findApptDetails.name}</p>
                                    <p><strong>Department:</strong> ${findApptDetails.dept}</p>
                                    <p><strong>Doctor:</strong> ${findApptDetails.doctor}</p>
                                    <p><strong>Appointment Date:</strong> ${findApptDetails.date}</p>
                                    <p><strong>Time:</strong> ${findApptDetails.time}</p>
                                    <p><strong>Booking ID:</strong>LL${findApptDetails._id}</p>
                                    </div>

                                    <p>Please ensure to arrive at the clinic at least 10 minutes before your scheduled time. If you need to cancel or reschedule, contact us at [Phone Number] or reply to this email.</p>

                                    <p>Thank you for choosing <strong>Lifeline</strong>.</p>

                                    <div class="footer">
                                    <p>Lifeline | Lifelinesupport@gmail.com | +9 15683549872 | www.lifeline.com </p>
                                    </div>
                                </div>
                                </body>
                                </html>
                                `, // html body
                                attachments: [
                                    {
                                      filename: fileName,
                                      path: path.resolve(pdfPath), // absolute path to PDF
                                      contentType: "application/pdf"
                                    }
                                  ]
                  });
                  if(!info){
                    req.flash('error', "Email not found!!");     
                    return res.redirect('/admin/showappoiments');
                  }
                  if (findApptDetails.isApproved == 'Pending' || findApptDetails.isApproved == 'Reject') {                    
                    await appointmentmodel.findByIdAndUpdate(id, {
                        isApproved: "Approved"
                    });
                req.flash('success', 'Appointment has been approved!!');
               return res.redirect('/admin/showappoiments');

            }

        } catch (err) {
            console.log(err);
            req.flash('error', "Email not found!!");     
            return res.redirect('/admin/showappoiments');

        }
    }


    // for reject status

    async changeToReject(req, res) {

        try {


            const id = req.params.id;
            const findApptDetails = await appointmentmodel.findById(id);
            const email=findApptDetails.email
            if (!findApptDetails) {
                req.flash('error', 'No data is exit!!');
              return  res.redirect('/admin/showappoiments');
            }
            if (findApptDetails.isApproved == 'Reject') {
                req.flash('error', 'Appointment allredy rejected!!');
               return res.redirect('/admin/showappoiments');
            }
            if (findApptDetails.isApproved == 'Resolved') {
                req.flash('error', "Appointment allredy resolved, You can't reject!!");
               return res.redirect('/admin/showappoiments');
            }
            // if (findApptDetails.isApproved == 'Pending' || findApptDetails.isApproved == 'Approved') {
            //     await appointmentmodel.findByIdAndUpdate(id, {
            //         isApproved: "Reject"
            //     });

            //     req.flash('success', 'Appointment has been rejected!!');
            //    return res.redirect('/admin/showappoiments');

            // }
            return res.render('admin_page/patient/approved_reject_page',{
                user:req.user,tital:"Resolved user Details - Lifeline",findApptDetails ,da:null
            })

        } catch (err) {
            console.log(err);
            return res.redirect('/error')

        }
    }
    async Rejectdatastore(req, res) {

        try {
            const {name,id,phone,admi_msg}=req.body
            const findApptDetails = await appointmentmodel.findById(id);
            const email=findApptDetails.email
            console.log(findApptDetails)
            if (!findApptDetails) {
                req.flash('error', 'No data is exit!!');
              return  res.redirect('/admin/showappoiments');
            }
            
            // if (findApptDetails.isApproved == 'Pending' || findApptDetails.isApproved == 'Approved') {
            //     await appointmentmodel.findByIdAndUpdate(id, {
            //         isApproved: "Reject"
            //     });

            //     req.flash('success', 'Appointment has been rejected!!');
            //    return res.redirect('/admin/showappoiments');

            // }
           await appointmentmodel.findByIdAndUpdate(id,{
            isApproved: "Reject",admi_msg
           })
           const info = await transporter.sendMail({
            from: `Lifeline Hospital${process.env.EMAIL_FROM}`, // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                <title>Appointment Rejected</title>
                <style>
                    body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f5f6f8;
                    margin: 0;
                    padding: 0;
                    }
                    .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 8px rgba(0,0,0,0.1);
                    }
                    h2 {
                    color: #dc3545;
                    }
                    p {
                    font-size: 15px;
                    color: #333;
                    line-height: 1.6;
                    }
                    .reason {
                    background-color: #f8d7da;
                    color: #721c24;
                    padding: 15px;
                    border-left: 5px solid #dc3545;
                    border-radius: 5px;
                    margin: 20px 0;
                    }
                    .details {
                    background-color: #f1f1f1;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    }
                    .footer {
                    font-size: 13px;
                    color: #888;
                    text-align: center;
                    margin-top: 30px;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h2>Appointment Rejected</h2>
                    <p>Dear <strong>${findApptDetails.name}</strong>,</p>

                    <p>We regret to inform you that your appointment request with <strong>${findApptDetails.doctor}</strong> at <strong>Lifeline</strong> has been <strong>rejected</strong>.</p>

                    <div class="details">
                        <p><strong>Patient Name:</strong> ${findApptDetails.name}</p>
                        <p><strong>Department:</strong> ${findApptDetails.dept}</p>
                        <p><strong>Doctor:</strong> ${findApptDetails.doctor}</p>
                        <p><strong>Appointment Date:</strong> ${findApptDetails.date}</p>
                        <p><strong>Time:</strong> ${findApptDetails.time}</p>
                        <p><strong>Booking ID:</strong>LL${findApptDetails._id}</p>
                    </div>

                    <div class="reason">
                    <strong>Reason for Rejection:</strong><br>
                    ${findApptDetails.admi_msg}
                    </div>

                    <p>You may try booking another slot or contact our support team for assistance.</p>

                    <p>We apologize for the inconvenience and appreciate your understanding.</p>

                    <div class="footer">
                        <p>Lifeline | Lifelinesupport@gmail.com | +9 15683549872 | www.lifeline.com </p>
                    </div>
                </div>
                </body>
                </html>
                `, // html body
                        });
           req.flash('success', 'Appointment has been rejected!!');
           return res.redirect('/admin/showappoiments');
        } catch (err) {
            console.log(err);
            return res.redirect('/error')

        }
    }

    // for success

    async changeToResolve(req, res) {

        try {
            const id = req.params.id;
            const findApptDetails = await appointmentmodel.findById(id);
            if (!findApptDetails) {
                req.flash('error', 'No data is exit!!');
               return res.redirect('/admin/showappoiments');
            }

            if (findApptDetails.isApproved == 'Resolved') {
                req.flash('error', 'Appointment allredy resolved!!');
               return res.redirect('/admin/showappoiments');
            }

            if (findApptDetails.isApproved == 'Reject') {
                req.flash('error', 'Appointment has been rejectd!!');
               return res.redirect('/admin/showappoiments');
            }
            if (findApptDetails.isApproved == 'Pending') {
                req.flash('error', "You can't Be change Directely pending to approved!!");
               return res.redirect('/admin/showappoiments');
            }
            // if (findApptDetails.isApproved == 'Pending' || findApptDetails.isApproved == 'Approved') {
            //     await appointmentmodel.findByIdAndUpdate(id, {
            //         isApproved: "Resolved"
            //     });

                // req.flash('success', 'Appointment has been Resolved!!');
            //    return res.redirect('/admin/showappoiments');

            // }
            return res.render('admin_page/patient/approved_reject_page',{
                user:req.user,tital:"Resolved user Details - Lifeline",findApptDetails ,da:1
            })

        } catch (err) {
            console.log(err);
            return res.redirect('/error')

        }
    }
    async Resolveddatastore(req, res) {

        try {
            const {name,id,phone,admi_msg,pres}=req.body
            console.log(id)
            const findApptDetails = await appointmentmodel.findById(id);
            const email=findApptDetails.email
            console.log(findApptDetails)
            if (!findApptDetails) {
                req.flash('error', 'No data is exit!!');
              return  res.redirect('/admin/showappoiments');
            }
            
            // if (findApptDetails.isApproved == 'Pending' || findApptDetails.isApproved == 'Approved') {
            //     await appointmentmodel.findByIdAndUpdate(id, {
            //         isApproved: "Reject"
            //     });

            //     req.flash('success', 'Appointment has been rejected!!');
            //    return res.redirect('/admin/showappoiments');

            // }    
            if(req.file){
                await appointmentmodel.findByIdAndUpdate(id, {
                    isApproved: "Resolved"
                });
            }  else{
                await appointmentmodel.findByIdAndUpdate(id, {
                    isApproved: "Resolved",admi_msg
                });
            } 
            const findApptDeta = await appointmentmodel.findById(id);
            const fileName = `resolved_appt_${findApptDeta.name}_${Date.now()}.pdf`;
            const filepath="pdfs"
            const pdfPath = path.join(filepath, fileName);
            const pdf=generatePDF(findApptDeta,fileName)    
            const info = await transporter.sendMail({
                from: `Lifeline Hospital ${process.env.EMAIL_FROM}`, // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8">
                <title>Appointment Resolved</title>
                <style>
                    body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f0f2f5;
                    margin: 0;
                    padding: 0;
                    }
                    .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 0 8px rgba(0,0,0,0.05);
                    }
                    h2 {
                    color: #17a2b8;
                    }
                    p {
                    font-size: 15px;
                    color: #333;
                    line-height: 1.6;
                    }
                    .reason {
                    background-color: #d1ecf1;
                    color: #0c5460;
                    padding: 15px;
                    border-left: 5px solid #17a2b8;
                    border-radius: 5px;
                    margin: 20px 0;
                    }
                    .details {
                    background-color: #f1f1f1;
                    padding: 15px;
                    border-radius: 5px;
                    margin-bottom: 20px;
                    }
                    .footer {
                    font-size: 13px;
                    color: #888;
                    text-align: center;
                    margin-top: 30px;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <h2>Appointment Status Resolved</h2>
                    <p>Dear <strong>${findApptDetails.name}</strong>,</p>

                    <p>Your appointment status has been updated and successfully resolved. Below are the updated appointment details:</p>

                    <div class="details">
                        <p><strong>Patient Name:</strong> ${findApptDetails.name}</p>
                        <p><strong>Department:</strong> ${findApptDetails.dept}</p>
                        <p><strong>Doctor:</strong> ${findApptDetails.doctor}</p>
                        <p><strong>Appointment Date:</strong> ${findApptDetails.date}</p>
                        <p><strong>Time:</strong> ${findApptDetails.time}</p>
                        <p><strong>Booking ID:</strong>LL${findApptDetails._id}</p>
                    </div>

                    <div class="reason">
                    <strong>Resolution Note:</strong><br>
                     ${admi_msg}         
                    </div>

                    <p>If the new time doesn't work for you, please contact us to make changes or cancel.</p>

                     <p>Thank you for your patience and understanding.</p>

                    <div class="footer">
                        <p>Lifeline | Lifelinesupport@gmail.com | +9 15683549872 | www.lifeline.com </p>
                    </div>
                </div>
                </body>
                </html>

                `,
                attachments: [
                    {
                      filename: fileName,
                      path: path.resolve(pdfPath), // absolute path to PDF
                      contentType: "application/pdf"
                    }
                  ] // html body
              });      
    
        req.flash('success', 'Appointment has been Resolved!!');
        return res.redirect('/admin/showappoiments');
        } catch (err) {
            console.log(err);
            return res.redirect('/error')

        }
    }
}




module.exports = new appointmentController();