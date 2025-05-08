const jwt = require('jsonwebtoken');

const tokenSecret = process.env.TOKEN_SECRET;

const isAdmin = (req, res, next) => {
    const token = req.header("x-access-token");

    if (!token) {
        return res.status(403).json({ success: false, message: "No token provided for admin authentication" });
    }

    try {
        const decoded = jwt.verify(token, tokenSecret);
        req.userId = decoded.id;
        req.type = decoded.type;
        req.name = decoded.name;
        if(type !== "A") {
            return res.status(403).json({ success: false, message: "You are not an admin"});
        }
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token for admin authentication" });
    }
}

module.exports = isAdmin;