const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
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
            currentTime: () => Math.floor(Date.now() / 1000),
        },
        strict: false,
    }
);

module.exports = mongoose.model("Answer", Schema);
