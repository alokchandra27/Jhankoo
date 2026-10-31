const { default: mongoose } = require("mongoose");
const productModel = require("../models/product.model");
const sellerModel = require("../models/seller.model"); // 🌟 Make sure to import your Seller Model!
const { uploadImage, deleteImage } = require("../services/storage.service");

async function createProduct(req, res) {
  try {
    const sellerId = req.user.id;


    const seller = await sellerModel.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    // 2. Clean the seller's name for use in a URL folder path (e.g. "John's Craft Shop" -> "johns-craft-shop")
    const sanitizedSellerName = seller.username
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/-+/g, "-");

    const {
      productName,
      productDescription,
      productPrice,
      shippingAvailable,
      shippingCost,
      shippingIncluded,
      category,
      stocks,
      color,
      size,
      extraDetails,
      customization,
    } = req.body;

    const uploadedImages = {};

    if (req.files) {
      for (const fieldName in req.files) {
        const fileArray = req.files[fieldName];

        if (fileArray && fileArray.length > 0) {
          const fileObject = fileArray[0];
          const imageResponse = await uploadImage(
            fileObject,
            sanitizedSellerName,
          );

          uploadedImages[fieldName] = {
            url: imageResponse.url,
            fileId: imageResponse.fileId,
          };
        }
      }
    }

    const newProduct = new productModel({
      productName,
      productDescription,
      productPrice,
      shippingAvailable: shippingAvailable === true || shippingAvailable === "true",
      shippingCost: shippingAvailable === true || shippingAvailable === "true" ? Number(shippingCost || 0) : 0,
      shippingIncluded: shippingIncluded === true || shippingIncluded === "true",
      sellerId,
      category,
      stocks,
      color,
      size,
      extraDetails,
      customization,
      sellerUsername: sanitizedSellerName, 
      storeName: seller.storeName, 
      productImage1: uploadedImages.productImage1,
      productImage2: uploadedImages.productImage2,
      productImage3: uploadedImages.productImage3,
      productImage4: uploadedImages.productImage4,
      isDeleted: false, 
      deletedAt: null,
    });

    const savedProduct = await newProduct.save();

    console.log("Product created successfully:", savedProduct);

    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error during product creation",
      error: error.message,
    });
  }
}

async function getAllProducts(req, res) {
  try {
    const products = await productModel.find({
      isDeleted: false, 
    });
    res.status(200).json({
      message: "Products fetched successfully",
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching products",
      error: error.message,
    });
  }
}

async function getSellerProducts(req, res) {
  try {
    const products = await productModel.find({
      sellerId: req.user.id,
      isDeleted: false,
    });

    res.status(200).json({
      message: "Seller products fetched successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching seller products",
      error: error.message,
    });
  }
}

async function getProductById(req, res) {
   try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const product = await productModel.findOne({ _id: productId, isDeleted: false });
    if (!product) {
      return res.status(404).json({ message: "Product not found or deleted" });
    }
    
    res.status(200).json({
      message: "Product fetched successfully",
      product: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching product",
      error: error.message,
    });
  }
}

async function getSellerProductById(req, res) {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const product = await productModel.findOne({
      _id: productId,
      sellerId: req.user.id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found in your store" });
    }

    res.status(200).json({
      message: "Seller product fetched successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching seller product",
      error: error.message,
    });
  }
}

async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const sellerId = req.user.id;


    const existingProduct = await productModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }


    if (existingProduct.sellerId.toString() !== sellerId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this product" });
    }

    const seller = await sellerModel.findById(sellerId);
    const sanitizedSellerName = seller
      ? seller.username
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
      : "unknown-seller";


    const updatePayload = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(updatePayload, "shippingAvailable")) {
      updatePayload.shippingAvailable = updatePayload.shippingAvailable === true || updatePayload.shippingAvailable === "true";
    }
    if (Object.prototype.hasOwnProperty.call(updatePayload, "shippingIncluded")) {
      updatePayload.shippingIncluded = updatePayload.shippingIncluded === true || updatePayload.shippingIncluded === "true";
    }
    if (Object.prototype.hasOwnProperty.call(updatePayload, "shippingCost")) {
      updatePayload.shippingCost = updatePayload.shippingAvailable ? Number(updatePayload.shippingCost || 0) : 0;
    }

 if (req.files) {
      for (const fieldName in req.files) {
        const fileArray = req.files[fieldName];
        if (fileArray && fileArray.length > 0) {
          const fileObject = fileArray[0]; 

          console.log(`Uploading new image for field: ${fieldName} for product ID: ${productId}`);

          const plainProductObject = existingProduct.toObject();
          
          if (plainProductObject[fieldName] && plainProductObject[fieldName].fileId) {
            const targetFileId = plainProductObject[fieldName].fileId;
            
            console.log(`Attempting to delete from ImageKit with File ID: ${targetFileId}`);
            await deleteImage(targetFileId); 
            
            console.log(`Deleted old image for field: ${fieldName}`);
          }

          const imageResponse = await uploadImage(fileObject, sanitizedSellerName);

          updatePayload[fieldName] = {
            url: imageResponse.url,
            fileId: imageResponse.fileId
          };
        }
      }
    }


    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updatePayload,
      { returnDocument: "after", runValidators: true }, 
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while updating product",
      error: error.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    const sellerId = req.user.id;

    const existingProduct = await productModel.findById(productId);
    if (!existingProduct || existingProduct.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (existingProduct.sellerId.toString() !== sellerId) {
      return res.status(403).json({ message: "Unauthorized to delete this product" });
    }

    const deletedProduct = await productModel.findByIdAndUpdate(
      productId,
      { isDeleted: true, deletedAt: new Date() },
      { returnDocument: 'after' }
    );

    res.status(200).json({
      message: "Product deleted successfully (Archived)",
      product: deletedProduct,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while deleting product",
      error: error.message,
    });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getSellerProducts,
  getSellerProductById,
  updateProduct,
  getProductById,
  deleteProduct,
};
