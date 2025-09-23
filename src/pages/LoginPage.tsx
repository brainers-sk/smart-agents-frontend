// pages/LoginPage.tsx
import { Box, Typography } from "@mui/material";
import LoginButton from "../components/LoginButton";

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6" color="textSecondary">
        Please log in
      </Typography>
      <LoginButton />
    </Box>
  );
}