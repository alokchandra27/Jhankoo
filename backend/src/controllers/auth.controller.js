const sellerModel = require("../models/seller.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auditLog = require("../models/auditLog.model");

async function registerSeller(req, res) {
  try {
    const {
      fullName: { firstName, lastName },
      email,
      username,
      password,
      storeName,
    } = req.body;

    const existingUser = await sellerModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // FIX 1: .select() hata diya
    const hashedPassword = await bcrypt.hash(password, 10); 

    // FIX 2: password ko create function me add kar diya
    const newSeller = await sellerModel.create({
      fullName: { firstName, lastName },
      email,
      username,
      password: hashedPassword, // Ab password save hoga
      storeName,
    });

    const token = jwt.sign({ id: newSeller._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });

    const cookieOptions = {
      httpOnly: true,
    };

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully",
      seller: newSeller,
      token,
    });
  } catch (error) {
    // Isse Render logs me exact galti dikhegi agar kuch aur hua toh
    console.error("REGISTRATION ERROR DETECTED:", error); 
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
}


async function loginSeller(req, res) {
  try {
    const { email, password } = req.body;

    const seller = await sellerModel.findOne({
      email: email,
    });

    if (!seller) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
      expiresIn: "14d",
    });

    const cookieOptions = {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Seller logged in successfully",
      user: seller,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
}

async function getSellerProfile(req, res) {
  try {
    const sellerId = req.user.id;
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
    const sellerId = req.user.id;
    const { fullName, email, username, currentPassword, newPassword } = req.body;

    // 1. Pehle find karein taaki hum password check kar sakein aur purana data nikal sakein
    let seller = await sellerModel.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // 2. PASSWORD CHANGE LOGIC (Agar user password badalna chahta hai)
    if (currentPassword || newPassword) {
      if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
        return res.status(400).json({
          message: "Current aur new password valid text hone chahiye.",
        });
      }

      // Agar ek cheez bheji aur doosri nahi, toh error return karein
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: "Both the current and new passwords are required to change your password." 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "New password kam se kam 6 characters ka hona chahiye.",
        });
      }

      // Check karein ki user ne jo currentPassword dala hai woh sahi hai ya nahi
      const isMatch = await bcrypt.compare(currentPassword, seller.password);
      if (!isMatch) {
        return res.status(400).json({ message: "The current password is incorrect." });
      }

      // Naye password ko hash karein aur seller object mein update karein
      const salt = await bcrypt.genSalt(10);
      seller.password = await bcrypt.hash(newPassword, salt);
    }

    // 3. REMAINING FIELDS LOGIC (Baaki details map karein agar request mein aayi hain)
    if (fullName) {
      seller.fullName = {
        firstName: fullName.firstName || seller.fullName.firstName,
        lastName: fullName.lastName || seller.fullName.lastName,
      };
    }
    if (email) seller.email = email;
    if (username) seller.username = username;

    // 4. Save the updated seller document
    // Yeh validators ko bhi run karega aur pre-save hooks (agar hain) unko bhi trigger karega
    await seller.save();

    // Response bhejne se pehle password ko hide kar dein taaki security bani rahe
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
    const sellerId = req.user.id;

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

    res.status(200).json({
      message: "Seller profile deleted successfully",
      seller: seller,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during profile deletion" });
  }
}

async function logoutSeller(req, res) {
  try {

    const sellerId = req.user.id;

    const seller = await sellerModel.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.clearCookie("token");




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
