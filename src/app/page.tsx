import React from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import Image from "next/image";
import { SignInButton } from "@/components/auth/SignInButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/* --------- Page --------- */

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/profiles");
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at center, #18181b 0%, #09090b 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle, rgba(217, 70, 239, 0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ zIndex: 1, textAlign: "center" }}>
        <Stack spacing={4} sx={{ alignItems: "center" }}>
          {/* Logo Area */}
          <Box
            sx={{
              position: "relative",
              width: 240,
              height: 240,
              mb: 2,
              filter: "drop-shadow(0 0 20px rgba(16, 185, 129, 0.2))",
            }}
          >
            <Image
              src="/images/logo.png"
              alt="CVRay Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>

          {/* Text Content */}
          <Stack spacing={1}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                background: "linear-gradient(to right, #fff 0%, #a1a1aa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CVRay
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ fontWeight: 400, maxWidth: "400px", mx: "auto" }}
            >
              The AI-powered platform to tailor your professional identity.
            </Typography>
          </Stack>

          {/* Action Area */}
          <Box sx={{ pt: 4 }}>
            <SignInButton />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, opacity: 0.6 }}>
            Elevate your career with precision and speed.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
