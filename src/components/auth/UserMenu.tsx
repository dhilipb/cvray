"use client";

import React, { useState } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import Login from "@mui/icons-material/Login";
import { useSession, signOut, signIn } from "next-auth/react";

/* --------- Component --------- */

export const UserMenu = () => {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleSignIn = () => {
    signIn("google");
  };

  if (status === "loading") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Skeleton variant="text" width={100} height={24} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
        <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
      </Box>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <Button
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<Login />}
        onClick={handleSignIn}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          borderColor: "rgba(16, 185, 129, 0.3)",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "rgba(16, 185, 129, 0.05)",
          },
        }}
      >
        Sign In
      </Button>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
      <Typography variant="body2" sx={{ mr: 2, color: "text.secondary", fontWeight: 500 }}>
        Welcome, {session.user?.name?.split(" ")[0]}
      </Typography>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 0 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar
          src={session.user?.image || ""}
          sx={{
            width: 32,
            height: 32,
            border: "1px solid rgba(255,255,255,0.1)",
            bgcolor: "primary.main",
          }}
        >
          {session.user?.name?.[0]}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 180,
              bgcolor: "#18181b",
              backgroundImage: "none",
              border: "1px solid rgba(255,255,255,0.08)",
              "& .MuiMenuItem-root": {
                px: 2,
                py: 1,
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" noWrap sx={{ color: "text.primary" }}>
            {session.user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {session.user?.email}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
        <MenuItem onClick={handleLogout} sx={{ color: "#ef4444" }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "#ef4444" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};
