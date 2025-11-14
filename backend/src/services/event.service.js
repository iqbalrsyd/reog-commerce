import { db } from '../config/firebase.js';
import admin from 'firebase-admin';
import { uploadMultipleToCloudinary } from '../utils/upload.js';
import { getTimestamp } from '../utils/helpers.js';

/**
 * Create event
 */
export const createEvent = async (organizerId, eventData, files) => {
  const {
    name,
    description,
    category,
    date,
    startTime,
    endTime,
    location,
    capacity,
    ticketCategories,
    outletId,
    eventProgram,
    tags,
    videoURL,
  } = eventData;

  // Validate required fields
  if (!name || !description || !category || !date || !location || !capacity) {
    throw new Error('Missing required fields');
  }

  // Validate ticket categories
  if (!ticketCategories || !Array.isArray(ticketCategories) || ticketCategories.length === 0) {
    throw new Error('At least one ticket category is required');
  }

  // Calculate total capacity and remaining tickets
  const totalCapacity = ticketCategories.reduce((sum, cat) => sum + (cat.quota || 0), 0);
  const remainingTickets = totalCapacity;

  // Upload images to Cloudinary
  let imageUrls = [];
  if (files && files.length > 0) {
    imageUrls = await uploadMultipleToCloudinary(files, 'events');
  }

  // Create event document
  const eventRef = db.collection('events').doc();
  const event = {
    id: eventRef.id,
    outletId: outletId || '',
    organizerId,
    name,
    description: description || '',
    category: category || 'Festival',
    date: new Date(date),
    startTime: startTime || '19:00',
    endTime: endTime || '23:00',
    location: {
      name: location.name || '',
      address: location.address || '',
      coordinates: location.coordinates || null,
    },
    capacity: parseInt(capacity) || 0,
    remainingTickets,
    ticketCategories: ticketCategories.map((cat) => ({
      category: cat.category || '',
      price: parseInt(cat.price) || 0,
      benefits: cat.benefits || '',
      quota: parseInt(cat.quota) || 0,
      sold: 0,
    })),
    images: imageUrls,
    videoURL: videoURL || '',
    eventProgram: eventProgram || [],
    tags: tags || [],
    stats: {
      views: 0,
      interested: 0,
      ticketsSold: 0,
      rating: 0,
      reviewCount: 0,
    },
    status: 'upcoming',
    isActive: true,
    featured: false,
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
  };

  await eventRef.set(event);

  // Update outlet stats
  if (outletId) {
    const outletDoc = await db.collection('outlets').doc(outletId).get();
    if (outletDoc.exists) {
      const currentStats = outletDoc.data().stats || {};
      await db.collection('outlets').doc(outletId).update({
        'stats.totalEvents': (currentStats.totalEvents || 0) + 1,
        updatedAt: getTimestamp(),
      });
    }
  }

  return event;
};

/**
 * Get events with filters
 */
