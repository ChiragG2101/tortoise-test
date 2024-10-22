import { NextUIProviders } from '@/theme/provider';
import './globals.css';
import { ReduxProviders } from '@/features/redux/provider';
import ToastProvider from './toast.provider';
import AuthProvider from '@/components/auth/provider';

export const metadata = {
  title: 'Lessor Dashboard',
  description: 'Generated by create next app',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body suppressHydrationWarning={true}>
        <ReduxProviders>
          <NextUIProviders>
            <ToastProvider>
              <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
          </NextUIProviders>
        </ReduxProviders>
      </body>
    </html>
  );
}