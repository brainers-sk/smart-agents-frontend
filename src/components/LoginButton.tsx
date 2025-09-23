import { useMsal } from "@azure/msal-react";
import { Button } from "@mui/material";

export default function LoginButton() {
  const { instance } = useMsal();

  const login = () => {
    instance.loginPopup({
      scopes: ["openid", "profile", "email", import.meta.env.VITE_AZURE_API_SCOPE],
    }).then((res) => {
      console.log("User:", res.account);
      localStorage.setItem("token", res.accessToken);
      window.location.replace("/");
    });
  };

  return (
    <Button variant="contained" color="primary" onClick={login}>
      Login with Microsoft
    </Button>
  );
}