import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT - Approve withdrawal request
export async function PUT(request) {
  try {
    const { adminPassword, requestId, txHash } = await request.json();

    // Verify admin
    if (adminPassword !== 'admin123') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    if (!requestId) {
      return new Response(JSON.stringify({ error: 'Request ID required' }), { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Get withdrawal request
    const withdrawalReq = await db.collection('withdrawals').findOne({
      _id: new ObjectId(requestId)
    });

    if (!withdrawalReq) {
      return new Response(JSON.stringify({ error: 'Withdrawal request not found' }), { status: 404 });
    }

    if (withdrawalReq.status !== 'pending') {
      return new Response(JSON.stringify({ error: 'Request already processed' }), { status: 400 });
    }

    // Deduct balance from user
    await db.collection('users').updateOne(
      { username: withdrawalReq.username },
      { 
        $inc: { balance: -withdrawalReq.amount },
        $push: {
          transactions: {
            type: 'withdrawal_approved',
            amount: withdrawalReq.amount,
            withdrawType: withdrawalReq.withdrawType,
            address: withdrawalReq.address,
            txHash: txHash || null,
            timestamp: new Date(),
          }
        }
      }
    );

    // Update withdrawal request status
    await db.collection('withdrawals').updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          status: 'completed',
          approvedAt: new Date(),
          txHash: txHash || null,
        }
      }
    );

    // Add notification in app_state for user
    const state = await db.collection('app_state').findOne({ _id: 'appState' });
    const stateNotifications = state?.notifications || {};
    const userNotes = stateNotifications[withdrawalReq.username] || [];
    const note = {
      id: Date.now().toString(),
      type: 'withdrawal_approved',
      title: 'Withdrawal Completed',
      message: `Your withdrawal of ${withdrawalReq.amount} ${withdrawalReq.withdrawType} has been approved.`,
      timestamp: new Date().toLocaleString(),
      read: false,
    };
    stateNotifications[withdrawalReq.username] = [...userNotes, note];
    await db.collection('app_state').updateOne(
      { _id: 'appState' },
      { $set: { notifications: stateNotifications } },
      { upsert: true }
    );

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Withdrawal approved and completed'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
