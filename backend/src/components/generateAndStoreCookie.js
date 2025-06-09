import jwt from 'jsonwebtoken';

export default function generateAndStoreToken(res, userId) {
    // openssl rand -base64 32 => for create secret key 
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    });

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    });
}