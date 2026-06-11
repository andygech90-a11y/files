import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const state = await db.collection('app_state').findOne({ _id: 'appState' });

    if (!state) {
      const initialState = {
        _id: 'appState',
        users: {},
        transactions: [],
        referrals: ['LOVE2024','HEART2024','MATCH100','VIP2024','CONNECT1'],
        adminBTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        giftAssign: {},
        currentUser: null,
      };
      await db.collection('app_state').insertOne(initialState);
      return new Response(JSON.stringify(initialState), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    delete state._id;
    return new Response(JSON.stringify(state), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const payload = await request.json();
    const client = await connectToDatabase();
    const db = client.db();

    await db.collection('app_state').updateOne(
      { _id: 'appState' },
      { $set: payload },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
