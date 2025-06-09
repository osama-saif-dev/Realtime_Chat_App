import validationSchemaResult from "../components/validationSchema.js";
import { signupSchema } from '../validation/signup.validation.js';
import { loginSchema } from '../validation/login.validation.js';
import catchError from '../components/catchError.js';
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import generateAndStoreCookie from '../components/generateAndStoreCookie.js';
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const validationResult = validationSchemaResult(res, signupSchema, {
            fullName,
            email,
            password
        });
        if (!validationResult) return;

        const user = await User.findOne({ email });
        if (user) return res.status(401).json({ success: false, message: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        generateAndStoreCookie(res, newUser._id);
        await newUser.save();

        res.status(201).json({ success: true, user: newUser, message: 'Created Successfully' });
    } catch (error) {
        catchError(res, error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validationResult = validationSchemaResult(res, loginSchema, { email, password });
        if (!validationResult) return;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Email or password is invalid' });

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'invalid email or password'
            });
        }

        generateAndStoreCookie(res, user._id);
        res.status(201).json({ success: true, user, message: 'Login Successfully' });
    } catch (error) {
        catchError(res, error);
    }
}

export const logout = async (req, res) => {
    res.clearCookie('jwt');
    return res.status(200).json({ success: true, message: 'Logout Successfully' })
}

export const profile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { profilePic } = req.body;

        if (!profilePic) return res.status(404).json({ success: false, message: 'Profile picture is required' });

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, { new: true });

        res.status(200).json({ success: true, message: 'Updated Successfully', updatedUser });
    } catch (error) {
        catchError(res, error);
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        catchError(res, error);
    }
}