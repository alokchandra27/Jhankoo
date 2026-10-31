const sellerModel = require("../models/seller.model");
const storeModel = require("../models/store.model");
const productModel = require("../models/product.model");

async function getSellerStoreByUsername(req, res) {
  try {
    const { username } = req.params;

    if (!username?.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Find seller using unique username
    const seller = await sellerModel.findOne({
      username: username.trim(),
    }).select("_id username storeName");

    if (!seller) {
      return res.status(404).json({ message: "Shop profile not found" });
    }

    // Find store using sellerId
    const storeProfile = await storeModel
      .findOne({ sellerId: seller._id })
      .select("-createdAt -updatedAt -__v");

    // Prepare public store data
    const finalStoreData = {
      storeName: storeProfile?.storeName || seller.storeName || "",
      bio: storeProfile?.bio || seller.bio || "",
      profileImage:
        storeProfile?.profileImage?.url ||
        seller.profileImage ||
        "",
      storeLogo: storeProfile?.storeLogo?.url || "",
      bannerImage: storeProfile?.bannerImage?.url || "",
      instagramUsername: storeProfile?.instagramUsername || "",
      instagramLink: storeProfile?.instagramLink || "",
      whatsappNumber: storeProfile?.whatsappNumber || "",
      facebookUsername: storeProfile?.facebookUsername || "",
      facebookLink: storeProfile?.facebookLink || "",
      address: storeProfile?.address || "",
      ourStory: storeProfile?.ourStory || "",
    };

    // Fetch seller's active products
    const products = await productModel
      .find({
        sellerId: seller._id,
        isDeleted: false,
      })
      .select("-isDeleted -deletedAt -__v -createdAt -updatedAt");

    return res.status(200).json({
      message: "Public store data fetched successfully",
      store: finalStoreData,
      products,
    });
  } catch (error) {
    console.error("Error fetching public store page:", error);

    return res.status(500).json({
      message: "Internal server error while loading shop page",
      error: error.message,
    });
  }
}

module.exports = { getSellerStoreByUsername };