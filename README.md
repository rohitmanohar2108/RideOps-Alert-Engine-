# RideOps Alert Management System

Full-stack web application for managing ride-sharing alerts in real time.

## Tech Stack

- Frontend: React, Tailwind CSS, Chart.js
- Backend: Node.js, Express
- Database: MongoDB
- Architecture: MVC, Service layer
- Security: CORS, input validation

## Setup

### Backend

1. Copy `backend/.env.example` to `backend/.env` and fill in your MongoDB URI and other values.
2. Install dependencies: `cd backend && npm install`.
3. Start the server in development: `npm run dev`.

### Frontend

1. Install dependencies: `cd frontend && npm install`.
2. Start React development server: `npm start`.
3. The frontend will proxy API calls to the backend when both are running.

### Git

Ensure you commit regularly and avoid checking in `.env` files or secret keys.

