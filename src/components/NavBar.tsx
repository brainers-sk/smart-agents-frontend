import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import LogoutIconButton from "./LogoutIconButton";

export default function NavBar() {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI Agents Admin
        </Typography>
        <Button component={Link} to="/">Dashboard</Button>
        <Button component={Link} to="/chatbots">Chatbots</Button>

        <LogoutIconButton />
      </Toolbar>
    </AppBar>
  );
}