export const getEvents = async (filters) => {
  try {
    // Start with base query - only use isActive to avoid composite index requirement
    let query = db.collection('events').where('isActive', '==', true);
    
    // Count filters to determine if we need to filter in memory
    const hasCategory = filters.category;
    const hasStatus = filters.status;
    const hasFeatured = filters.featured === 'true';
    const filterCount = [hasCategory, hasStatus, hasFeatured].filter(Boolean).length;
    
    // If multiple filters, filter in memory to avoid composite index
    if (filterCount > 1) {
      const snapshot = await query.get();
      let events = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(event => {
          if (hasCategory && event.category !== filters.category) return false;
          if (hasStatus && event.status !== filters.status) return false;
          if (hasFeatured && !event.featured) return false;
          return true;
        })
        .sort((a, b) => {
          const aDate = a.date?.toDate?.() || new Date(a.date || 0);
          const bDate = b.date?.toDate?.() || new Date(b.date || 0);
          return aDate - bDate; // Ascending (upcoming first)
        });
      
      // Pagination
      const limit = parseInt(filters.limit) || 10;
      const page = parseInt(filters.page) || 1;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        events: events.slice(start, end),
        pagination: {
          page,
          limit,
          total: events.length,
          totalPages: Math.ceil(events.length / limit),
        },
      };
    } else {
      // Single filter or no filter - safe to use in query
      if (hasCategory) {
        query = query.where('category', '==', filters.category);
      } else if (hasStatus) {
        query = query.where('status', '==', filters.status);
      } else if (hasFeatured) {
        query = query.where('featured', '==', true);
      }
      
      // Order by date - safe if only one where clause
      query = query.orderBy('date', 'asc');
      
      // Pagination
      const limit = parseInt(filters.limit) || 10;
      const page = parseInt(filters.page) || 1;
      const snapshot = await query.limit(limit).get();
      
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Get total count (approximate)
      const totalSnapshot = await db.collection('events').where('isActive', '==', true).get();
      const total = totalSnapshot.size;
      
      return {
        events,
        pagination: {
          page,
          limit,
          total: events.length,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  } catch (error) {
    console.error('Error in getEvents:', error);
    
    // If index error, fallback to simpler query
    if (error.code === 9 || error.message?.includes('index')) {
      // Only log in development to avoid console spam
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Index error detected, falling back to simpler query');
      }
      
      // Fallback: get all active events and filter in memory
      const snapshot = await db.collection('events').where('isActive', '==', true).get();
      
      let events = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(event => {
          if (filters.category && event.category !== filters.category) return false;
          if (filters.status && event.status !== filters.status) return false;
          if (filters.featured === 'true' && !event.featured) return false;
          return true;
        })
        .sort((a, b) => {
          const aDate = a.date?.toDate?.() || new Date(a.date || 0);
          const bDate = b.date?.toDate?.() || new Date(b.date || 0);
          return aDate - bDate; // Ascending
        });
      
      // Pagination
      const limit = parseInt(filters.limit) || 10;
      const page = parseInt(filters.page) || 1;
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        events: events.slice(start, end),
        pagination: {
          page,
          limit,
          total: events.length,
          totalPages: Math.ceil(events.length / limit),
        },
      };
    }
    
    throw error;
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (eventId, userId) => {
  const eventDoc = await db.collection('events').doc(eventId).get();

  if (!eventDoc.exists) {
    throw new Error('Event not found');
  }

  const event = {
    id: eventDoc.id,
    ...eventDoc.data(),
  };

  // Increment view count if user is authenticated
  if (userId) {
    const currentStats = event.stats || {};
    await db.collection('events').doc(eventId).update({
      'stats.views': (currentStats.views || 0) + 1,
      updatedAt: getTimestamp(),
    });
  }

  return event;
};

/**
 * Get events by outlet
 */
export const getEventsByOutlet = async (outletId, filters) => {
  let query = db.collection('events')
    .where('outletId', '==', outletId)
    .where('isActive', '==', true);

  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }

  query = query.orderBy('date', 'asc');

  const limit = parseInt(filters.limit) || 10;
  const snapshot = await query.limit(limit).get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Update event
 */
export const updateEvent = async (eventId, organizerId, eventData, files) => {
  // Verify ownership
  const event = await getEventById(eventId);
  if (event.organizerId !== organizerId) {
    throw new Error('Not authorized to update this event');
  }

  // Upload new images if provided
  let imageUrls = event.images || [];
  if (files && files.length > 0) {
    const newImages = await uploadMultipleToCloudinary(files, 'events');
    imageUrls = [...imageUrls, ...newImages];
  }

  // Prepare update data - only update provided fields
  const updateData = {
    updatedAt: getTimestamp(),
  };

  // Update fields only if provided
  if (eventData.name !== undefined) updateData.name = eventData.name;
  if (eventData.description !== undefined) updateData.description = eventData.description;
  if (eventData.category !== undefined) updateData.category = eventData.category;
  if (eventData.startTime !== undefined) updateData.startTime = eventData.startTime;
  if (eventData.endTime !== undefined) updateData.endTime = eventData.endTime;
  if (eventData.capacity !== undefined) updateData.capacity = parseInt(eventData.capacity);
  if (eventData.eventProgram !== undefined) updateData.eventProgram = eventData.eventProgram;
  if (eventData.tags !== undefined) updateData.tags = eventData.tags;
  if (eventData.videoURL !== undefined) updateData.videoURL = eventData.videoURL;
  if (eventData.status !== undefined) updateData.status = eventData.status;
  if (eventData.featured !== undefined) updateData.featured = eventData.featured;
  
  // Update images if new images are uploaded
  if (files && files.length > 0) {
    updateData.images = imageUrls;
  }

  // Handle date conversion
  if (eventData.date) {
    updateData.date = new Date(eventData.date);
  }

  // Handle location
  if (eventData.location) {
    updateData.location = {
      name: eventData.location.name || (event.location?.name || ''),
      address: eventData.location.address || (event.location?.address || ''),
      coordinates: eventData.location.coordinates || (event.location?.coordinates || null),
    };
  }

  // Handle ticket categories
  if (eventData.ticketCategories) {
    updateData.ticketCategories = eventData.ticketCategories.map((cat) => ({
      category: cat.category || '',
      price: parseInt(cat.price) || 0,
      benefits: cat.benefits || '',
      quota: parseInt(cat.quota) || 0,
      sold: cat.sold || 0,
    }));

    // Recalculate remaining tickets
    const totalCapacity = updateData.ticketCategories.reduce((sum, cat) => sum + (cat.quota || 0), 0);
    const totalSold = updateData.ticketCategories.reduce((sum, cat) => sum + (cat.sold || 0), 0);
    updateData.remainingTickets = Math.max(0, totalCapacity - totalSold);
  }

  await db.collection('events').doc(eventId).update(updateData);

  return getEventById(eventId);
};

/**
 * Delete event (soft delete)
 */
export const deleteEvent = async (eventId, organizerId) => {
  // Verify ownership
  const event = await getEventById(eventId);
  if (event.organizerId !== organizerId) {
    throw new Error('Not authorized to delete this event');
  }

  // Soft delete
  await db.collection('events').doc(eventId).update({
    isActive: false,
    status: 'cancelled',
    updatedAt: getTimestamp(),
  });

  // Update outlet stats
  if (event.outletId) {
    const outletDoc = await db.collection('outlets').doc(event.outletId).get();
    if (outletDoc.exists) {
      const currentStats = outletDoc.data().stats || {};
      await db.collection('outlets').doc(event.outletId).update({
        'stats.totalEvents': Math.max(0, (currentStats.totalEvents || 0) - 1),
        updatedAt: getTimestamp(),
      });
    }
  }
};

