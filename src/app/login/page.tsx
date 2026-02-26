'use client';

import dynamic from 'next/dynamic';
import ClientOnly from '@/components/ClientOnly';

const LoginPageNoSSR = dynamic(() => import('./LoginPage'), {
  ssr: false,
  loading: () => null
});

export default function LoginPageRoute() {
  return (
    <ClientOnly>
      <LoginPageNoSSR />
    </ClientOnly>
  );
}
