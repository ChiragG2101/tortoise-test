"use client";

import { NextUIProvider } from "@nextui-org/react";

interface AppUIProviderProps {
  children: React.ReactNode;
}

export const AppUIProvider = ({ children }: AppUIProviderProps) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};
