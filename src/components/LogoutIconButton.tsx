import { useMsal } from "@azure/msal-react";
import { IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function LogoutIconButton() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  const logout = () => {
    instance.logoutPopup().catch((err) => console.error("Logout error", err));
    localStorage.removeItem("token");
  };

  if (!isAuthenticated) return null;

  return (
    <Tooltip title="Logout">
      <IconButton color="inherit" onClick={logout}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
}