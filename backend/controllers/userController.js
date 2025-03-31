import { User } from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/email.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })

        await newUser.save();

        // jwt
        generateTokenAndSetCookie(res, newUser._id);

        sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "user created successfully",
            user: {
                ...newUser._doc,
                password: undefined
            }
        });

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}


export const verifyEmail = async (req, res) => {

    try {

        const { code } = req.body;

        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.error("Error sending welcome email: ", error.message)
    }
}


export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.error("Error in login: ", error.message)
        return res.status(400).json({ success: false, message: error.message })
    }
}
export const logoutUser = async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const clientURL = process.env.CLIENT_URL;

        const user = await User.findOne({ email: email});

        if(!user){
            return res.status(400).json({ success: false, message: "User not found"});
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;

        await user.save();

        // send forgot password email

        await sendPasswordResetEmail(user.email, `${clientURL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link send to your email"});

    } catch (error) {
        console.log("Error in forgotPassword: ", error.message);
        return res.status(400).json({ success: false, message: error.message});
    }
}

export const resetPassword = async (req, res) => {
    try {

        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now()},
        });

        if(!user){
            return res.status(400).json({ success: false, message: "Invalid or expired reset token"});
        }

        // update password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        return res.status(200).json({ success: true, message: "Password reset successfully"});
       
        
    } catch (error) {
        console.log("Error in resetPassword: ", error.message);
        return res.status(400).json({ success: false, message: error.message});
    }
}

export const checkAuth = async (req, res)  => {
    try {

        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({ success: false, message: "User not found"})
        }

        return res.status(200).json({ success: true, user: user});
        
    } catch (error) {
        console.log("Error in checkAuth: ", error.message);
        return res.status(400).json({ success: false, message: error.message});
    }
}