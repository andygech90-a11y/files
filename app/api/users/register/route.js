import connectToDatabase from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { username, password, referralCode } = await request.json();

    if (!username || !password || !referralCode) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();

    let state = await db.collection('app_state').findOne({ _id: 'appState' });

    if (!state) {
      const initialState = {
        _id: 'appState',
        users: {},
        transactions: [],
        referrals: ['LOVE2024','HEART2024','MATCH100','VIP2024','CONNECT1'],
        adminBTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        giftAssign: {},
      };
      await db.collection('app_state').insertOne(initialState);
      state = initialState;
    }

    const uname = username.toLowerCase();

    if (state.users?.[uname]) {
      return new Response(JSON.stringify({ error: 'Username already exists' }), { status: 409 });
    }

    if (!state.referrals || !state.referrals.includes((referralCode || '').toUpperCase())) {
      return new Response(JSON.stringify({ error: 'Invalid referral code' }), { status: 400 });
    }

    const user = {
      username: uname,
      password,
      referral: (referralCode || '').toUpperCase(),
      balance: 0,
      gifts: 0,
      matches: Math.floor(Math.random() * 60) + 10,
      joined: new Date().toLocaleDateString('en-GB'),
      joinedTs: Date.now(),
      avatar: `https://i.pravatar.cc/200?u=${uname}`,
    };

    await db.collection('app_state').updateOne(
      { _id: 'appState' },
      { $set: { [`users.${uname}`]: user } },
      { upsert: true }
    );

    // Add welcome notification for new user
    const welcomeNote = {
      id: Date.now().toString(),
      type: 'welcome',
      title: 'Welcome to Sincere Love Club!',
      message: 'Your account has been created. Complete your profile to get started.',
      timestamp: new Date().toLocaleString(),
      read: false,
    };

    const updatedState = await db.collection('app_state').findOne({ _id: 'appState' });
    const currentNotifications = updatedState?.notifications || {};
    currentNotifications[uname] = [...(currentNotifications[uname] || []), welcomeNote];
    await db.collection('app_state').updateOne(
      { _id: 'appState' },
      { $set: { notifications: currentNotifications } },
      { upsert: true }
    );

    const safeUser = { username: user.username, balance: user.balance, avatar: user.avatar, referral: user.referral };

    return new Response(JSON.stringify({ success: true, user: safeUser }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
