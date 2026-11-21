"use client";

import React, { useState } from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

/* --------- Component --------- */

export const SignInButton = () => {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registering = mode === "register";

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (registering) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          setError(body.error ?? "Registration failed");
          return;
        }
      }
      const res = await signIn("credentials", { username, password, redirect: false });
      if (res?.ok) router.push("/profiles");
      else setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={2}
      sx={{ width: "100%", maxWidth: 360, mx: "auto" }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Username"
        autoComplete="username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete={registering ? "new-password" : "current-password"}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText={registering ? "At least 8 characters" : undefined}
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
        {registering ? "Create account" : "Sign in"}
      </Button>
      <Button
        variant="text"
        onClick={() => {
          setMode(registering ? "signin" : "register");
          setError("");
        }}
        sx={{ textTransform: "none" }}
      >
        {registering ? "Have an account? Sign in" : "No account? Register"}
      </Button>
    </Stack>
  );
};
