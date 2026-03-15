const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        
    },
    appointment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment",
        
    },
    amount: {
        type: Number,
        
    },
    date:{
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
})

const earningModel = mongoose.model("earning", earningSchema);
module.exports = earningModel;