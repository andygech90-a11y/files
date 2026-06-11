'use client';

import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const RegisterForm = dynamicImport(() => import('./RegisterForm'), { ssr: false });

export default function RegisterPage() {
  return <RegisterForm />;
}
