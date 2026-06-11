# MongoDB Connection Setup Guide

## Step 1: Install Dependencies
Once your network is stable, run:
```bash
npm install
```

This will install:
- `next` - React framework
- `mongodb` - MongoDB driver
- `dotenv` - Environment variable management

## Step 2: Configure MongoDB Connection String

Update `.env.local` with your MongoDB URI:

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Add it to `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sincere-love-club?retryWrites=true&w=majority
```

### Option B: Local MongoDB
```
MONGODB_URI=mongodb://localhost:27017/sincere-love-club
```

## Step 3: Start Development Server
```bash
npm run dev
```
Then visit http://localhost:3000

## Available API Endpoints

- **GET** `/api/users` - Get all users
- **POST** `/api/users` - Create a new user
  ```json
  {
    "username": "john",
    "email": "john@example.com",
    "password": "hashed_password"
  }
  ```

- **GET** `/api/users/[id]` - Get a specific user
- **PUT** `/api/users/[id]` - Update a user
- **DELETE** `/api/users/[id]` - Delete a user

## Testing API

Use Postman, Insomnia, or cURL:
```bash
# Get all users
curl http://localhost:3000/api/users

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com"}'
```

## Using in React Components

```javascript
import { useEffect, useState } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return <div>{users.map(u => <p key={u._id}>{u.username}</p>)}</div>;
}
```

## Project Structure
```
.
├── lib/
│   └── mongodb.js          # MongoDB connection
├── pages/
│   ├── api/
│   │   ├── users.js        # GET all, POST new
│   │   └── users/[id].js   # GET, PUT, DELETE single
│   └── ...                 # Your Next.js pages
├── src/                    # React components
├── .env.local             # Environment variables (add to .gitignore!)
├── jsconfig.json          # Path aliases
└── next.config.js         # Next.js configuration
```

## Troubleshooting

- **Connection refused**: Ensure MongoDB is running or check your connection string
- **ECONNRESET**: Network issue, try again or check proxy settings
- **Module not found**: Run `npm install` again
- **Port 3000 in use**: Kill the process or use `npm run dev -- -p 3001`
