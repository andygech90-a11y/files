'use client';

import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const AdminLoginForm = dynamicImport(() => import('./AdminLoginForm'), { ssr: false });

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
