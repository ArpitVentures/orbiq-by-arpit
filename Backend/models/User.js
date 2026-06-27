const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    state: {
        type: String,
        default: ""
    },

    country: {
        type: String,
        default: ""
    },

    pincode: {
        type: String,
        default: ""
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: {
        type: String
    },

    resetPasswordToken: {
        type: String
    },

    resetPasswordExpiry: {
        type: Date
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    plan: {
        type: String,
        enum: ["Free", "Silver", "Gold"],
        default: "Free"
    },

    planStatus: {
        type: String,
        enum: ["Active", "Expired"],
        default: "Active"
    },

    planStart: {
        type: Date,
        default: Date.now
    },

    planExpiry: {
        type: Date
    }

});

module.exports = mongoose.model(
    "User",
    userSchema
);