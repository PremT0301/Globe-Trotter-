# 🌍 Globetrotter Database Schema & ER Diagram

## 📊 Entity Relationship Diagram

```mermaid
erDiagram
    User {
        int id PK
        string name
        string email UK
        string password_hash
        string profile_photo
        string language_pref
        boolean email_verified
        string email_verification_token UK
        datetime email_verification_expires
        datetime created_at
        datetime updated_at
    }

    Trip {
        int id PK
        int user_id FK
        string trip_name
        string description
        datetime start_date
        datetime end_date
        string cover_photo
        datetime created_at
        datetime updated_at
    }

    City {
        int id PK
        string name
        string country
        float cost_index
        float popularity_score
    }

    Activity {
        int id PK
        int city_id FK
        string name
        string type
        decimal cost
        int duration
        string description
        string image_url
    }

    Itinerary {
        int id PK
        int trip_id FK
        int city_id FK
        datetime date
        int activity_id FK
        int order_index
    }

    Budget {
        int id PK
        int trip_id FK UK
        decimal total_estimated_cost
        decimal transport_cost
        decimal accommodation_cost
        decimal activities_cost
        decimal daily_average_cost
    }

    SharedTrip {
        int id PK
        int trip_id FK
        string public_url UK
        datetime share_date
    }

    AdminStat {
        int id PK
        string metric_name
        float metric_value
        datetime date
    }

    %% Relationships
    User ||--o{ Trip : "creates"
    Trip ||--o{ Itinerary : "contains"
    Trip ||--|| Budget : "has"
    Trip ||--o{ SharedTrip : "shares"
    City ||--o{ Activity : "offers"
    City ||--o{ Itinerary : "visited_in"
    Activity ||--o{ Itinerary : "scheduled_in"

    %% Indexes and Constraints
    note for City "Unique: [name, country]"
    note for Itinerary "Unique: [trip_id, date, order_index]"
    note for User "Email verification required"
    note for Budget "One budget per trip"
    note for SharedTrip "Unique public URLs"
```

## 🏗️ Database Schema Details

### **User Table** 👤
**Purpose**: Core user accounts with email verification
```sql
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    profile_photo VARCHAR,
    language_pref VARCHAR,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR UNIQUE,
    email_verification_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features**:
- ✅ **Email verification required** before login
- ✅ **Strong password hashing** with bcrypt
- ✅ **Verification tokens** expire in 24 hours
- ✅ **Language preferences** for internationalization

---

### **Trip Table** ✈️
**Purpose**: User's travel plans and itineraries
```sql
CREATE TABLE "Trip" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "User"(id) ON DELETE CASCADE,
    trip_name VARCHAR NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    cover_photo VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Key Features**:
- ✅ **User ownership** with cascade deletion
- ✅ **Date range** for trip duration
- ✅ **Cover photos** for visual appeal
- ✅ **Timestamps** for tracking

---

### **City Table** 🏙️
**Purpose**: Master data for cities and destinations
```sql
CREATE TABLE "City" (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    cost_index DECIMAL(5,2),
    popularity_score DECIMAL(5,2),
    UNIQUE(name, country)
);
```

**Key Features**:
- ✅ **Composite unique** constraint on [name, country]
- ✅ **Cost index** for budget planning
- ✅ **Popularity score** for recommendations
- ✅ **Indexed** for fast searches

---

### **Activity Table** 🎯
**Purpose**: Things to do in each city
```sql
CREATE TABLE "Activity" (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES "City"(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    cost DECIMAL(10,2),
    duration INTEGER,
    description TEXT,
    image_url VARCHAR
);
```

**Key Features**:
- ✅ **City-specific** activities
- ✅ **Cost and duration** for planning
- ✅ **Categorized** by type (sightseeing, food, etc.)
- ✅ **Image support** for visual appeal

---

### **Itinerary Table** 🗓️
**Purpose**: Day-by-day trip planning
```sql
CREATE TABLE "Itinerary" (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES "Trip"(id) ON DELETE CASCADE,
    city_id INTEGER REFERENCES "City"(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    activity_id INTEGER REFERENCES "Activity"(id) ON DELETE SET NULL,
    order_index INTEGER NOT NULL,
    UNIQUE(trip_id, date, order_index)
);
```

