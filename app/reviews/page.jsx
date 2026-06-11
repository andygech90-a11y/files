'use client';

// MemoryRouter executes entirely in memory, making it 100% safe for Next.js server builds
import { MemoryRouter as Router } from 'react-router-dom';
import Home from '@/src/pages/Home';

export default function ReviewsPage() {
  return (
    <Router>
      <Home initialTab="reviews" />
    </Router>
  );
}