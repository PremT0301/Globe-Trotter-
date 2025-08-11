# GlobeTrotter Backend

## Quick start

1. Create `.env` and fill values:

```
MONGODB_URI=mongodb+srv://jjpatel24092004:Jay@24092004@cluster0.vvgv3hy.mongodb.net/
PORT=4000
JWT_SECRET=change_me_in_production
FRONTEND_URL=http://localhost:3000
```

2. Install deps:

```
npm install
```

3. (Optional) Seed your MongoDB with initial data using your own scripts.

4. Start server:

```
npm run dev
```

Health check at `GET /health`.

## API routes

- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/cities` (q, country)
- GET `/api/activities` (cityId, type, q)
- CRUD `/api/trips`
- GET `/api/itinerary/:tripId`, POST `/api/itinerary` (requires auth)
- GET `/api/budgets/:tripId`, POST `/api/budgets/:tripId` (requires auth)
- POST `/api/shared/:tripId`, GET `/api/shared/u/:slug`
- GET `/api/admin/stats`


