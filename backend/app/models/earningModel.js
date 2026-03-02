const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        required: true
    },
    appointment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMode:{
        type: String,
        enum: ["cash", "online"],
        default: "cash"
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