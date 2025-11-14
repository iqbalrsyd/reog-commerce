import { db } from '../config/firebase.js';
import admin from 'firebase-admin';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../utils/upload.js';
import { getTimestamp } from '../utils/helpers.js';

export const createOutlet = async (ownerId, outletData) => {
  const { name, type, description, location, contact, logoURL, bannerURL } = outletData;
  
  // Create outlet document
  const outletRef = db.collection('outlets').doc();
  const outlet = {
    id: outletRef.id,
    ownerId,
    name,
    type: type || 'produk',
    description: description || '',
    location: location || '',
    contact: contact || '',
    logoURL: logoURL || '',
    bannerURL: bannerURL || '',
    stats: {
      totalProducts: 0,
      totalEvents: 0,
      totalOrders: 0,
      rating: 0,
      reviewCount: 0,
    },
    isActive: true,
    isVerified: false,
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  };
  
  await outletRef.set(outlet);
  
  // Update user sellerInfo
  await db.collection('users').doc(ownerId).update({
    'sellerInfo.hasOutlet': true,
    'sellerInfo.outletId': outletRef.id,
    'sellerInfo.joinedAsSellerAt': getTimestamp(),
    role: 'seller',
    updatedAt: getTimestamp(),
  });
  
  return outlet;
};

export const getOutletsByOwner = async (ownerId) => {
  const snapshot = await db.collection('outlets')
    .where('ownerId', '==', ownerId)
    .get();
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getOutletById = async (outletId) => {
  const outletDoc = await db.collection('outlets').doc(outletId).get();
  
  if (!outletDoc.exists) {
    throw new Error('Outlet not found');
  }
  
  return {
    id: outletDoc.id,
    ...outletDoc.data(),
  };
};

export const updateOutlet = async (outletId, ownerId, outletData) => {
  // Verify ownership
  const outlet = await getOutletById(outletId);
  if (outlet.ownerId !== ownerId) {
    throw new Error('Not authorized to update this outlet');
  }
  
  const updateData = {
    ...outletData,
    updatedAt: getTimestamp(),
  };
  
  await db.collection('outlets').doc(outletId).update(updateData);
  
  return getOutletById(outletId);
};

export const deleteOutlet = async (outletId, ownerId) => {
  // Verify ownership
  const outlet = await getOutletById(outletId);
  if (outlet.ownerId !== ownerId) {
    throw new Error('Not authorized to delete this outlet');
  }
  
  // Soft delete
  await db.collection('outlets').doc(outletId).update({
    isActive: false,
    updatedAt: getTimestamp(),
  });
  
  // Update user sellerInfo
  await db.collection('users').doc(ownerId).update({
    'sellerInfo.hasOutlet': false,
    updatedAt: getTimestamp(),
  });
};