**Key Features**:
- ✅ **Unique constraint** prevents duplicate entries
- ✅ **Flexible planning** with optional activities
- ✅ **Ordered entries** for daily schedules
- ✅ **Cascade deletion** maintains integrity

---

### **Budget Table** 💰
**Purpose**: Financial planning for trips
```sql
CREATE TABLE "Budget" (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER UNIQUE REFERENCES "Trip"(id) ON DELETE CASCADE,
    total_estimated_cost DECIMAL(12,2),
    transport_cost DECIMAL(12,2),
    accommodation_cost DECIMAL(12,2),
    activities_cost DECIMAL(12,2),
    daily_average_cost DECIMAL(12,2)
);
```

**Key Features**:
- ✅ **One budget per trip** (1:1 relationship)
- ✅ **Detailed cost breakdown** by category
- ✅ **Daily averages** for planning
- ✅ **Precise decimal** calculations

---

### **SharedTrip Table** 🔗
**Purpose**: Public sharing of trip itineraries
```sql
CREATE TABLE "SharedTrip" (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES "Trip"(id) ON DELETE CASCADE,
    public_url VARCHAR UNIQUE NOT NULL,
    share_date TIMESTAMP DEFAULT NOW()
);
```

**Key Features**:
- ✅ **Unique public URLs** for sharing
- ✅ **Share timestamps** for tracking
- ✅ **Cascade deletion** with trips

---

### **AdminStat Table** 📈
**Purpose**: System metrics and analytics
```sql
CREATE TABLE "AdminStat" (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR NOT NULL,
    metric_value DECIMAL NOT NULL,
    date TIMESTAMP NOT NULL
);
```

**Key Features**:
- ✅ **Flexible metrics** system
- ✅ **Time-series data** for trends
- ✅ **Indexed** for fast queries

---

## 🔗 Relationship Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| **User → Trip** | 1:N | One user can have many trips |
| **Trip → Itinerary** | 1:N | One trip can have many itinerary entries |
| **Trip → Budget** | 1:1 | One trip has exactly one budget |
| **Trip → SharedTrip** | 1:N | One trip can have multiple share links |
| **City → Activity** | 1:N | One city can have many activities |
| **City → Itinerary** | 1:N | One city can be visited in many itineraries |
| **Activity → Itinerary** | 1:N | One activity can be scheduled in many itineraries |

## 🎯 Key Design Principles

### **1. Data Integrity**
- ✅ **Foreign key constraints** with proper cascade rules
- ✅ **Unique constraints** prevent duplicate data
- ✅ **Check constraints** ensure valid data ranges

### **2. Performance**
- ✅ **Strategic indexing** on frequently queried fields
- ✅ **Composite indexes** for complex queries
- ✅ **Efficient data types** (DECIMAL for money, TIMESTAMP for dates)

### **3. Scalability**
- ✅ **Normalized structure** reduces data redundancy
- ✅ **Flexible schema** allows for future enhancements
- ✅ **Efficient relationships** minimize join complexity

### **4. Security**
- ✅ **Email verification** prevents fake accounts
- ✅ **Password hashing** protects user credentials
- ✅ **Token expiration** prevents abuse

## 🚀 Database Features

### **Indexes**
```sql
-- Performance indexes
CREATE INDEX idx_trip_user_id ON "Trip"(user_id);
CREATE INDEX idx_itinerary_trip_date ON "Itinerary"(trip_id, date);
CREATE INDEX idx_activity_city_id ON "Activity"(city_id);
CREATE INDEX idx_city_name_country ON "City"(name, country);
CREATE INDEX idx_admin_metric_date ON "AdminStat"(metric_name, date);
```

### **Constraints**
```sql
-- Data validation
ALTER TABLE "Trip" ADD CONSTRAINT check_dates CHECK (end_date > start_date);
ALTER TABLE "City" ADD CONSTRAINT check_scores CHECK (popularity_score >= 0 AND popularity_score <= 100);
ALTER TABLE "Activity" ADD CONSTRAINT check_duration CHECK (duration > 0);
```

### **Triggers**
```sql
-- Auto-update timestamps
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

This schema provides a robust foundation for a travel planning application with proper data relationships, security features, and performance optimizations! 🌍✨
