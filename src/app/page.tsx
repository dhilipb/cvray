import React from "react";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Image from "next/image";
import { SignInButton } from "@/components/auth/SignInButton";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

const FEATURES = [
  {
    icon: AutoAwesomeIcon,
    title: "AI-tailored CVs",
    text: "Upload your CV once, then tailor it and a cover letter to each job description.",
  },
  {
    icon: ViewKanbanIcon,
    title: "Application tracker",
    text: "Follow every role from Saved to Offer with status, notes and links in one place.",
  },
  {
    icon: PictureAsPdfIcon,
    title: "Polished PDFs",
    text: "Pick a template and theme, then export a print-ready PDF in seconds.",
  },
];

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

      <Container maxWidth="md" sx={{ zIndex: 1, textAlign: "center", py: { xs: 6, md: 8 } }}>
        <Stack spacing={4} sx={{ alignItems: "center" }}>
          {/* Logo Area */}
          <Box
            sx={{
              position: "relative",
              width: { xs: 160, sm: 220 },
              height: { xs: 160, sm: 220 },
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
                fontSize: { xs: "2.75rem", sm: "3.75rem" },
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
              sx={{
                fontWeight: 400,
                maxWidth: 440,
                mx: "auto",
                fontSize: { xs: "1.1rem", sm: "1.5rem" },
              }}
            >
              The AI-powered platform to tailor your professional identity.
            </Typography>
          </Stack>

          {/* Action Area */}
          <Box sx={{ pt: 2 }}>
            <SignInButton />
          </Box>

          <Grid container spacing={2} sx={{ pt: { xs: 2, sm: 4 }, textAlign: "left" }}>
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <Grid size={{ xs: 12, sm: 4 }} key={title}>
                <Box
                  sx={{
                    height: "100%",
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: "rgba(24, 24, 27, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <Icon sx={{ color: "primary.main", mb: 1 }} aria-hidden />
                  <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {text}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.6 }}>
            Elevate your career with precision and speed.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
