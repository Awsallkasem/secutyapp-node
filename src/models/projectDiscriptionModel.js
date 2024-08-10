const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const projectDiscription = mongoose.Schema({

    from: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    
    containt: {
        type: String,
        required: true,
    },

    sendAt: {
        type: Number,
        default: Date.now
    }
});

module.exports = mongoose.model('projectDiscription', projectDiscription);