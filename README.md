# Coy Discover

A full-stack dating discovery application inspired by modern swipe-based matching platforms.

Coy Discover allows users to explore profiles, like or pass on people, and discover mutual matches through an interactive interface.

## Features

- Browse profiles with photos, bios, interests and locations.
- Like or pass on profiles.
- Persistent swipe history.
- Automatic mutual matching.
- Match notifications and popup.
- Dedicated Matches page.
- Duplicate swipe prevention.
- Seeded demo profiles.
- JSON-based persistent storage.
- Responsive user interface.

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Axios
- Framer Motion
- Lucide React
- Tailwind CSS

### Backend
- Node.js
- Express 5
- TypeScript
- Zod
- JSON file-based storage

## Project Structure

coy-discover/
├── client/
│   ├── public/
│   └── src/
├── server/
│   ├── src/
│   │   ├── data/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   └── data/
├── .gitignore
└── README.md

## Getting Started

### Prerequisites

- Node.js
- npm

### 1. Clone the repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd coy-discover

### 2. Install frontend dependencies

cd client
npm install

### 3. Install backend dependencies

Open another terminal:

cd server
npm install

### 4. Start the backend

Inside the server directory:

npm run dev

The backend runs at:

http://localhost:5000

Health check:

http://localhost:5000/api/health

### 5. Start the frontend

Inside the client directory:

npm run dev

The frontend runs at:

http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Backend health check |
| GET | /api/feed | Retrieve available profiles |
| POST | /api/swipe | Like or pass on a profile |
| GET | /api/matches | Retrieve mutual matches |

### Swipe Request Example

{
  "profileId": "p14",
  "action": "like"
}

Supported actions:

- like
- pass

Repeated swipes on the same profile are rejected.

## Data Persistence

The application uses a local JSON database.

On the first backend startup, the application creates a database containing seeded profiles and demo incoming likes.

Subsequent changes, including swipes and matches, are saved to the JSON database and persist across server restarts.

The generated database is intentionally excluded from Git.

## Available Scripts

### Frontend

- npm run dev — Start development server.
- npm run build — Build production frontend.
- npm run lint — Run lint checks.
- npm run preview — Preview production build.

### Backend

- npm run dev — Start development server.
- npm run build — Compile TypeScript.
- npm run typecheck — Check TypeScript types.
- npm start — Start compiled server.

## Demo

The application uses a seeded demo user and sample profiles for testing.

## License

This project was developed as an application assignment.
