import * as userService from '../services/user.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.uid);
  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.user.uid, req.body);
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  const user = await userService.uploadAvatar(req.user.uid, req.file);
  res.json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: user,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json({
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});

