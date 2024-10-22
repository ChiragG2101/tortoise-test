'use client';

import '../../app/globals.css';
import Login from '@/components/auth/Login';
import SideNav from '@/components/common/SideNav';
import { persistor } from '@/store/store';
import { useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export default function AuthProvider({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <main className='custom-theme text-foreground bg-background h-screen flex flex-col'>
        {isAuthenticated ? (
          <div className='flex justify-center min-h-screen p-5'>
            <div className='hidden lg:flex lg:flex-col w-1/6 py-5'>
              <SideNav />
            </div>
            <div className='w-full bg-white py-5 lg:ml-5 rounded-xl border-2 overflow-y-auto scrollbar-hide'>
              {children}
            </div>
          </div>
        ) : (
          <Login />
        )}
      </main>
    </PersistGate>
  );
}
