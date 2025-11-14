import { db } from '../config/firebase.js';
import { getTimestamp } from '../utils/helpers.js';

/**
 * Get user cart
 */
export const getCart = async (userId) => {
  const cartDoc = await db.collection('carts').doc(userId).get();
  
  if (!cartDoc.exists) {
    // Create empty cart
    const emptyCart = {
      id: userId,
      userId,
      products: [],
      events: [],
      totalItems: 0,
      totalAmount: 0,
      updatedAt: getTimestamp(),
    };
    await db.collection('carts').doc(userId).set(emptyCart);
    return emptyCart;
  }
  
  return {
    id: cartDoc.id,
    ...cartDoc.data(),
  };
};

/**
 * Add product to cart
 */
export const addProductToCart = async (userId, productId, quantity) => {
  // Get product details
  const productDoc = await db.collection('products').doc(productId).get();
  if (!productDoc.exists) {
    throw new Error('Product not found');
  }
  
  const product = productDoc.data();
  if (!product.isActive || product.isDeleted) {
    throw new Error('Product is not available');
  }
  
  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  
  // Get or create cart
  const cart = await getCart(userId);
  
  // Check if product already in cart
  const existingProductIndex = cart.products.findIndex(p => p.productId === productId);
  
  if (existingProductIndex >= 0) {
    // Update quantity
    cart.products[existingProductIndex].quantity += quantity;
  } else {
    // Add new product
    cart.products.push({
      productId,
      quantity,
      price: {
        min: product.price.min,
        ...(product.price.max ? { max: product.price.max } : {}),
      },
      addedAt: getTimestamp(),
    });
  }
  
  // Recalculate totals
  cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
  cart.totalAmount = cart.products.reduce((sum, p) => {
    const price = p.selectedPrice || p.price.min;
    return sum + (price * p.quantity);
  }, 0);
  cart.updatedAt = getTimestamp();
  
  // Save cart
  await db.collection('carts').doc(userId).set(cart);
  
  return cart;
};

/**
 * Update product quantity in cart
 */
export const updateCartItem = async (userId, productId, quantity) => {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }
  
  const cart = await getCart(userId);
  const productIndex = cart.products.findIndex(p => p.productId === productId);
  
  if (productIndex < 0) {
    throw new Error('Product not found in cart');
  }
  
  // Check stock
  const productDoc = await db.collection('products').doc(productId).get();
  const product = productDoc.data();
  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }
  
  // Update quantity
  cart.products[productIndex].quantity = quantity;
  
  // Recalculate totals
  cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
  cart.totalAmount = cart.products.reduce((sum, p) => {
    const price = p.selectedPrice || p.price.min;
    return sum + (price * p.quantity);
  }, 0);
  cart.updatedAt = getTimestamp();
  
  await db.collection('carts').doc(userId).set(cart);
  
  return cart;
};

/**
 * Remove product from cart
 */
export const removeFromCart = async (userId, productId) => {
  const cart = await getCart(userId);
  
  cart.products = cart.products.filter(p => p.productId !== productId);
  
  // Recalculate totals
  cart.totalItems = cart.products.reduce((sum, p) => sum + p.quantity, 0);
  cart.totalAmount = cart.products.reduce((sum, p) => {
    const price = p.selectedPrice || p.price.min;
    return sum + (price * p.quantity);
  }, 0);
  cart.updatedAt = getTimestamp();
  
  await db.collection('carts').doc(userId).set(cart);
  
  return cart;
};

/**
 * Clear entire cart
 */
export const clearCart = async (userId) => {
  const emptyCart = {
    id: userId,
    userId,
    products: [],
    events: [],
    totalItems: 0,
    totalAmount: 0,
    updatedAt: getTimestamp(),
  };
  
  await db.collection('carts').doc(userId).set(emptyCart);
  
  return emptyCart;
};

