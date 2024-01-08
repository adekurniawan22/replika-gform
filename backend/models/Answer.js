// Answer.js
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
            type: Date, // Change the type to Date
        },
        updatedAt: {
            type: Date, // Change the type to Date
        },
    },
    {
        timestamps: true, // Use the built-in timestamps
        strict: false,
    }
);

module.exports = mongoose.model("Answer", Schema);
