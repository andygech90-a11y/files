import connectToDatabase from '@/lib/mongodb';

// POST - Add points to user (admin only)
export async function POST(request) {
  try {
    const { adminPassword, username, points, reason } = await request.json();

    // Verify admin
    if (adminPassword !== process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD !== 'admin123') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!username || points === undefined || points <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Get user
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Update user balance
    const newBalance = (user.balance || 0) + points;
    await db.collection('users').updateOne(
      { username },
      { 
        $set: { balance: newBalance },
        $push: {
          transactions: {
            type: 'admin_add_points',
            amount: points,
            reason: reason || 'Admin added points',
            timestamp: new Date(),
          }
        }
      }
    );

    return new Response(JSON.stringify({ 
      success: true, 
      newBalance,
      message: `Added ${points} USDT points to ${username}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
