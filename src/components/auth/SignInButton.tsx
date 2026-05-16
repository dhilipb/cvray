"use client";

import React from "react";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

/* --------- Component --------- */

export const SignInButton = () => {
  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/profiles" });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      startIcon={<GoogleIcon />}
      onClick={handleSignIn}
      sx={{
        px: 4,
        py: 1.5,
        fontSize: "1.1rem",
        borderRadius: 2,
        textTransform: "none",
        boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
        "&:hover": {
          boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)",
        },
      }}
    >
      Sign in with Google
    </Button>
  );
};
