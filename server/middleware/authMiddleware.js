const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      _id: decoded.id,    
      role: decoded.role 
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};