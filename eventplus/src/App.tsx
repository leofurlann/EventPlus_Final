
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthProvider";

import "./App.css";
import "./design-system.css";

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
