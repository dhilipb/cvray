"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ThemeRegistry from "@/components/ThemeRegistry";

/* --------- Component --------- */

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <AppRouterCacheProvider>
        <ThemeRegistry>{children}</ThemeRegistry>
      </AppRouterCacheProvider>
    </SessionProvider>
  );
};
