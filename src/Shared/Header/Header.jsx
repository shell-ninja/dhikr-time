import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      {/* Mobile Device */}

      <div></div>

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
