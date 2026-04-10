import { RouterProvider } from "react-router-dom";
import { useState, createContext } from "react";
import "./App.css";
import { routes } from "./Routes/Routes";
import CustomAlert from "./Hooks/CustomAlert"; // Import CustomAlert here

// Create context for alert
export const AlertContext = createContext();

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = "error") => {
    setAlert({ message, type });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {/* Alert OUTSIDE the blurred container */}
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={hideAlert}
        />
      )}

      {/* Blur and disable pointer events - NO BLACK OVERLAY */}
      <div
        className={`transition-all duration-300 ${alert ? "blur-sm pointer-events-none select-none" : ""}`}
      >
        <RouterProvider router={routes} />
      </div>
    </AlertContext.Provider>
  );
}

export default App;
