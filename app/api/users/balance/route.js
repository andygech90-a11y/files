import connectToDatabase from '@/lib/mongodb';

// GET user balance from app_state
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username required' }), { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();
    const state = await db.collection('app_state').findOne({ _id: 'appState' });

    if (!state || !state.users?.[username]) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const user = state.users[username];
    return new Response(JSON.stringify({ balance: user.balance || 0, points: user.points || 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
