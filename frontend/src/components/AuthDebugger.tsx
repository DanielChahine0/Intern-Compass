import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

/**
 * Debug component to log Auth0 configuration and state
 * Remove this in production
 */
export const AuthDebugger = () => {
  const auth = useAuth0();

  useEffect(() => {
    console.group("🔍 Auth0 Configuration");
    console.log("Domain:", import.meta.env.VITE_AUTH0_DOMAIN);
    console.log("Client ID:", import.meta.env.VITE_AUTH0_CLIENT_ID);
    console.log("API URL:", import.meta.env.VITE_API_URL);
    console.log("Is Dev Mode:", import.meta.env.DEV);
    console.log("Current Origin:", window.location.origin);
    console.log("Expected Callback:", import.meta.env.DEV 
      ? "http://localhost:8080/auth/callback"
      : "https://intern-compass-frontend.onrender.com/auth/callback"
    );
    console.groupEnd();

    console.group("🔐 Auth0 State");
    console.log("isAuthenticated:", auth.isAuthenticated);
    console.log("isLoading:", auth.isLoading);
    console.log("user:", auth.user);
    console.log("error:", auth.error);
    console.groupEnd();
  }, [auth.isAuthenticated, auth.isLoading, auth.error, auth.user]);

  return null;
};
