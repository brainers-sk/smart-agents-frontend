import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import ChatbotsList from "./pages/ChatbotsList";
import ChatbotCreate from "./pages/ChatbotCreate";
import ChatbotDetail from "./pages/ChatbotDetail";
import LoginPage from "./pages/LoginPage";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import ChatbotTeamsPage from "./pages/ChatbotTeamsPage";
import Info from "./pages/Info";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teams/:uuid" element={<ChatbotTeamsPage />} />

        {/* Protected app with NavBar */}
        <Route
          path="/*"
          element={
            <>
              <AuthenticatedTemplate>
                <NavBar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/chatbots" element={<ChatbotsList />} />
                  <Route path="/info" element={<Info />} />
                  <Route path="/chatbots/new" element={<ChatbotCreate />} />
                  <Route path="/chatbots/:uuid" element={<ChatbotDetail />} />
                </Routes>
              </AuthenticatedTemplate>

              <UnauthenticatedTemplate>
                <Navigate to="/login" replace />
              </UnauthenticatedTemplate>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}