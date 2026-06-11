import connectToDatabase from '@/lib/mongodb';

// POST - Validate withdrawal request against app_state
export async function POST(request) {
  try {
    const { username, amount, withdrawType, address } = await request.json();

    if (!username || !amount || !withdrawType || !address) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    if (!['BTC', 'ETH'].includes(withdrawType)) {
      return new Response(JSON.stringify({ error: 'Invalid withdrawal type' }), { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();
    const state = await db.collection('app_state').findOne({ _id: 'appState' });

    if (!state || !state.users?.[username]) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const user = state.users[username];
    if ((user.balance || 0) < amount) {
      return new Response(JSON.stringify({ error: 'Insufficient balance' }), { status: 400 });
    }
    // Persist withdrawal request in separate collection
    const now = Date.now();
    const newWithdrawal = {
      id: now.toString(),
      username,
      amount,
      withdrawType,
      address,
      status: 'pending',
      requestedAt: new Date(now).toLocaleString(),
      requestedTs: now,
      approvedAt: null,
      rejectedAt: null,
      txHash: null,
    };

    const insertResult = await db.collection('withdrawals').insertOne(newWithdrawal);
    // Ensure the returned object contains the MongoDB _id and a string id for compatibility
    const insertedId = insertResult.insertedId;
    newWithdrawal._id = insertedId.toString();
    newWithdrawal.id = insertedId.toString();

    // Add notification to app_state
    const stateNotifications = state.notifications || {};
    const userNotes = stateNotifications[username] || [];
    const note = {
      id: now.toString(),
      type: 'withdrawal_requested',
      title: 'Withdrawal Requested',
      message: `Your ${withdrawType} withdrawal request for ${amount} has been submitted and is pending approval.`,
      timestamp: new Date(now).toLocaleString(),
      read: false,
    };
    stateNotifications[username] = [...userNotes, note];

    await db.collection('app_state').updateOne(
      { _id: 'appState' },
      { $set: { notifications: stateNotifications } },
      { upsert: true }
    );

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Withdrawal request submitted successfully',
      withdrawal: { ...newWithdrawal, _id: insertedId.toString(), id: insertedId.toString() },
      withdrawalId: insertedId.toString(),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// GET - Get withdrawal requests (filter by status)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const username = searchParams.get('username');

    const client = await connectToDatabase();
    const db = client.db();

    const filter = {};
    if (status) filter.status = status;
    if (username) filter.username = username;

    const requests = await db.collection('withdrawals')
      .find(filter)
      .sort({ requestedAt: -1 })
      .toArray();

    return new Response(JSON.stringify({ requests }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
