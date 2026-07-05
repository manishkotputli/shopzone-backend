const multer = require('multer');
const path = require('path');
const fs = require('fs');

function makeStorage(subdir) {
  const dest = path.join(__dirname, '..', 'public', 'uploads', subdir);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${subdir}-${Date.now()}${ext}`);
    }
  });
}

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const uploadProductImage = multer({ storage: makeStorage('products'), fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadQrImage      = multer({ storage: makeStorage('qr'),       fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadLogo = multer({
    storage: makeStorage("logo"),
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
module.exports = { uploadProductImage, uploadQrImage,uploadLogo };
