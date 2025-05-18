const { Product, getDescriptionSchema } = require("../db/models/productSchema");
const mongoose = require("mongoose");
const path = require("path");

const getAllProductsService = async () => {
  return await Product.find();
};

const getProductByIdService = async (id) => {
  return await Product.findById(id);
};

const createProductService = async (data, userId) => {
  const { name, desc, price, category, imgUrl, description } = data;
  const schema = getDescriptionSchema(category);
  const modelName = `TempDescription_${category.replace(/\s+/g, '_')}`;
  const TempModel = mongoose.models[modelName] || mongoose.model(modelName, schema);
  const descDoc = new TempModel(description);
  const validationError = descDoc.validateSync();
  if (validationError) throw validationError;
  const newProduct = new Product({ name, desc, price, category, imgUrl, description, createdBy: userId });
  return await newProduct.save();
};

const updateProductService = async (id, userId, updateData) => {
  const product = await Product.findById(id);
  if (!product) return null;
  if (product.createdBy.toString() !== userId) throw new Error("Forbidden");
  if (updateData.description) {
    const schema = getDescriptionSchema(updateData.category);
    const modelName = `TempDescription_${updateData.category.replace(/\s+/g, '_')}`;
    const TempModel = mongoose.models[modelName] || mongoose.model(modelName, schema);
    const descDoc = new TempModel(updateData.description);
    const validationError = descDoc.validateSync();
    if (validationError) throw validationError;
  }
  Object.assign(product, updateData);
  return await product.save();
};

const deleteProductService = async (id, userId) => {
  const product = await Product.findById(id);
  if (!product) return null;
  if (product.createdBy.toString() !== userId) throw new Error("Forbidden");
  await Product.findByIdAndDelete(id);
  return true;
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService
};