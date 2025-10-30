import { useMsal } from "@azure/msal-react";
import { Button } from "@mui/material";

export default function LoginButton() {
  const { instance } = useMsal();

  const login = async () => {
    try {
      await instance.loginRedirect({
        scopes: [
          "openid",
          "profile",
          "email",
          import.meta.env.VITE_AZURE_API_SCOPE!,
        ],
        redirectStartPage: "/", // kam ťa po logine vráti
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={login}>
      Login with Microsoft
    </Button>
  );
}