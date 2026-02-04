import { Outlet } from "react-router-dom";
import Header from "../Shared/Header/Header";
import Footer from "../Shared/Footer/Footer";
import { AnimatePresence } from "framer-motion";


const Main = () => {
  return (
    <div>
      <Header />
      <AnimatePresence mode="wait">
        <div key={location.pathname}>
          <Outlet />
        </div>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Main;
