const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const productController = require("../controllers/product.controller");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for multer

router.post(
  "/create-product",
  authMiddleware.authUser,
  upload.fields([
    { name: "productImage1", maxCount: 1 },
    { name: "productImage2", maxCount: 1 },
    { name: "productImage3", maxCount: 1 },
    { name: "productImage4", maxCount: 1 },
    ]),
  productController.createProduct,
);

router.get('/my-products', authMiddleware.authUser, productController.getSellerProducts);
router.get('/my-products/:id', authMiddleware.authUser, productController.getSellerProductById);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.put(
  "/:id",
  authMiddleware.authUser,
  upload.fields([
    { name: "productImage1", maxCount: 1 },
    { name: "productImage2", maxCount: 1 },
    { name: "productImage3", maxCount: 1 },
    { name: "productImage4", maxCount: 1 },
    { name: "productImage5", maxCount: 1 },
  ]),
  productController.updateProduct,
);
router.delete('/:id', authMiddleware.authUser, productController.deleteProduct);


module.exports = router;