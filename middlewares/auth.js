import jwt from 'jsonwebtoken';
const jwt_secret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.headers['authentication'];
    if (!token) {
        return res.status(401).json({msg: 'No token, authentication failed'});
    }
    try {
        const decode = jwt.verify(token, jwt_secret);
        req.user = decode;
        next();
    } catch (err) {
        return err;
    }
}

export default auth;