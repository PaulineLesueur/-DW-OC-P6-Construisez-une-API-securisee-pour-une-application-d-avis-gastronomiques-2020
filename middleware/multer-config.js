const multer = require('multer'); //used to upload images
const MIME_TYPES = { //we define the formats to allow
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension) //we ensure an unique name by using date.now to name the image
    }
});

module.exports = multer({ storage }).single('image');