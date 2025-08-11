# Database Schema Update

## Overview
The database schema has been updated to match the ER diagram specification. The main changes involve properly implementing the Activity entity and its relationships.

## Key Changes

### 1. Activity Model (`src/models/Activity.js`)
- **Purpose**: Stores activity information for cities
- **Fields**:
  - `cityId`: Reference to City (FK)
  - `name`: Activity name
  - `type`: Activity type (attraction, restaurant, hotel, transport, activity)
  - `cost`: Activity cost (default: 0)
  - `duration`: Duration in minutes (default: 60)
  - `description`: Activity description
  - `imageUrl`: Image URL for the activity
  - `createdAt`, `updatedAt`: Timestamps

### 2. Itinerary Model (`src/models/Itinerary.js`)
- **Updated**: Now properly references Activity entity
- **Fields**:
  - `tripId`: Reference to Trip (FK)
  - `cityId`: Reference to City (FK)
  - `date`: Date of the itinerary item
  - `activityId`: Reference to Activity (FK) - **NEW RELATIONSHIP**
  - `orderIndex`: Order of activities for the day
  - `notes`: Additional notes (not activity data)

### 3. New Activity Routes (`src/routes/activities.js`)
- **GET** `/api/activities/city/:cityId` - Get all activities for a city
- **GET** `/api/activities/city/:cityId/type/:type` - Get activities by type
- **POST** `/api/activities` - Create new activity
- **PUT** `/api/activities/:id` - Update activity
- **DELETE** `/api/activities/:id` - Delete activity
- **GET** `/api/activities/:id` - Get activity by ID

## Migration from Old Schema

### Previous Implementation
- Activity data was stored as JSON in the `notes` field of Itinerary
- No proper Activity entity existed

### New Implementation
- Activities are stored in a dedicated Activity table
- Itinerary items reference activities via `activityId`
- Proper normalization and relationships

## Running the Migration

To migrate existing data from the old schema to the new one:

```bash
cd Backend
node migrate-activities.js
```

This script will:
1. Find all itinerary items with activity data in the `notes` field
2. Create new Activity records for each activity
3. Update itinerary items to reference the new activities
4. Clean up the `notes` field to contain only actual notes

## Frontend Changes

### ItineraryBuilder Component
- Updated to create activities in the Activity table first
- Then creates itinerary entries linking to the activities
- Updated data loading to handle both new and legacy data formats

### ActivityForm Component
- Now includes cost field in the activity data
- Passes cost information to the parent component

## Database Relationships (ER Diagram Compliance)

1. **User → Trip**: One-to-Many
2. **City → Activity**: One-to-Many
3. **Trip → Itinerary**: One-to-Many
4. **City → Itinerary**: One-to-Many
5. **Activity → Itinerary**: One-to-Many
6. **Trip → Budget**: One-to-One
7. **Trip → SharedTrip**: One-to-Many

## Benefits of New Schema

1. **Proper Normalization**: Activities are stored once and referenced multiple times
2. **Data Integrity**: Foreign key constraints ensure data consistency
3. **Scalability**: Easier to manage and query activities
4. **Flexibility**: Activities can be reused across different trips
5. **Performance**: Better indexing and query optimization

## Notes

- The migration script handles legacy data gracefully
- New activities will be created in the Activity table
- Existing itinerary items will be updated to reference activities
- The system supports both new and legacy data formats during transition
