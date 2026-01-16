import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Hamburger & Close icons
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Device */}
      <div className="md:hidden relative">
        {/* Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="absolute top-5 right-5 z-50 text-3xl text-[#105A59]"
        >
          {isOpen ? <FiX className="text-[#E4F6D9]" /> : <FiMenu />}
        </button>

        {/* Mobile Navbar */}
        <div
          className={`absolute top-0 left-0 w-full bg-[#105A59] font-amiri font-bold text-xl text-[#E4F6D9] tracking-wide py-10 transition-transform duration-300 ease-in-out z-10 ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex justify-center mb-6">
            <Link to="/" onClick={toggleMenu}>
              Dhikr Time
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col items-center space-y-4">
            <Link to="/dua" onClick={toggleMenu} className="hover-effect">
              Dua
            </Link>
            <Link
              to="/asma-ul-husna"
              onClick={toggleMenu}
              className="hover-effect"
            >
              Asma Ul Husna
            </Link>
          </div>
        </div>
      </div>

      {/*---------------*/}
      {/* Others */}
      <div className="bg-[#105A59] py-7 hidden md:flex justify-around font-amiri font-bold text-3xl text-[#E4F6D9] tracking-wide sticky top-0 z-[100]">
        {/* Logo */}
        <div>
          <Link to="/">Dhikr Time</Link>
        </div>

        {/* Nav Links */}
        <div className="">
          <Link className="mr-10" to="/dua">
            Dua
          </Link>
          <Link className="" to="/asma-ul-husna">
            Asma Ul Husna
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
