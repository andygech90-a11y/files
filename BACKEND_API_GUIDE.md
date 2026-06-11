# Backend Integration Guide - Sincere Love Club

## Overview
The app is now fully connected to MongoDB backend with a points/balance system and withdrawal management. Points are in USDT and can be withdrawn as BTC or ETH.

## Database Collections

### users
```javascript
{
  _id: ObjectId,
  username: String,
  password: String,
  email: String,
  balance: Number,  // USDT points balance
  joined: String,
  joinedTs: Number,
  avatar: String,
  transactions: Array,  // Transaction history
  walletBTC: String,    // Saved Bitcoin address
  walletETH: String,    // Saved Ethereum address
}
```

### withdrawals
```javascript
{
  _id: ObjectId,
  username: String,
  amount: Number,       // USDT amount
  withdrawType: String, // 'BTC' or 'ETH'
  address: String,      // Withdrawal address
  status: String,       // 'pending', 'approved', 'completed', 'rejected'
  requestedAt: Date,
  approvedAt: Date,
  rejectedAt: Date,
  txHash: String,       // Transaction hash (after approval)
  rejectionReason: String,
}
```

## API Endpoints

### 1. Get User Balance
**GET** `/api/users/balance?username={username}`

**Response:**
```json
{
  "balance": 100.5,
  "points": 100.5
}
```

### 2. Add Points to User (Admin Only)
**POST** `/api/users/add-points`

**Request Body:**
```json
{
  "adminPassword": "admin123",
  "username": "john_doe",
  "points": 50,
  "reason": "Bonus credit"
}
```

**Response:**
```json
{
  "success": true,
  "newBalance": 150.5,
  "message": "Added 50 USDT points to john_doe"
}
```

### 3. Request Withdrawal
**POST** `/api/withdrawals/request`

**Request Body:**
```json
{
  "username": "john_doe",
  "amount": 50,
  "withdrawType": "BTC",
  "address": "1A1z7agoat2..."
}
```

**Response:**
```json
{
  "success": true,
  "requestId": "507f1f77bcf86cd799439011",
  "message": "Withdrawal request submitted successfully"
}
```

### 4. Get Withdrawal Requests
**GET** `/api/withdrawals/request?status=pending` or `/api/withdrawals/request?username=john_doe`

**Response:**
```json
{
  "requests": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "amount": 50,
      "withdrawType": "BTC",
      "address": "1A1z7agoat2...",
      "status": "pending",
      "requestedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 5. Approve Withdrawal (Admin Only)
**PUT** `/api/withdrawals/approve`

**Request Body:**
```json
{
  "adminPassword": "admin123",
  "requestId": "507f1f77bcf86cd799439011",
  "txHash": "0x123abc..."  // Optional - blockchain transaction hash
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal approved and completed"
}
```

**What happens:**
- Withdrawal status changes to "completed"
- User's balance is deducted by the withdrawal amount
- Transaction is recorded in user's transaction history

### 6. Reject Withdrawal (Admin Only)
**PUT** `/api/withdrawals/reject`

**Request Body:**
```json
{
  "adminPassword": "admin123",
  "requestId": "507f1f77bcf86cd799439011",
  "reason": "Invalid address format"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal request rejected"
}
```

## Frontend Integration

### AppContext Functions

```javascript
// Fetch user balance
await fetchUserBalance(username)
// Returns: balance (Number)

// Request withdrawal
await requestWithdrawal(username, amount, withdrawType, address)
// Returns: { success, requestId, message }

// Add points to user (Admin)
await addUserPoints(adminPassword, username, points, reason)
// Returns: { success, newBalance, message }

// Get withdrawals
await getWithdrawals(status)
// Returns: Array of withdrawal requests

// Approve withdrawal (Admin)
await approveWithdrawal(adminPassword, requestId, txHash)
// Returns: { success, message }

// Reject withdrawal (Admin)
await rejectWithdrawal(adminPassword, requestId, reason)
// Returns: { success, message }
```

## Workflow

### User Withdrawal Flow
1. User navigates to "Withdraw" in Personal Center
2. Selects withdrawal type (BTC/ETH)
3. Enters amount and wallet address
4. Submits request → Creates pending withdrawal in DB
5. Admin reviews and approves/rejects
6. On approval → Points deducted from user balance
7. User notified of approval/rejection

### Admin Adding Points Flow
1. Admin logs in to Admin Panel
2. Navigates to Users tab
3. Enters username and points amount
4. Clicks "Add Points"
5. User's balance updated immediately
6. Transaction recorded in user's history

## Environment Variables
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
ADMIN_PASSWORD=admin123  # Should be updated in production
```

## Security Notes
- All admin endpoints verify password (should use proper auth tokens in production)
- User data is isolated per username
- Withdrawal requests require user authentication
- Admin operations are logged in transaction history

## Testing

### Test Add Points (using curl)
```bash
curl -X POST http://localhost:3000/api/users/add-points \
  -H "Content-Type: application/json" \
  -d '{
    "adminPassword": "admin123",
    "username": "testuser",
    "points": 100,
    "reason": "Test credit"
  }'
```

### Test Withdrawal Request
```bash
curl -X POST http://localhost:3000/api/withdrawals/request \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "amount": 50,
    "withdrawType": "BTC",
    "address": "1A1z7agoat2..."
  }'
```

### Test Approve Withdrawal
```bash
curl -X PUT http://localhost:3000/api/withdrawals/approve \
  -H "Content-Type: application/json" \
  -d '{
    "adminPassword": "admin123",
    "requestId": "REQUEST_ID_HERE",
    "txHash": "0x123abc..."
  }'
```

## Next Steps
1. Set up MongoDB database with the required collections
2. Add proper authentication (JWT tokens instead of password)
3. Add transaction fee calculations
4. Implement notification system (email/SMS)
5. Add blockchain integration for automatic transfers
6. Add comprehensive audit logging
