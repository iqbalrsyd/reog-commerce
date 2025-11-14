import * as cartService from '../services/cart.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.uid);
  res.json({
    success: true,
    message: 'Cart retrieved successfully',
    data: cart,
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addProductToCart(req.user.uid, productId, quantity || 1);
  res.json({
    success: true,
    message: 'Product added to cart',
    data: cart,
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user.uid, productId, quantity);
  res.json({
    success: true,
    message: 'Cart item updated',
    data: cart,
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const cart = await cartService.removeFromCart(req.user.uid, productId);
  res.json({
    success: true,
    message: 'Product removed from cart',
    data: cart,
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user.uid);
  res.json({
    success: true,
    message: 'Cart cleared',
    data: cart,
  });
});

