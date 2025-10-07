import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Sparkles, AlertCircle } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth0();
  const location = useLocation();
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Check if this is the callback route
  const isCallback = location.pathname === "/auth/callback";

  useEffect(() => {
    // Enhanced debugging
    const info = {
      pathname: location.pathname,
      search: location.search,
      isCallback,
      isLoading,
      isAuthenticated,
      hasError: !!error,
      errorMessage: error?.message,
      timestamp: new Date().toISOString(),
    };
    console.log("Auth State:", info);
    setDebugInfo(JSON.stringify(info, null, 2));
  }, [location, isCallback, isLoading, isAuthenticated, error]);

  // If already logged in, redirect to chat
  if (!isLoading && isAuthenticated) {
    console.log("✅ Authenticated! Redirecting to /chat");
    return <Navigate to="/chat" replace />;
  }

  // Show error if authentication failed
  if (error) {
    console.error("❌ Auth0 Error:", error);
  }

  // Show loading state during callback processing
  if (isCallback && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow animate-pulse">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Completing sign in...</p>
          <details className="text-xs text-left bg-muted p-2 rounded max-w-md mx-auto">
            <summary className="cursor-pointer">Debug Info</summary>
            <pre className="mt-2 overflow-auto">{debugInfo}</pre>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* --- Header --- */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow mb-4">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text">
            InternCompass
          </h1>
          <p className="text-muted-foreground text-lg">
            Your intelligent onboarding assistant
          </p>
        </div>

        {/* --- Sign-in Card --- */}
        <Card className="p-8 shadow-large space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
          </div>

          {/* --- Sign-in Button --- */}
          <div className="space-y-3">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Authentication failed: {error.message}
                  <details className="mt-2 text-xs">
                    <summary>Technical details</summary>
                    <pre className="mt-1 overflow-auto">{JSON.stringify(error, null, 2)}</pre>
                  </details>
                </AlertDescription>
              </Alert>
            )}
            <Button
              size="lg"
              disabled={isLoading}
              onClick={() =>
                loginWithRedirect({
                  // Uncomment to force Google provider:
                  // authorizationParams: { connection: "google-oauth2" },
                })
              }
              className="
                group w-full h-12 rounded-xl text-base font-medium
                bg-gradient-to-r from-[#6D5BFF] to-[#8B5CF6] text-white
                shadow-[0_8px_24px_rgba(109,91,255,.35)]
                hover:brightness-[1.05] active:brightness-95
                transition-all
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D5BFF]
                disabled:opacity-70 disabled:cursor-not-allowed
              "
            >
              {/* Google G icon */}
              <svg
                className="mr-2 h-5 w-5 opacity-95 group-hover:opacity-100"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
          </div>

          {/* --- Info Card --- */}
          <div className="flex items-start gap-2 p-4 rounded-lg bg-muted/50 border border-border">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Secure Access</p>
              <p>Social sign-in, MFA, and passwordless — powered by Auth0.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;