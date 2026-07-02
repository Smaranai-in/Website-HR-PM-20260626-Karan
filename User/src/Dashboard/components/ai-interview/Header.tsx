import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import smaranLogo from "../../assets/smaran-logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={smaranLogo} alt="SmaranAI" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold text-foreground">
            Smaran<span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 bg-muted rounded-full px-4 py-2 min-w-[300px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
