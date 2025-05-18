const path = require("path");
const {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService
} = require("../services/product.service");

let getAllProducts = async (req, res) => {
  try {
    let allProducts = await getAllProductsService();
    if (allProducts.length === 0) {
      return res.status(404).sendFile("404.html", { root: process.cwd() });
    }
    return res.status(200).json({ success: true, message: "All products fetched successfully", data: allProducts });
  } catch (err) {
    console.error("GET ALL PRODUCTS ERROR:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

let getProductById = async (req, res) => {
  try {
    let product = await getProductByIdService(req.params.id);
    if (!product) {
      return res.status(404).sendFile("404.html", { root: process.cwd() });
    }
    return res.status(200).json({ success: true, message: "Product fetched successfully", data: product });
  } catch (err) {
    console.error("GET PRODUCT BY ID ERROR:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = await createProductService(req.body, req.user.userId);
    return res.status(201).json({ success: true, message: "Product created successfully", data: newProduct });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: "Invalid description fields", errors: err.errors });
    }
    console.error("CREATE PRODUCT ERROR:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

let updateProduct = async (req, res) => {
  try {
    const updatedProduct = await updateProductService(req.params.id, req.user.userId, req.body);
    if (!updatedProduct) return res.status(404).sendFile("404.html", { root: process.cwd() });
    return res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
  } catch (err) {
    if (err.message === "Forbidden") {
      return res.status(403).json({ success: false, message: "You do not own this product" });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: "Invalid description fields in update", errors: err.errors });
    }
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

let deleteProduct = async (req, res) => {
  try {
    const result = await deleteProductService(req.params.id, req.user.userId);
    if (!result) return res.status(404).sendFile("404.html", { root: process.cwd() });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    if (err.message === "Forbidden") {
      return res.status(403).json({ success: false, message: "You do not own this product" });
    }
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
