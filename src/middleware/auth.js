import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
  try {
    // Försök att få access token från headers
    const token = req.header('authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    // Verifiera access token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    req.user = decoded; // Sätt den dekodade användarinformationen i req.user
    next(); // Fortsätt till nästa middleware eller route handler

  } catch (error) {
    // Om token är ogiltig eller har löpt ut, försök med refresh token
    const refreshToken = req.header('refresh-token'); // Här kan du få refresh token från headers eller body

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is required" });
    }

    // Försök att verifiera refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'your-refresh-secret', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }

      // Om refresh token är giltigt, skapa ett nytt access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, isAdmin: decoded.isAdmin },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '15m' }
      );

      // Skicka tillbaka det nya access token
      res.json({ accessToken: newAccessToken });

      // Här kan du även lägga till en option att skapa ett nytt refresh token om det behövs
    });
  }
};

//TODO Implement admin authentication
export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('authorization')?.split(` `)[1]

    if (!token) return res.status(401).json({ message: "You're not an admin user." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Only admins can perform this action" })
    }
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  };
};

