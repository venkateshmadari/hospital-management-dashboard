"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import SignOutModal from "@/components/modals/SignOutModal";
import { useAuth } from "@/context/AuthContext";
import ConditionalRoutes from "./ConditionalRoutes";
import { GrCommand } from "react-icons/gr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

interface SidebarProps {
  children: React.ReactNode;
}

const MainSidebar: React.FC<SidebarProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState<boolean>(false);
  const location = useLocation();
  const { role, user } = useAuth();
  const navItems = ConditionalRoutes();
  const endPoint = import.meta.env.VITE_PUBLIC_IMAGE_URL;
  const roleInitial = role ? role.charAt(0).toUpperCase() : "?";

  // ✅ active route checker fix
  const checkIsActive = (url: string): boolean => {
    if (url === "/") {
      return location.pathname === "/";
    }
    return location.pathname === url || location.pathname.startsWith(url);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden lg:flex flex-col border-r shadow-sm flex-shrink-0 relative"
        animate={{ width: sidebarCollapsed ? 70 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ minWidth: sidebarCollapsed ? "70px" : "240px" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center w-full h-16 text-center border-b px-4">
          <AnimatePresence mode="wait">
            {sidebarCollapsed ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-lg"
              >
                {roleInitial}
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 justify-center text-center font-unbounded capitalize"
              >
                Hello {role ? role.toLowerCase() : "unknown"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <nav className="space-y-1 px-3 min-w-0">
            {navItems.map((item, index) => {
              const isActive = checkIsActive(item.url);

              return (
                <React.Fragment key={index}>
                  {item.heading && !sidebarCollapsed && (
                    <div className="px-3 py-2 mt-6 mb-2 text-xs font-medium uppercase dark:text-purple-300 text-purple-600 tracking-wider overflow-hidden">
                      {item.heading}
                    </div>
                  )}
                  <div className="relative min-w-0">
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group relative min-w-0 overflow-hidden",
                        isActive
                          ? "text-white shadow-lg"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      title={sidebarCollapsed ? item.title : undefined}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeBackground"
                          className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-violet-800 to-purple-800 rounded-lg"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ scaleX: 1, originX: 0 }}
                          exit={{ scaleX: 0, originX: 1 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                            layout: { duration: 0.3 },
                          }}
                        />
                      )}
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors relative z-10",
                          isActive
                            ? "text-white"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <AnimatePresence mode="wait">
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="truncate overflow-hidden whitespace-nowrap relative z-10"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {sidebarCollapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-gradient-to-br from-indigo-800 via-violet-800 to-purple-800 text-white text-sm rounded-lg shadow-lg shadow-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-violet-600/20">
                          {item.title}
                          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-indigo-800 to-violet-800 rotate-45 border-l border-t border-violet-600/20"></div>
                        </div>
                      )}
                    </Link>
                  </div>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Profile Card at Bottom */}
        <div className="border-t p-4 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`${endPoint}${user?.image}`}
              alt={user?.name || "User"}
            />
            <AvatarFallback>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium max-w-[150px] truncate">
                {user?.name || "Unknown"}
              </span>
              <span className="text-xs text-muted-foreground max-w-[150px] truncate">
                {user?.email || "no-email@example.com"}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center h-16 border-b px-4 lg:px-6 shadow-sm flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="mr-2"
            onClick={() =>
              window.innerWidth < 1024
                ? setSidebarOpen(true)
                : setSidebarCollapsed(!sidebarCollapsed)
            }
          >
            <GrCommand className="h-4 w-4" />
          </Button>

          <div className="flex-1"></div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLogoutDialogOpen(true)}
              className="text-muted-foreground rounded-lg cursor-pointer"
            >
              <LogOut className="h-4 w-4 dark:text-white" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden dark:bg-muted/50 bg-[#e9ecef]">
          <div className="min-w-0 w-full xl:p-4 3xl:p-6 p-2">{children}</div>
        </main>

        <SignOutModal
          open={logoutDialogOpen}
          onOpenChange={setLogoutDialogOpen}
        />
      </div>
    </div>
  );
};

export default MainSidebar;
