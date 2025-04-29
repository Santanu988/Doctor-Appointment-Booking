const imageuplode = require("./uplodeimage");

const errorhandal=async(req, res, next) => {
    imageuplode.single('image')(req, res, function (err) {
      if (err) {
        req.flash('error', err.message); // send flash message
        return res.redirect('/admin/adddoctor'); // redirect with error
      }
      next(); // move to the controller
    });
  }
  module.exports=errorhandal