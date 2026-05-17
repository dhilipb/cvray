"use client";

import React from "react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { UserMenu } from "@/components/auth/UserMenu";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidth = pathname?.includes("/cv");

  return (
    <Box
      sx={{
        display: "flex",
        height: isFullWidth ? "100vh" : "auto",
        minHeight: "100vh",
        bgcolor: "background.default",
        flexDirection: "column",
        overflow: isFullWidth ? "hidden" : "auto",
      }}
    >
      {!isFullWidth && (
        <AppBar
          position="fixed"
          sx={{
            bgcolor: "rgba(9, 9, 11, 0.8)",
            backdropFilter: "blur(12px)",
            boxShadow: "none",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Toolbar>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 1,
                mr: 4,
              }}
            >
              CVRay
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <UserMenu />
          </Toolbar>
        </AppBar>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: isFullWidth ? "flex" : "block",
          flexDirection: "column",
          p: isFullWidth ? 0 : 3,
          pt: isFullWidth ? 0 : 12, // Offset for the fixed AppBar only if it's shown
          maxWidth: isFullWidth ? "100%" : "1200px",
          width: "100%",
          mx: "auto",
          overflow: isFullWidth ? "hidden" : "visible",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
