import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";

export default function NavBar() {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon fontSize="small" /> },
    { label: "Chatbots", path: "/chatbots", icon: <ChatIcon fontSize="small" /> },
    { label: "Info", path: "/info", icon: <InfoIcon fontSize="small" /> },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <Toolbar>
        {/* Logo / Title */}
        <Typography
          component={Link} // 🔗 spraví link
          to="/"
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            color: "#DF4425",
            letterSpacing: "0.5px",
            textDecoration: "none", // odstráni podčiarknutie
            cursor: "pointer",
          }}
        >
          AI Agents Admin
        </Typography>

        {/* Menu */}
        <Stack direction="row" spacing={1}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              disableRipple
              sx={{
                textTransform: "none",
                fontWeight: isActive(item.path) ? 600 : 400,
                borderRadius: 2,
                px: 2,
                transition: "all 0.2s",
                color: isActive(item.path) ? "#DF4425" : "text.primary",
                bgcolor: isActive(item.path)
                  ? "rgba(223,68,37,0.08)"
                  : "transparent",
                "&:hover": {
                  bgcolor: isActive(item.path)
                    ? "rgba(223,68,37,0.15)"
                    : "rgba(0,0,0,0.04)",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        {/* Logout */}
        <Box sx={{ ml: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              borderColor: "#DF4425",
              color: "#DF4425",
              "&:hover": {
                borderColor: "#c73a20",
                backgroundColor: "rgba(223,68,37,0.08)",
              },
            }}
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}