'use client';

import dynamicImport from 'next/dynamic';
import BottomTabs from '../components/BottomTabs';

export const dynamic = 'force-dynamic';

const LoginForm = dynamicImport(() => import('./LoginForm'), { ssr: false });

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <BottomTabs />
    </>
  );
}
