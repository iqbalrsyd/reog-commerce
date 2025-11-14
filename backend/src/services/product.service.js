import { db } from '../config/firebase.js';
import admin from 'firebase-admin';
import { uploadMultipleToCloudinary } from '../utils/upload.js';
import { getTimestamp } from '../utils/helpers.js';

export const createProduct = async (sellerId, productData, files) => {
  const { name, description, category, price, stock, condition, additionalInfo, outletId, tags } = productData;
  
  // Validate price structure
  if (!price || !price.min) {
    throw new Error('Price minimum is required');
  }
  
  // Validate additionalInfo
  if (!additionalInfo || !Array.isArray(additionalInfo) || additionalInfo.length === 0) {
    throw new Error('Additional info is required');
  }
  
  // Upload images to Cloudinary
  let imageUrls = [];
  if (files && files.length > 0) {
    imageUrls = await uploadMultipleToCloudinary(files, 'products');
  }
  
  if (imageUrls.length === 0) {
    throw new Error('At least one product image is required');
  }
  
  // Create product document
  const productRef = db.collection('products').doc();
  const product = {
    id: productRef.id,
    outletId: outletId || '',
    sellerId,
    name,
    description: description || '',
    category: category || 'Kerajinan',
    price: {
      min: parseInt(price.min),
      ...(price.max ? { max: parseInt(price.max) } : {}),
    },
    stock: parseInt(stock) || 0,
    condition: condition || 'Baru',
    additionalInfo: additionalInfo.map(info => ({
      label: info.label.trim(),
      value: info.value.trim(),
    })),
    images: imageUrls,
    videoURL: '',
    tags: tags || [],
    featured: false,
    stats: {
      views: 0,
      likes: 0,
      sold: 0,
      rating: 0,
      reviewCount: 0,
    },
    isActive: true,
    isDeleted: false,
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  };
  
  await productRef.set(product);
  
  // Update outlet stats
  if (outletId) {
    const outletRef = db.collection('outlets').doc(outletId);
    const outletDoc = await outletRef.get();
    if (outletDoc.exists) {
      const currentStats = outletDoc.data().stats || {};
      await outletRef.update({
        'stats.totalProducts': (currentStats.totalProducts || 0) + 1,
        updatedAt: getTimestamp(),
      });
    }
  }
  
  return product;
};

