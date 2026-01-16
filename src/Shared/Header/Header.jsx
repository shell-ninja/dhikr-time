import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-cyan-600 flex justify-between">
      {/* Logo */}
      <div>
        <Link to="/">Dhikr Time</Link>
      </div>

      {/* Nav Links */}
      <div>
        <Link className="" to="/dua">
          Dua
        </Link>
        <Link className="" to="/asma-ul-husna">
          Asma Ul Husna
        </Link>
      </div>
    </div>
  );
};

export default Header;
