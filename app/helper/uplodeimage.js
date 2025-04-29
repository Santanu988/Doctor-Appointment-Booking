const multer = require('multer');
const fs = require('fs');
const path = require('path');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const fileFilter = (req, file, cb) => {
  const isValid = FILE_TYPE_MAP[file.mimetype];
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image type. Only JPG, JPEG, and PNG are allowed.'), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uplodes';

    // Check if the uploads directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create uploads folder if it doesn't exist
    }

    cb(null, uploadDir); // Set destination folder
  },
  filename: (req, file, cb) => {
    const extension = FILE_TYPE_MAP[file.mimetype];
    const name = file.originalname.split(' ').join('-');
    cb(null, `${Date.now()}-${name}.${extension}`);
  }
});

const imageuplode = multer({ storage, fileFilter });

module.exports = imageuplode;
