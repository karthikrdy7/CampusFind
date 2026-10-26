# CampusLostFound

CampusLostFound is a campus-oriented lost and found platform that helps students and staff report missing items, list found belongings, and track recovery status.

## Overview

The application has two main parts:

- Frontend: React + Vite client for browsing reports and submitting lost/found entries
- Backend: Node.js + Express API with MongoDB for persistent storage

Users can:

- report a lost item
- report a found item
- browse recent reports
- update an item status as recovered
- delete stale reports

## Features

- responsive landing page and report form
- lost/found item submission
- recent reports list with refresh support
- MongoDB-backed CRUD API
- status updates for recovered items
- category, location, color, and contact details support

## Tech Stack

Frontend
- React
- Vite
- React Router DOM

Backend
- Node.js
- Express
- MongoDB with Mongoose
- CORS
- dotenv

## Project Structure

```bash
campus-lost-found/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── server/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── package-lock.json
└── README.md (optional at repo root)
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection
- npm or another package manager

## Environment Setup

Create a `.env` file inside the `server` folder:

```env
MONGO_URI=mongodb://localhost:27017/campusLostFound
PORT=5001
```

If you use MongoDB Atlas, replace the URI with your connection string.

## Installation

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd server
npm install
```

## Running the Application

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend development server in a separate terminal:

```bash
cd client
npm run dev
```

The frontend usually runs on:

- http://localhost:5173

The backend API runs on:

- http://localhost:5001

## API Endpoints

Base URL: `http://localhost:5001/api/items`

### GET /api/items
Returns all items in descending creation order.

### GET /api/items/:id
Returns one item by ID.

### POST /api/items
Creates a new report.

Example body:

```json
{
  "itemName": "AirPods Pro",
  "type": "Lost",
  "category": "Electronics",
  "description": "White case with left earbud missing",
  "location": "Central Library",
  "date": "2026-10-05",
  "color": "White",
  "contact": "9876543210",
  "image": ""
}
```

### PUT /api/items/:id
Updates an existing item. Common update includes status changes such as:

```json
{
  "status": "Recovered"
}
```

### DELETE /api/items/:id
Deletes an item.

## Data Model

The MongoDB `Item` schema includes:

- `itemName` : required string
- `type` : `Lost` or `Found`
- `category` : required string
- `description` : required string
- `location` : required string
- `date` : required date
- `color` : optional string
- `contact` : required string
- `image` : optional string
- `status` : `Active` or `Recovered`
- timestamps via `createdAt` and `updatedAt`

## Usage

1. Open the frontend in the browser.
2. Choose to report a lost or found item.
3. Fill in the form with item details and contact info.
4. Submit the report.
5. Browse the latest reports and mark items as recovered when appropriate.

## Notes

- The frontend calls the backend through `client/src/services/api.js`.
- The backend uses Express routes defined in `server/routes/itemRoutes.js`.
- The app is built for demo and campus deployment scenarios and can be extended with authentication, admin review, and image uploads.

## Troubleshooting

If the app does not run:

- confirm MongoDB is running
- verify the `MONGO_URI` is correct
- ensure both frontend and backend dependencies are installed
- check that the backend port matches the configured API URL

## License

This project is intended for educational and campus-use purposes.
