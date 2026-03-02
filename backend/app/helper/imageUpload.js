const multer = require("multer");
const storage=multer.memoryStorage();
const ImageUpload=multer({storage})

module.exports=ImageUpload;