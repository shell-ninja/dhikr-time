import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="flex justify-between items-center min-h-44 px-[50px] md:px-[100px] py-10 bg-[#105A59]">
      <div className="font-amiri font-normal text-xl md:text-2xl text-[#E9F7E6]">
        <h1>A Sadaqah E Jariyah</h1>
        <p>By,</p>
        <h3 className="font-bold">Shell Ninja</h3>
      </div>

      <div className="flex flex-col justify-evenly items-center gap-2 text-2xl md:text-3xl text-[#E9F7E6]">
        <a target="_blank" href="https://github.com/shell-ninja">
          <FaGithub className="link-style" />
        </a>

        <a href="https://www.facebook.com/mahin.bhau">
          <FaFacebook className="link-style" />
        </a>

        <a href="https://www.instagram.com/mahin_bhau/">
          <FaInstagram className="link-style" />
        </a>

        <a href="https://www.linkedin.com/in/shell-ninja/">
          <FaLinkedin className="link-style" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
