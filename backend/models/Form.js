const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    question: {
        type: Array,
    },
    invites: {
        type: Array,
    },
    public: {
        type: Boolean,
    },
    createdAt: {
        type: Number,
    },
    updatedAt: {
        type: Number,
    },
},
    {
        timestamps: {
            currentTime: () => Math.floor(Date.now() / 1000)
        }
    })

module.exports = mongoose.model('Form', Schema)