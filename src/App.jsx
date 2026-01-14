import { RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import { routes } from "./Routes/Routes";

function App() {
  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
