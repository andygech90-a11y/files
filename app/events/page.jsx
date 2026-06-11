'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '@/src/pages/Home';
import { AppContext } from '@/src/context/AppContext';

export default function EventsPage() {
  const [mounted, setMounted] = useState(false);
  const { session } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !session) {
      router.push('/login');
    }
  }, [mounted, session, router]);

  if (!mounted || !session) {
    return null;
  }

  return (
    <Router>
      <Home initialTab="events" />
    </Router>
  );
}
