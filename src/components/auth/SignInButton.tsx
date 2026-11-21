"use client";

import React, { useState } from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

/* --------- Component --------- */

export const SignInButton = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) router.push("/profiles");
    else setError("Invalid email or password");
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSignIn}
      spacing={2}
      sx={{ width: "100%", maxWidth: 360, mx: "auto" }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={loading}
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
        Sign in
      </Button>
    </Stack>
  );
};
