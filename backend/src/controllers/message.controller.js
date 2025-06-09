import catchError from "../components/catchError.js"
import User from "../models/user.model.js";
import Message from '../models/message.model.js';
import cloudinary from "../lib/cloudinary.js";
import getRecieverSocketId, { io } from "../lib/socket.js";
import Notification from '../models/notification.model.js';

export const getUsers = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } });
        res.status(200).json({ success: true, filteredUsers });
    } catch (error) {
        catchError(res, error);
    }
}

export const getMessages = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { id: reciverId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, reciverId: reciverId },
                { senderId: reciverId, reciverId: senderId }
            ]
        });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        catchError(res, error);
    }
}

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { id: reciverId } = req.params;

        let image_url;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            image_url = uploadResponse.secure_url;
        }

        await Notification.create({
            senderId,
            reciverId,
            text,
            image: image_url
        });

        const message = await Message.create({
            senderId,
            reciverId,
            text,
            image: image_url
        });

        const messageWithSender = await Message.findById(message._id)
            .populate('senderId', '-password');

        // if reciever is online
        const recevierSocketId = getRecieverSocketId(reciverId);
        if (recevierSocketId) {
            io.to(recevierSocketId).emit('newMessage', message);
        }

        io.to(recevierSocketId).emit('notification', messageWithSender);

        
        res.status(201).json({ sucess: true, message });
    } catch (error) {
        catchError(res, error);
    }
}

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            reciverId: req.user._id
        })
            .populate('senderId');
        res.json({ notifications });
    } catch (error) {
        catchError(res, error)
    }
}

export const deleteMessages = async (req, res) => {
    try {
        await Notification.deleteMany({ reciverId: req.user._id });
        res.status(200).json({ success: true, message: 'Deleted Successfully' });
    } catch (error) {
        catchError(res, error);
    }
}
