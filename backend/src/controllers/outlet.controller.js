import * as outletService from '../services/outlet.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createOutlet = asyncHandler(async (req, res) => {
  const outlet = await outletService.createOutlet(req.user.uid, req.body);
  res.status(201).json({
    success: true,
    message: 'Outlet created successfully',
    data: outlet,
  });
});

export const getMyOutlets = asyncHandler(async (req, res) => {
  const outlets = await outletService.getOutletsByOwner(req.user.uid);
  res.json({
    success: true,
    message: 'Outlets retrieved successfully',
    data: outlets,
  });
});

export const getOutletById = asyncHandler(async (req, res) => {
  const outlet = await outletService.getOutletById(req.params.id);
  res.json({
    success: true,
    message: 'Outlet retrieved successfully',
    data: outlet,
  });
});

export const updateOutlet = asyncHandler(async (req, res) => {
  const outlet = await outletService.updateOutlet(req.params.id, req.user.uid, req.body);
  res.json({
    success: true,
    message: 'Outlet updated successfully',
    data: outlet,
  });
});

export const deleteOutlet = asyncHandler(async (req, res) => {
  await outletService.deleteOutlet(req.params.id, req.user.uid);
  res.json({
    success: true,
    message: 'Outlet deleted successfully',
  });
});

