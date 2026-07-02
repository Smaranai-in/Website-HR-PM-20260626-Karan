import { Link } from "react-router-dom";
import smaranLogo from "../assets/smaran-logo.png";

const Logo = () => {
  return (
    <Link to="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
      <img 
        src={smaranLogo} 
        alt="SmaranAI Logo" 
        className="h-16 w-auto"
      />
    </Link>
  );
};

export default Logo;