export const getProducts = async (filters) => {
  try {
    // Start with base query - only use isActive to avoid composite index requirement
    // We'll filter other conditions in memory
    let query = db.collection('products').where('isActive', '==', true);
    
    // If only one filter (category OR featured), we can use it in query
    // Otherwise, we filter in memory to avoid composite index requirement
    const hasCategory = filters.category;
    const hasFeatured = filters.featured === 'true';
    
    if (hasCategory && !hasFeatured) {
      // Only category filter - safe to use in query
      query = query.where('category', '==', filters.category);
    } else if (hasFeatured && !hasCategory) {
      // Only featured filter - safe to use in query
      query = query.where('featured', '==', true);
    }
    // If both filters are present, we'll filter in memory
    
    // Order by createdAt - this requires index if combined with where
    // To avoid index requirement, we'll get data and sort in memory if multiple filters
    if (hasCategory && hasFeatured) {
      // Multiple filters - don't use orderBy in query, sort in memory
      const snapshot = await query.get();
      let products = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(product => {
          if (product.isDeleted) return false;
          if (hasCategory && product.category !== filters.category) return false;
          if (hasFeatured && !product.featured) return false;
          return true;
        })
        .sort((a, b) => {
          const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return bDate - aDate; // Descending
        });
      
      // Pagination
      const limit = parseInt(filters.limit) || 10;
      const page = parseInt(filters.page) || 1;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        products: products.slice(start, end),
        pagination: {
          page,
          limit,
          total: products.length,
          totalPages: Math.ceil(products.length / limit),
        },
      };
    } else {
      // Single filter or no filter - safe to use orderBy
      if (!hasCategory && !hasFeatured) {
        // No filters - just order by createdAt
        query = query.orderBy('createdAt', 'desc');
      } else if (hasCategory && !hasFeatured) {
        // Only category filter - can use orderBy with single where
        query = query.orderBy('createdAt', 'desc');
      } else if (hasFeatured && !hasCategory) {
        // Only featured filter - can use orderBy with single where
        query = query.orderBy('createdAt', 'desc');
      }
      
      // Pagination
      const limit = parseInt(filters.limit) || 10;
      const page = parseInt(filters.page) || 1;
      const snapshot = await query.limit(limit).get();
      
      // Filter out deleted products
      const products = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(product => !product.isDeleted);
      
      // Fetch outlet data for each product
      for (const product of products) {
        if (product.outletId) {
          try {
            const outletDoc = await db.collection('outlets').doc(product.outletId).get();
            if (outletDoc.exists) {
              product.outlet = {
                id: outletDoc.id,
                name: outletDoc.data().name,
                type: outletDoc.data().type,
              };
            }
          } catch (error) {
            console.error('Error fetching outlet:', error);
          }
        }
      }
      
      // Get total count (approximate)
      const totalSnapshot = await db.collection('products').where('isActive', '==', true).get();
      const total = totalSnapshot.size;
      
      return {
        products,
        pagination: {
          page,
          limit,
          total: products.length,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  } catch (error) {
    console.error('Error in getProducts:', error);
    
    // If index error, fallback to simpler query
    if (error.code === 9 || error.message?.includes('index')) {
      console.warn('Index error detected, falling back to simpler query');
      
      // Fallback: get all active products and filter in memory
      const snapshot = await db.collection('products').where('isActive', '==', true).get();
      
      let products = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(product => {
          if (product.isDeleted) return false;
          if (filters.category && product.category !== filters.category) return false;
          if (filters.featured === 'true' && !product.featured) return false;
          return true;
        })
        .sort((a, b) => {
          const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return bDate - aDate; // Descending
        });
      
      // Pagination
      const limit = parseInt(filters.limit) || 10;
      const page = parseInt(filters.page) || 1;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        products: products.slice(start, end),
        pagination: {
          page,
          limit,
          total: products.length,
          totalPages: Math.ceil(products.length / limit),
        },
      };
    }
    
    throw error;
  }
};

export const getProductById = async (productId, userId) => {
  const productDoc = await db.collection('products').doc(productId).get();
  
  if (!productDoc.exists) {
    throw new Error('Product not found');
  }
  
  const product = {
    id: productDoc.id,
    ...productDoc.data(),
  };
  
  // Fetch outlet data if outletId exists
  if (product.outletId) {
    try {
      const outletDoc = await db.collection('outlets').doc(product.outletId).get();
      if (outletDoc.exists) {
        product.outlet = {
          id: outletDoc.id,
          name: outletDoc.data().name,
          type: outletDoc.data().type,
        };
      }
    } catch (error) {
      console.error('Error fetching outlet:', error);
    }
  }
  
  // Increment view count if user is authenticated
  if (userId) {
    const currentStats = product.stats || {};
    await db.collection('products').doc(productId).update({
      'stats.views': (currentStats.views || 0) + 1,
      updatedAt: getTimestamp(),
    });
  }
  
  return product;
};

export const getProductsByOutlet = async (outletId, filters) => {
  let query = db.collection('products')
    .where('outletId', '==', outletId)
    .where('isActive', '==', true)
    .where('isDeleted', '==', false);
  
  if (filters.category) {
    query = query.where('category', '==', filters.category);
  }
  
  query = query.orderBy('createdAt', 'desc');
  
  const limit = parseInt(filters.limit) || 10;
  const snapshot = await query.limit(limit).get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const updateProduct = async (productId, sellerId, productData, files) => {
  // Verify ownership
  const product = await getProductById(productId);
  if (product.sellerId !== sellerId) {
    throw new Error('Not authorized to update this product');
  }
  
  // Upload new images if provided
  let imageUrls = product.images || [];
  if (files && files.length > 0) {
    const newImages = await uploadMultipleToCloudinary(files, 'products');
    imageUrls = [...imageUrls, ...newImages];
  }
  
  const updateData = {
    ...productData,
    images: imageUrls,
    updatedAt: getTimestamp(),
  };
  
  // Handle price structure
  if (productData.price) {
    updateData.price = {
      min: parseInt(productData.price.min),
      ...(productData.price.max ? { max: parseInt(productData.price.max) } : {}),
    };
  }
  
  await db.collection('products').doc(productId).update(updateData);
  
  return getProductById(productId);
};

export const deleteProduct = async (productId, sellerId) => {
  // Verify ownership
  const product = await getProductById(productId);
  if (product.sellerId !== sellerId) {
    throw new Error('Not authorized to delete this product');
  }
  
  // Soft delete
  await db.collection('products').doc(productId).update({
    isDeleted: true,
    isActive: false,
    updatedAt: getTimestamp(),
  });
  
  // Update outlet stats
  if (product.outletId) {
    const outletDoc = await db.collection('outlets').doc(product.outletId).get();
    if (outletDoc.exists) {
      const currentStats = outletDoc.data().stats || {};
      await db.collection('outlets').doc(product.outletId).update({
        'stats.totalProducts': Math.max(0, (currentStats.totalProducts || 0) - 1),
        updatedAt: getTimestamp(),
      });
    }
  }
};

export const toggleLike = async (productId, userId) => {
  const product = await getProductById(productId);
  
  // Check if user already liked
  const likesRef = db.collection('productLikes').doc(`${productId}_${userId}`);
  const likeDoc = await likesRef.get();
  
  const currentStats = product.stats || {};
  
  if (likeDoc.exists) {
    // Unlike
    await likesRef.delete();
    await db.collection('products').doc(productId).update({
      'stats.likes': Math.max(0, (currentStats.likes || 0) - 1),
      updatedAt: getTimestamp(),
    });
    return { liked: false };
  } else {
    // Like
    await likesRef.set({
      productId,
      userId,
      createdAt: getTimestamp(),
    });
    await db.collection('products').doc(productId).update({
      'stats.likes': (currentStats.likes || 0) + 1,
      updatedAt: getTimestamp(),
    });
    return { liked: true };
  }
};
