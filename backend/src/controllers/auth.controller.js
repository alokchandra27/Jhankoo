
const sellerModel = require("../models/seller.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auditLog = require("../models/auditLog.model");

// Cookie settings for local development and production environments
const cookieOptions = {
  httpOnly: true,
  secure: true,        // HTTPS mandatory for Render
  sameSite: "none",    // Allows cross-origin (Render backend + Frontend)
  maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
};

async function registerSeller(req, res) {
  try {
    const {
      fullName,
      email,
      username,
      password,
      storeName,
    } = req.body;

    // Validate required fields
    if (
      !fullName?.firstName?.trim() ||
      !email?.trim() ||
      !username?.trim() ||
      !password ||
      !storeName?.trim()
    ) {
      return res.status(400).json({
        message: "Please provide all required registration details.",
      });
    }

    const existingUser = await sellerModel.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { username: username.trim() },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email.trim().toLowerCase()
            ? "Email already registered."
            : "Username already taken.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = await sellerModel.create({
      fullName: {
        firstName: fullName.firstName.trim(),
        lastName: fullName.lastName?.trim() || "",
      },
      email: email.trim().toLowerCase(),
      username: username.trim(),
      password: hashedPassword,
      storeName: storeName.trim(),
    });

    const sellerResponse = newSeller.toObject();
    delete sellerResponse.password;

    const token = jwt.sign(
      { id: newSeller._id },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User registered successfully",
      seller: sellerResponse,
      token,
    });

  } catch (error) {
    console.error("REGISTRATION ERROR DETECTED:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or username already exists.",
      });
    }

    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
}

async function loginSeller(req, res) {
  try {
    const { email, password } = req.body;

    const seller = await sellerModel.findOne({ email });

    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });

    const sellerResponse = seller.toObject();
    delete sellerResponse.password;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Seller logged in successfully",
      user: sellerResponse,
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR DETECTED:", error);
    res.status(500).json({ message: "Server error during login" });
  }
}

async function getSellerProfile(req, res) {
  try {
    const sellerId = req.user?.id || req.user?._id;
    const seller = await sellerModel.findById(sellerId).select("-password");

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      message: "Seller profile retrieved successfully",
      seller: seller,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during profile retrieval" });
  }
}

async function updateSellerProfile(req, res) {
  try {
    const sellerId = req.user?.id || req.user?._id;
    const { fullName, email, username, currentPassword, newPassword } = req.body;

    let seller = await sellerModel.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (currentPassword || newPassword) {
      if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
        return res.status(400).json({
          message: "Current aur new password valid text hone chahiye.",
        });
      }

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          message: "Both the current and new passwords are required to change your password.",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New password kam se kam 6 characters ka hona chahiye.",
        });
      }

      const isMatch = await bcrypt.compare(currentPassword, seller.password);
      if (!isMatch) {
        return res.status(400).json({ message: "The current password is incorrect." });
      }

      const salt = await bcrypt.genSalt(10);
      seller.password = await bcrypt.hash(newPassword, salt);
    }

    if (fullName) {
      seller.fullName = {
        firstName: fullName.firstName || seller.fullName.firstName,
        lastName: fullName.lastName || seller.fullName.lastName,
      };
    }

    if (email) seller.email = email;
    if (username) seller.username = username;

    await seller.save();

    const sellerResponse = seller.toObject();
    delete sellerResponse.password;

    res.status(200).json({
      message: "Seller profile updated successfully",
      seller: sellerResponse,
    });

  } catch (error) {
    console.error("Error updating seller profile:", error);
    res.status(500).json({ message: "Server error during profile update" });
  }
}

async function deleteSellerProfile(req, res) {
  try {
    const sellerId = req.user?.id || req.user?._id;

    const seller = await sellerModel.findByIdAndDelete(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    await auditLog.create({
      action: "DELETE",
      userId: sellerId,
      userType: "Seller",
      userEmail: seller.email,
      performedBy: sellerId,
      username: seller.username,
      timestamp: new Date(),
    });

    const sellerResponse = seller.toObject();
    delete sellerResponse.password;

    res.status(200).json({
      message: "Seller profile deleted successfully",
      seller: sellerResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during profile deletion" });
  }
}

async function logoutSeller(req, res) {
  try {
    const sellerId = req.user?.id || req.user?._id;

    const seller = await sellerModel.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.clearCookie("token", cookieOptions);
    res.status(200).json({ message: "Seller logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during logout" });
  }
}

module.exports = {
  registerSeller,
  loginSeller,
  getSellerProfile,
  updateSellerProfile,
  deleteSellerProfile,
  logoutSeller,
};
