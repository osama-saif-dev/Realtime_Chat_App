import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export default async function protectRoute(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ sucess: false, message: 'Unauthorized - no token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) return res.status(401).json({ sucess: false, message: 'Unauthorized - invalid token' });

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(401).json({ sucess: false, message: 'User not found' });

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({ sucess: false, message: `Form protected routes ${error.message}` });
    }
}
