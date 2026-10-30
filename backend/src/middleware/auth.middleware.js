const jwt = require("jsonwebtoken");
const sellerModel = require("../models/seller.model");

async function authUser(req, res, next) {
  //   console.log("req.cookies:", req.cookies); // Log the cookies to see what is being sent
  const token = req.cookies.token;
  //   if (!token) {
  //     return res.status(401).json({ message: "User Not Logged In" });
  //   }

  //   let token;

  //     // 2️⃣ Try Authorization header (Bearer token)
  //   if (!token && req.headers.authorization) {
  //     const parts = req.headers.authorization.split(" ");
  //     if (parts[0] === "Bearer") {
  //       token = parts[1];
  //     }
  //   }

  //token

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized Access , Please Login First",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await sellerModel.findById({
      _id: decoded.id,
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found, please login again",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}

module.exports = {
  authUser,
};
