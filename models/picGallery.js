const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
    gallery: { type: String, require: true },
    name: { type: String, require: true },
    path: { type: String, require: true },
    time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Picture', pictureSchema);