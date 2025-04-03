import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  //TODO Implement authentication
  return next();
};

//TODO Implement admin authentication
export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('authorization')?.split(` `)[1]

    if(!token) return res.status(401).json({message: "You're not an admin user."});

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if(!decoded.isAdmin) {
      return res.status(403).json({message: "Only admins can perform this action"})
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({message: "Invalid token"});
  };
};

