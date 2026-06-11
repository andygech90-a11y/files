"use client";

import { Suspense } from 'react';
import Home from '@/src/pages/Home';

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>Loading...</div>}>
      <Home />
    </Suspense>
  );
}
