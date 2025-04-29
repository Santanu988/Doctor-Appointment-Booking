const { Validator,extend } = require('node-input-validator');
const { hasepassword } = require('../../middlewire/authorization');
const usermodel = require('../../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../../model/doctor');
const appointmentnmodel = require('../../model/appoiment');
const transporter = require('../../config/emailComfig');
const otpModel=require('../../model/otpmodel');
const sendmailverificationotp = require('../../helper/sendmailverifycationotp');
class userController {
    // register user Page
    async register_page_display(req, res) {
        try {
            const user=req.user;
          return res.render('user_pages/user_auth/register',{user,title:'Register Page - Lifeline'})
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // after register data sotore in mongdb
    async user_register(req, res) {
        try {
            const v = new Validator(req.body, {
                name: "required|string|minLength:3|maxLength:30",
                email: "required|email",
                phone: "required|integer|minLength:10|maxLength:10",
                password: "required|minLength:5",
                confirm_password: "required|minLength:5"
            });
            const matched = await v.check();
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                return res.redirect('/register')
            }
            const { name, email, password, confirm_password, phone } = req.body
            if (!(password == confirm_password)) {
                req.flash('error', 'password and confirm password not match')
                return res.redirect('/register')
            }
            const existuser = await usermodel.findOne({ email })
            if (existuser) {
              if(existuser.isdelete==false){
                req.flash('error', 'email alrady exist on our system')
                return res.redirect('/register')
              }else{
                const hasepass = await hasepassword(password)
                const userid= existuser._id;
                if (req.file) {
                  const  image = req.file.path
                    await usermodel.findByIdAndUpdate(userid,{
                        name, phone, password: hasepass,isdelete:false,image:image
                    })
                    req.flash('success', 'Register Sucessfully')
                     return res.redirect('/login')
                }
                
              }
            }
            const hasepass = await hasepassword(password)
            const createuser = await new usermodel({
                name, email, phone, password: hasepass, 
            })
            if (req.file) {
                createuser.image = req.file.path
            }
            const saveuser = await createuser.save()
            req.flash('success', 'Register Sucessfully')
            return res.redirect('/login')
        } catch (error) {
            req.flash('error', 'Not Register Error occoourd')
            console.log(error)
            return res.redirect('/error')
        }
    }
    // login page display
    async login_page_display(req, res){
        try {
            const user=req.user;
          return  res.render('user_pages/user_auth/login',{user,title:'Login Page - Lifeline'})
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // after login data chack from mongdb and authenticate user
    async user_login(req, res) {
        try {
            const usertoken = res.usertoken || req.cookies.usertoken 
            const token1=  res.admintoken || req.cookies.admintoken
            if (token1) {
                req.flash('error', "You already login in Admin Login")
                return res.redirect('/admin/login')
            }
            if (usertoken) {
                req.flash('error', "Already login")
                    return res.redirect('/login')            
            }
            const v = new Validator(req.body, {
                email: "required|email",
                password: "required|minLength:5",
            });
            const matched = await v.check();
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
                return res.redirect('/login')
            }
            const { email, password } = req.body

            const existuser = await usermodel.findOne({ email })
            if (!existuser) {
                req.flash('error', "email dose'n exist on our system")
                return res.redirect('/login')
            }
            if (existuser.isdelete) {
                req.flash('error', "email dose'n exist on our system")
                return res.redirect('/login')
            }
            if (existuser.isadmindelete) {
                req.flash('error', "This email is block because, You Shared Wrong Information in our system ")
                return res.redirect('/login')
            }
            const passwordchack = await bcrypt.compare(password, existuser.password)
            if (!passwordchack) {
                req.flash('error', "Password Dose'n Match")
                return res.redirect('/login')
            }
            if (existuser.isadmin) {
                req.flash('error', "Only User Can Login")
                return res.redirect('/login')
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
            }, process.env.SECRECT || 'SANTANUPASSWORBBCVZXCGCUY', { expiresIn: '2h' })
            res.cookie('usertoken', token, { maxAge: 7200000, httpOnly: true })
            //   res.cookie('usertoken',token)
            req.flash('success', 'Login Sucessfully')
            return res.redirect('/')
        } catch (error) {
            req.flash('error', 'Not Register Error occoourd')
            console.log(error)
            return res.redirect('/error')
        }
    }
    
// user forgot Password
async forgotPassPage(req,res){

    try{

       return res.render('user_pages/user_auth/forgot_pass_otp',{
            user:req.user,
            otpSend: 'false'
        })
    }catch(err){
        console.log(err);
        
    }
}

// send otp
async sendotp(req, res) {
    const { email } = req.body;

    if (!email) {
        req.flash('error', 'email is required');
        return res.redirect('/forgot_Password')
    }
    const existUser = await usermodel.findOne({ email });

    if (!existUser) {
        req.flash('error', 'user not exist');
        return res.redirect('/forgot_Password')
    }
    if (existUser.isadmin) {
        req.flash('error', "Admin can'n Forgot Password");
        return res.redirect('/forgot_Password')
    }
    await sendmailverificationotp(req, existUser);
    req.flash('success', 'otp send successfully to your email');
    return res.render('user_pages/user_auth/forgot_pass_otp',{
        user:req.user,
        email,
        otpSend: 'true'
    })


}


// verify otp

async verifyotp(req, res) {

    const v = new Validator(req.body, {
        otp: "required",
        email: "required|email",
        password: "required|minLength:6",
        confirm_password: "required|minLength:6|same:password"
    });
    
    const matched=await v.check();
    if(!matched){
        req.flash('error',Object.values(v.errors).map(err => err.message));
        return res.redirect('/forgot_password')
    }
    const { otp ,email,password,confirm_password} = req.body;
    
    
    const existinguser = await usermodel.findOne({ email });
   

    const otpverification = await otpModel.findOne({ userid: existinguser._id, otp });
    if (!otpverification) {
        req.flash('error', "invalid otp");
        return res.render('user_pages/user_auth/forgot_pass_otp',{
            user:req.user,
            email,
            otpSend: 'true'
        })
    }

    const currentTime = new Date();
    // 15  60  1000 calculates the expiration period in milliseconds(15 minutes).
    const expirationTime = new Date(otpverification.createAt.getTime() + 15*60*1000);
    if (currentTime > expirationTime) {
        // OTP expired, send new OTP
        req.flash('error',"OTP expired, new OTP sent to your email")
        await sendmailverificationotp(req, existinguser);
        return res.redirect('/forgot_Password')
    }


    const bcryptPassword=await hasepassword(password);
    await usermodel.findOneAndUpdate({email},{
        $set:{

            password:bcryptPassword
        }
    })
   
    req.flash('success','Password cahnge successfully!!')
    res.redirect('/login')

}



    // user dashboard display
    async forgotpassword_page(req, res) {
        try {
            const user=req.user;
            return res.render('user_pages/user_auth/Forgot_password',{user,title:'Forgot Password Page - Lifeline',name:null})
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // 1. Send OTP form after receiving email
async forgotgetdata(req, res) {
    try {
        const {email}=req.body;
        const existuser=await User.findOne({email})
        if(!existuser){
            req.flash('error','user not find')
            res.redirect('/forgotpasswordpage')
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
        }, process.env.SECRECT || 'SANTANUPASSWORBBCVZXCGCUY', { expiresIn: '2h' })
        const link=`http://localhost:3004/forgotpass/${token}`
            // send mail with defined transport object
            const info = await transporter.sendMail({
              from: `Maddison Foo Koch 👻${process.env.EMAIL_FROM}`, // sender address
              to: email, // list of receivers
              subject: "Hello ✔", // Subject line
              html: `Click the belo link to forgot password ${link}`, // html body
            });
            req.flash('sucess','Email Send Sucessfuly')
            res.redirect('/')
          
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).send('Something went wrong');
    }
  }
  
  async forgotpass_page(req,res){
    try{
        const user=req.user;
        const token=req.token;
        if(user){
            res.cookie('usertoken',token)
            res.render('forgotpasswordc',{
                user
            })
        }else{
            res.status(401).json({
                massage:'error occurd'
            })
        }
    }catch(err){
        conaole.log(err)
    }
}
async passwordforgot(req,res){
    try{ 
        const{email,password,repassword}=req.body
        console.log(email)
        if(!email||!password||!repassword){
            req.flash('error','All fild is required');
           return res.redirect('/forgotpass/:token')
        }
        if(password!=repassword){
            req.flash('error','password dosenot match');
            return res.redirect('/forgotpass/:token')
           }
           const existuser=await User.findOne({email})
           if(!existuser){
            req.flash('error','email dosenot match');
            return res.redirect('/forgotpass/:token')
           }
           const hasepassword=await PasswordHase(password)
           const updatepassword=await User.findOneAndUpdate({email},{
            $set: {
                password: hasepassword
            }
        });
        req.flash('sucess','Password Sucessfuly Change');
        res.redirect('/')
    }catch(err){
        console.log(err)
    }
}
  
    // user dashboard display
    async user_Dashboard_page(req, res) {
        try {
            const user=req.user;
            return res.render('user_pages/user_dashboard/dashboard',{user,title:'Dashboard Page - Lifeline'})
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }


   
    // user logout
    async logout(req, res) {
        try {
            req.flash('success', 'Logout Sucessfully');
            res.clearCookie('usertoken')
            return res.redirect('/')
        } catch (err) {
            console.log(err)
            return res.redirect('/error')
        }
    }
    // user appoiments
    async appoiments_page_display(req, res) {
        try {
            const user=req.user;
            const doctors = await doctorModel.find({ isdelete: false, isavalable: true });

            // Extract unique departments
            const departments = [...new Set(doctors.map(doc => doc.department))];
            return res.render('user_pages/user_dashboard/appoinment',{user,title:'Appointments Page - Lifeline',departments, doctors})
        } catch (error) {
            console.log(error)
            return res.redirect('/error')
        }
    }
    // after appoinment store data in mong
    async apptdata_store(req, res) {
        try {
            
            extend('bloodType', ({ value }) => {
                const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
                return validBloodTypes.includes(value);
            }, 'The blood type must be one of A+, A-, B+, B-, AB+, AB-, O+, or O-.');
            const v = new Validator(req.body, {
                name: "required|string|minLength:3|maxLength:30",
                doctor: "required|minLength:3|maxLength:30",
                date: "required",
                time: "required",
                dept: "required",
                phone:"required|minLength:10|maxLength:10" ,
                blood:"required|bloodType",
                age:"required",
                message:"required|minLength:5",
                email:"required|email",
                gender:"required"

            });                 
            const matched = await v.check();
            if (!matched) {
                req.flash('error', Object.values(v.errors).map(err => err.message))
               
                return res.redirect('/appointments')
            }
            
            const {name, doctor,date,time,dept,phone,blood,age,message,email,gender} = req.body 
            const appuserid  =req.user._id 
            console.log(appuserid)
            const finddr=await doctorModel.findOne({_id:doctor})  
            const drname= finddr.name  
            const createuser = await new appointmentnmodel({
                appuserid,name, doctor:drname,date,time,dept,phone,blood,age, message,gender,email
            })    
            const saveuser = await createuser.save()
            req.flash('success', 'Appointment Sucessfully')
            return res.redirect('/appointments')
        } catch (error) {
            req.flash('error', 'Not Register Error occoourd')
            console.log(error)
            return res.redirect('/error')
        }
    }
}


module.exports = new userController();