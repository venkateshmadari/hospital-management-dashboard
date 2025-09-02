import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSettingsSharp } from "react-icons/io5";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import SignOutModal from "@/components/modals/SignOutModal";
import { useAuth } from "@/context/AuthContext";
import ConditionalRoutes from "./ConditionalRoutes";
import { GrCommand } from "react-icons/gr";

type IconType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    ref?: React.Ref<SVGSVGElement>;
  }
>;

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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden lg:flex flex-col border-r  shadow-sm flex-shrink-0"
        animate={{ width: sidebarCollapsed ? 70 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ minWidth: sidebarCollapsed ? "70px" : "240px" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between w-full h-16 text-center border-b px-4">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2  justify-center text-center font-unbounded "
              >
                Hello {user ? user?.name : "doctor"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
          <nav className="space-y-1 px-3 min-w-0">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.url;
              return (
                <React.Fragment key={index}>
                  {item.heading && !sidebarCollapsed && (
                    <div className="px-3 py-2 mt-6 mb-2 text-xs font-medium  uppercase dark:text-purple-300 text-purple-600 tracking-wider overflow-hidden">
                      {item.heading}
                    </div>
                  )}
                  <div className="relative min-w-0">
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm  rounded-lg transition-all duration-200 group relative min-w-0 overflow-hidden",
                        isActive
                          ? "text-white shadow-lg"
                          : "dark:text-white/50 hover:text-foreground hover:bg-muted/50"
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
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center h-16 border-b px-4 lg:px-6 shadow-sm flex-shrink-0">
          {/* Sidebar Toggle / Mobile Menu */}
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
              className="text-muted-foreground rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-card shadow-xl overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <IoSettingsSharp className="h-4 w-4" />
                    <span className="font-semibold text-sm">
                      Hello {role ? role : "unknown"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                </div>
                <nav className="p-4 space-y-1">
                  {navItems.map((item, index) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <React.Fragment key={index}>
                        {item.heading && (
                          <div className="px-3 py-2 mt-6 mb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                            {item.heading}
                          </div>
                        )}
                        <div className="relative min-w-0">
                          <Link
                            to={item.url}
                            className={cn(
                              "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative min-w-0 overflow-hidden",
                              isActive
                                ? "text-white shadow-lg"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="mobileActiveBackground"
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
                                "h-5 w-5 flex-shrink-0 relative z-10",
                                isActive ? "text-white" : ""
                              )}
                            />
                            <span
                              className={cn(
                                "truncate relative z-10",
                                isActive ? "text-white" : ""
                              )}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </nav>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
