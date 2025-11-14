import * as eventService from '../services/event.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createEvent = asyncHandler(async (req, res) => {
  // Parse JSON data from form-data
  const eventData = typeof req.body.data === 'string' 
    ? JSON.parse(req.body.data) 
    : req.body;
  
  const event = await eventService.createEvent(req.user.uid, eventData, req.files);
  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event,
  });
});

export const getEvents = asyncHandler(async (req, res) => {
  const events = await eventService.getEvents(req.query);
  res.json({
    success: true,
    message: 'Events retrieved successfully',
    data: events,
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id, req.user?.uid);
  res.json({
    success: true,
    message: 'Event retrieved successfully',
    data: event,
  });
});

export const getEventsByOutlet = asyncHandler(async (req, res) => {
  const events = await eventService.getEventsByOutlet(req.params.outletId, req.query);
  res.json({
    success: true,
    message: 'Events retrieved successfully',
    data: events,
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  // Parse JSON data from form-data
  const eventData = typeof req.body.data === 'string' 
    ? JSON.parse(req.body.data) 
    : req.body;
  
  const event = await eventService.updateEvent(req.params.id, req.user.uid, eventData, req.files);
  res.json({
    success: true,
    message: 'Event updated successfully',
    data: event,
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id, req.user.uid);
  res.json({
    success: true,
    message: 'Event deleted successfully',
  });
});

