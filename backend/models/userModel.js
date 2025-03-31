import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: String,
        default: false,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpiresAt: {
        type: String
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpiresAt: {
        type: Date
    }

}, { timestamps: true });


export const User = mongoose.model("user", userSchema);