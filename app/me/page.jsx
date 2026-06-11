'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Profile component is not used here; keep import commented for future use
// import Profile from '@/src/pages/Profile';
import { AppContext } from '@/src/context/AppContext';
import Home from '@/src/pages/Home';

export default function MePage() {
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

  return <Home initialTab={"me"}/>;
}
