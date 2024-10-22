import './globals.css';
import { ReduxProviders } from '@/features/redux/provider';
import ToastProvider from '@/components/toast/provider';
import { NextUIProviders } from '@/theme/provider';
import AuthProvider from '@/components/auth/provider';

export const metadata = {
  title: 'Seller Dashboard',
  description: 'Maximise your take-home with tortoise.',
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
