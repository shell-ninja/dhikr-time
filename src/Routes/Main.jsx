import { Outlet, useLocation } from "react-router-dom";
import Header from "../Shared/Header/Header";
import Footer from "../Shared/Footer/Footer";

const Main = () => {
  const location = useLocation();
  
  return (
    <div>
      <Header />
      <div key={location.pathname}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
