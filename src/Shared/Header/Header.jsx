import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <Link to="/prayer-time">Prayer Time</Link>
      <Link to="/asma-ul-husna">Asma Ul Husna</Link>
    </div>
  );
};

export default Header;
