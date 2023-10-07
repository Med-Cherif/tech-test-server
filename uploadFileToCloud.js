const cloudinary = require("./cloudinary");

const uploadFileToCloud = (file, options = {}) => {
  return cloudinary.uploader.upload_stream({
    folder: "egor",
    use_filename: true,
  });
};

module.exports = uploadFileToCloud;
