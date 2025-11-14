import * as authService from '../services/auth.service.js';
import { successResponse, serverErrorResponse, unauthorizedResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res) => {
  try {
    const { email, password, name, origin, category, phoneNumber } = req.body;
    const result = await authService.register({ email, password, name, origin, category, phoneNumber });
    return successResponse(res, result, 'User registered successfully', 201);
  } catch (error) {
    console.error('Error in auth.controller.js register:', error);
    if (error.message === 'Email already registered') {
      return errorResponse(res, error.message, 'BAD_REQUEST', null, 400);
    }
    return serverErrorResponse(res, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return successResponse(res, result, 'User logged in successfully');
  } catch (error) {
    console.error('Error in auth.controller.js login:', error);
    if (error.message === 'User not found' || error.message === 'User profile not found' || error.message === 'Invalid credentials') {
      return unauthorizedResponse(res, 'Invalid credentials');
    }
    return serverErrorResponse(res, error.message);
  }
};

export const logout = async (req, res) => {
  try {
    const result = await authService.logout();
    return successResponse(res, result, 'User logged out successfully');
  } catch (error) {
    console.error('Error in auth.controller.js logout:', error);
    return serverErrorResponse(res, error.message);
  }
};

export const getMe = async (req, res) => {
  try {
    // Assuming req.user is populated by authentication middleware
    const uid = req.user.uid;
    const user = await authService.getUserById(uid);
    return successResponse(res, user, 'User data retrieved successfully');
  } catch (error) {
    console.error('Error in auth.controller.js getMe:', error);
    if (error.message === 'User not found') {
      return unauthorizedResponse(res, error.message);
    }
    return serverErrorResponse(res, error.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await authService.getUserData(uid);
    return successResponse(res, user, 'User data retrieved successfully');
  } catch (error) {
    console.error('Error in auth.controller.js getUser:', error);
    if (error.message === 'User not found') {
      return errorResponse(res, error.message, 'NOT_FOUND', null, 404);
    }
    return serverErrorResponse(res, error.message);
  }
};
