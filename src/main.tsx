import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}/v2.0`,
    redirectUri: import.meta.env.VITE_FRONTEND_URL, // napr. http://localhost:5173
    postLogoutRedirectUri: import.meta.env.VITE_FRONTEND_URL,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true,
  },
});

async function initializeMsal() {
  try {
    // 🟢 Povinné – inicializuje MSAL pred použitím
    await msalInstance.initialize();

    // 🟢 Spracuje redirect návrat po logine
    const response = await msalInstance.handleRedirectPromise();
    if (response && response.account) {
      msalInstance.setActiveAccount(response.account);
      localStorage.setItem("token", response.accessToken);
    } else {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
    }

    // 🟢 Spustí React appku až po inicializácii MSAL
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <MsalProvider instance={msalInstance}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </MsalProvider>
      </React.StrictMode>
    );
  } catch (err) {
    console.error("MSAL initialization error:", err);
  }
}

initializeMsal();