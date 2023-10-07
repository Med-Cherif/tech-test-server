const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uuid = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}${uuid}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
