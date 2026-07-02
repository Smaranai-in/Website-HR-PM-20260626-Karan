import { Link } from "react-router-dom";
import smaranLogo from "../../../assets/smaran-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <div className="text-center max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-4 hover:opacity-80 transition-opacity">
          <img src={smaranLogo} alt="SmaranAI Logo" className="h-16 w-16" />
          <h1 className="text-4xl font-bold">
            <span className="text-primary">Smaran</span>
            <span className="text-foreground">AI</span>
          </h1>
        </Link>
        <p className="text-muted-foreground mb-8">
          Internship & Project Management System
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="auth-button inline-flex items-center justify-center"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="h-12 rounded-lg border border-primary px-8 font-medium text-primary inline-flex items-center justify-center hover:bg-primary/5 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
