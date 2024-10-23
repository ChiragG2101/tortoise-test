import "./globals.css";
import { ReduxProviders } from "@/features/redux/provider";
import ToastProvider from "@/components/toast/provider";
import { AppUIProvider } from "@repo/ui/providers";
import AuthProvider from "@/components/auth/provider";

export const metadata = {
  title: "Seller Dashboard",
  description: "Maximise your take-home with tortoise.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReduxProviders>
          <AppUIProvider>
            <ToastProvider>
              <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
          </AppUIProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
