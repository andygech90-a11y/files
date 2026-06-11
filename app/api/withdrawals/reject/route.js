import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// PUT - Reject withdrawal request
export async function PUT(request) {
  try {
    const { adminPassword, requestId, reason } = await request.json();

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

    // Return balance to user (if it was deducted on request)
    await db.collection('users').updateOne(
      { username: withdrawalReq.username },
      { 
        $push: {
          transactions: {
            type: 'withdrawal_rejected',
            amount: withdrawalReq.amount,
            reason: reason || 'Admin rejected withdrawal',
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
          status: 'rejected',
          rejectionReason: reason || 'Rejected by admin',
          rejectedAt: new Date(),
        }
      }
    );

    // Add notification to app_state for user
    const state = await db.collection('app_state').findOne({ _id: 'appState' });
    const stateNotifications = state?.notifications || {};
    const userNotes = stateNotifications[withdrawalReq.username] || [];
    const note = {
      id: Date.now().toString(),
      type: 'withdrawal_rejected',
      title: 'Withdrawal Rejected',
      message: `Your withdrawal request for ${withdrawalReq.amount} ${withdrawalReq.withdrawType} was rejected. Reason: ${reason || 'Not specified'}.`,
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
      message: 'Withdrawal request rejected'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
