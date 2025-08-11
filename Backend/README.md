# GlobeTrotter Backend

## Quick start

1. Copy `.env.example` to `.env` and fill values:

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/globetrotter?schema=public"
PORT=4000
JWT_SECRET=change_me_in_production
```

2. Install deps and generate Prisma client:

```
npm install
npx prisma generate
```

3. Run migrations:

```
npx prisma migrate dev --name init
```

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


