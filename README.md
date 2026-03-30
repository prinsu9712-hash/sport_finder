# PlayCircle

PlayCircle is a local sports and indoor games partner finder platform built as a split-stack project:

- `frontend/`: Next.js + React responsive web app with an animated, modern interface
- `backend/`: Node.js + Express REST API with MongoDB models for users, communities, game categories, and play requests

## Product coverage

This scaffold maps the core requirements you shared:

- User registration and profile structure
- Preferred games, skill level, availability, and location preferences
- Nearby player discovery by filters
- Play request creation and response flow
- Optional community / organizer module
- Admin overview for activity monitoring
- Responsive UI for desktop and mobile

## Main API routes

- `GET /api/health`
- `GET /api/games`
- `POST /api/users/register`
- `GET /api/users`
- `GET /api/users/discover`
- `POST /api/requests`
- `GET /api/requests`
- `PATCH /api/requests/:id/respond`
- `POST /api/communities`
- `GET /api/communities`
- `GET /api/admin/overview`
- `POST /api/seed`

## Local setup

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Suggested next steps

- Add authentication with hashed passwords and JWT/session handling
- Replace mock frontend data with real backend fetch calls
- Add geolocation coordinates and map integration
- Add moderation queue and reporting flows
- Define and implement the requested Pandit onboarding module if it is needed
