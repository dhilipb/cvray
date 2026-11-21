"use client";

import React from "react";
import { Snackbar, Alert } from "@mui/material";

/* --------- Types --------- */
export interface ToastState {
  message: string;
  severity: "success" | "error" | "info";
}

/* --------- Toast Component --------- */
export function Toast({ toast, onClose }: { toast: ToastState | null; onClose: () => void }) {
  return (
    <Snackbar
      open={!!toast}
      autoHideDuration={4000}
      onClose={(_e, reason) => reason !== "clickaway" && onClose()}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={toast?.severity ?? "info"}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {toast?.message}
      </Alert>
    </Snackbar>
  );
}
