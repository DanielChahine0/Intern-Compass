// src/components/Layout.tsx
import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Upload, BookOpen, LogOut, User, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth0 } from "@auth0/auth0-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user, logout } = useAuth0();

  // Redirect to /auth when not logged in; keep deep link
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      sessionStorage.setItem("postLoginRedirect", location.pathname + location.search);
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, location.search]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        Checking session…
      </div>
    );
  }
  if (!isAuthenticated) return null;

  const navItems = [
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: BookOpen,    label: "Outline", path: "/outline" },
    { icon: Upload,      label: "Admin",   path: "/admin" },
  ];
  const isActive = (p: string) => location.pathname === p;

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text">
                InternCompass
              </h1>
              <p className="text-xs text-sidebar-foreground/60">AI Onboarding Assistant</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={cn("w-full justify-start gap-3 transition-all", isActive(item.path) && "shadow-medium")}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <User className="h-4 w-4 text-sidebar-foreground/60" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.email}</p>
              <p className="text-xs text-sidebar-foreground/60">User</p>
              {/* If you later add roles from Auth0, read them from user?.[`${namespace}/roles`] */}
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default Layout;
