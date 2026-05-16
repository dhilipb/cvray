"use client";

import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { UserMenu } from "@/components/auth/UserMenu";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", flexDirection: "column" }}>
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
              mr: 4
            }}
          >
            CVRay
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <UserMenu />
        </Toolbar>
      </AppBar>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 12, // Offset for the fixed AppBar
          maxWidth: "1200px",
          width: "100%",
          mx: "auto"
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
