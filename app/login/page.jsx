'use client';

import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const LoginForm = dynamicImport(() => import('./LoginForm'), { ssr: false });

export default function LoginPage() {
  return <LoginForm />;
}
