import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    // Attempt a simple command to check connection
    await db.admin().ping();
    return new Response(JSON.stringify({ ok: true, message: 'MongoDB OK' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error?.message || String(error) }), { status: 500 });
  }
}
