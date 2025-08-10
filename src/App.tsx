import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./components/theme/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import AdminRoutes from "./Routes/AdminRoutes";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster position="bottom-right" reverseOrder={false} />
        <AdminRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
