import * as productService from '../services/product.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createProduct = asyncHandler(async (req, res) => {
  // Parse JSON data from form-data
  const productData = typeof req.body.data === 'string' 
    ? JSON.parse(req.body.data) 
    : req.body;
  
  const product = await productService.createProduct(req.user.uid, productData, req.files);
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts(req.query);
  res.json({
    success: true,
    message: 'Products retrieved successfully',
    data: products,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id, req.user?.uid);
  res.json({
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  });
});

export const getProductsByOutlet = asyncHandler(async (req, res) => {
  const products = await productService.getProductsByOutlet(req.params.outletId, req.query);
  res.json({
    success: true,
    message: 'Products retrieved successfully',
    data: products,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.user.uid, req.body, req.files);
  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id, req.user.uid);
  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
});

export const likeProduct = asyncHandler(async (req, res) => {
  const result = await productService.toggleLike(req.params.id, req.user.uid);
  res.json({
    success: true,
    message: result.liked ? 'Product liked' : 'Product unliked',
    data: result,
  });
});

