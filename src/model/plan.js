const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        enum: ["monthly", "yearly"],
        default: "monthly",
    },
    features: [
        {
            feature: { type: String, required: true },
            limit: { type: mongoose.Schema.Types.Mixed },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    planId: String
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;