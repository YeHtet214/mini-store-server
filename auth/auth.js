import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET;

export const verifyToken = (req) => {
    return new Promise((resolve, reject) => {
        const token = req.headers['authorization'];
        if (!token) {
            reject({ status: 401, msg: 'No token, authentication failed' });
        }
        try {
            const decode = jwt.verify(token, jwt_secret);
            req.user = decode; // Attaching user data to the request object
            resolve();
        } catch (err) {
            reject({ status: 401, msg: 'Invalid token, authentication failed' });
        }
    });
};
