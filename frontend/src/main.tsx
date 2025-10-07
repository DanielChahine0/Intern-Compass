import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN!}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: import.meta.env.DEV
          ? "http://localhost:8080/auth/callback"
          : "https://intern-compass-frontend.onrender.com/auth/callback",
        audience: undefined, // Explicitly undefined for SPA without custom API
        scope: "openid profile email", // Standard OIDC scopes
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
      skipRedirectCallback={false}
      onRedirectCallback={(appState) => {
        console.log("✅ Auth0 redirect callback completed", appState);
        // Navigate to intended URL or default to /chat
        window.history.replaceState(
          {},
          document.title,
          appState?.returnTo || "/chat"
        );
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
