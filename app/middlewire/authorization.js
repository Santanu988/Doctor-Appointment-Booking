const bycript = require('bcryptjs')
const jwt = require('jsonwebtoken')
const hasepassword = async (passord) => {
    const salt = 10;
    const hasepassword = await bycript.hash(passord, salt)
    return hasepassword;
}


const admintokenverify = async (req, res, next) => {
    try {
        const token = res.admintoken || req.cookies.admintoken
        if (!token) {
            req.flash("error", " Please Login To Access! ");
            return res.redirect("/admin/login");
        }
        await jwt.verify(token, process.env.ADMIN_SECRECT||"SANTANUADMINGMUGNVHVBJSFBUBVGGFGBFGFBF", (err, data) => {
            if (err) {
                req.flash("error", "Invalid or expired token.");
                return res.redirect("/admin/login");
            }
            req.user = data;
            req.token = token;
           return next();
        })
    } catch (error) {
        console.log(error)
    }
}
const usertokenverify = async (req, res, next) => {
    try {
        const token = res.usertoken || req.cookies.usertoken 
        if (!token) {
            req.user = null;
           return next();
        }
        await jwt.verify(token, process.env.SERECT || 'SANTANUPASSWORBBCVZXCGCUY', (err, data) => {
            if (err) {
                req.flash("error", "Invalid or expired token.");
                return res.redirect("/login_page");
            }
            req.user = data;
          
           return next();
        })
    } catch (error) {
        console.log(error)
    }
}
const userauthenticationchack=async (req, res, next)=> {
    try {
        const user = req.user;
        if (user && (user.isadmin!=true)) {
            return next()
        } else {
            req.flash("error", "Please Login!");
            return res.redirect("/login");
        }

    } catch (err) {
        console.log(err)
    }
}
const adminauthchack= async (req, res, next) =>{
    try {

        const user = req.user;

        if (user && (user.isadmin == true)) {
            return next()
        } else {
            req.flash("error", "session expired! Please Login");
            return res.redirect("/admin/login");
        }

    } catch (err) {
        console.log(err)
    }
    const FILE_TYPE_MAP = {
        'image/png': 'png',
        'image/jpeg': 'jpeg',
        'image/jpg': 'jpg'
    };
    const fileFilterr = (req, file, next) => {
        try{
            const isValid=FILE_TYPE_MAP[file.mimetype];
            let uploadError=new Error('invalid image type');
            if(isValid){
                
                next();
            }else{

            }
        }catch(error){
            console.log(error)
        }
      
    };
}
module.exports = { hasepassword,usertokenverify,admintokenverify,userauthenticationchack,adminauthchack}