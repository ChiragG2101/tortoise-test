'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  router.push('/customers/purchase-order');
  return <main className=''></main>;
}
