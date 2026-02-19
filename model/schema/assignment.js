const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registeration',
        required: true
    }
    ,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    filename:{
        type: [String],
    },
    status: {
        type: String,
        default: "Draft"
    },
    currentReviewer: {
        type: String,
        default: null
    },
    download_url:{
        type:  [String] 
    },
    preview_url: {
        type:  [String]
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }  
}, { timestamps: true });

const AssignmentModel = mongoose.model("assignments", assignmentSchema);

module.exports = AssignmentModel;
