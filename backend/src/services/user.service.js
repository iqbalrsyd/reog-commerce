import { db } from '../config/firebase.js';
import { uploadToCloudinary } from '../utils/upload.js';
import { getTimestamp } from '../utils/helpers.js';

export const getUserById = async (uid) => {
  const userDoc = await db.collection('users').doc(uid).get();
  
  if (!userDoc.exists) {
    throw new Error('User not found');
  }
  
  return {
    uid: userDoc.id,
    ...userDoc.data(),
  };
};

export const updateUser = async (uid, userData) => {
  const updateData = {
    ...userData,
    updatedAt: getTimestamp(),
  };
  
  await db.collection('users').doc(uid).update(updateData);
  
  return getUserById(uid);
};

export const uploadAvatar = async (uid, file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Determine resource type
  const isVideo = file.mimetype && file.mimetype.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';
  
  // Upload to Cloudinary
  const photoURL = await uploadToCloudinary(file.buffer, file.originalname || 'avatar', 'avatars', resourceType);
  
  // Update user document
  await db.collection('users').doc(uid).update({
    photoURL,
    updatedAt: getTimestamp(),
  });
  
  return getUserById(uid);
};
