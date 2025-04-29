const express=require('express')
const db=require('./app/config/connectdb')
const dotenv=require('dotenv')
const ejs=require('ejs')
const path=require('path')
const flash=require('connect-flash')
const cookieparser=require('cookie-parser')
const session=require('express-session')
// confegaring doteng
dotenv.config()
const app=express()
db()

// session 
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));

// flash 
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success');
    res.locals.error_msg=req.flash('error');
    next();
})
// cookie 
app.use(cookieparser());

// templateing engine ejs setup
app.set('view engine','ejs');
app.set('views','views')



// Encoding middlewire
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//create static file
app.use(express.static(__dirname +'/public'))
app.use('/uplodes',express.static(path.join(__dirname , '/uplodes')))
app.use('/uplodes',express.static('uplodes'))
app.use('/pdfs',express.static(path.join(__dirname , '/pdfs')))
app.use('/pdfs',express.static('pdfs'))

// router include

// userRouters
const userrouter=require('./app/router/user/userRouter')
app.use(userrouter)

// admin Rourtes

const adminRouter=require('./app/router/adminRouter/adminRouter')
app.use('/admin',adminRouter)
const doctorRouter=require('./app/router/adminRouter/doctorRouter')
app.use('/admin',doctorRouter)
const depertmentRouter=require('./app/router/adminRouter/departmentRouter')
app.use('/admin',depertmentRouter)
const serviceRouter=require('./app/router/adminRouter/servicesRouter')
app.use('/admin',serviceRouter)
const appointmentController=require('./app/router/adminRouter/appointmentRouter')
app.use('/admin',appointmentController)
const blogsrouter=require('./app/router/adminRouter/blogrouter')
app.use('/admin',blogsrouter)
// user Router Required
const userRouter=require('./app/router/user/userRouter')
app.use(userRouter)
const dashboardRouter=require('./app/router/user/dashboardRouter')
app.use('/dashboard',dashboardRouter)


const apiRouter=require('./app/router/apiRouter/apiRouter')
app.use(apiRouter)
//Server Create
app.listen(process.env.PORT||2346,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT||2346}`);
})