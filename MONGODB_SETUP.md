/**
 * MongoDB Connection Setup for Next.js
 * 
 * To complete the MongoDB setup:
 * 
 * 1. Update .env.local with your MongoDB connection string:
 *    - MongoDB Atlas: https://www.mongodb.com/cloud/atlas (free tier available)
 *    - Local MongoDB: mongodb://localhost:27017/sincere-love-club
 * 
 * 2. Install dependencies:
 *    npm install next mongodb dotenv
 *    or
 *    yarn add next mongodb dotenv
 * 
 * 3. Update package.json scripts to include:
 *    "dev": "next dev",
 *    "build": "next build",
 *    "start": "next start"
 * 
 * 4. Run the development server:
 *    npm run dev
 * 
 * 5. Test the connection by visiting:
 *    http://localhost:3000/api/users
 * 
 * API Endpoints available:
 * - GET /api/users - Get all users
 * - POST /api/users - Create a new user (send JSON body)
 * - GET /api/users/[id] - Get user by ID
 * - PUT /api/users/[id] - Update user
 * - DELETE /api/users/[id] - Delete user
 */

// Example fetch calls from your React components:

/*
// Get all users
async function getUsers() {
  const res = await fetch('/api/users');
  return res.json();
}

// Create a user
async function createUser(userData) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
}

// Update a user
async function updateUser(id, userData) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return res.json();
}

// Delete a user
async function deleteUser(id) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}
*/
