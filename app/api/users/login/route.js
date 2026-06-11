import connectToDatabase from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();
    const state = await db.collection('app_state').findOne({ _id: 'appState' });

    if (!state || !state.users?.[username]) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    const user = state.users[username];

    if (user.password !== password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const safeUser = { username: user.username, isAdmin: !!user.isAdmin };

    return new Response(JSON.stringify({ success: true, user: safeUser }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
