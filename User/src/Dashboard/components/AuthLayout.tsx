import { ReactNode } from "react";
import { Link } from "react-router-dom";
import smaranLogo from "../assets/smaran-logo.png";

interface AuthLayoutProps {
  children: ReactNode;
  illustration: string;
  illustrationAlt: string;
}

const AuthLayout = ({ children, illustration, illustrationAlt }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-[45%] flex flex-col bg-white shadow-2xl z-10">
          {/* Header with Logo */}
          <div className="pt-12 pb-6 px-8 lg:px-20">
            <Link to="/" className="flex items-center gap-3 mb-2 hover:opacity-80 transition-opacity w-fit">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <img src={smaranLogo} alt="SmaranAI Logo" className="h-7 w-7 brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight leading-none">
                  <span className="text-emerald-600">Smaran</span>
                  <span className="text-slate-900">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-600/70">
                  Excellence in Education
                </span>
              </div>
            </Link>
          </div>

          {/* Form Content */}
          <div className="flex-1 px-8 lg:px-20 pb-12 flex flex-col justify-center">
            {children}
          </div>
        </div>

        {/* Right Panel - Illustration & Branding */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#f0f9f6]">
          {/* Abstract Background Shapes */}
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/50 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-teal-100/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10 w-full h-full flex items-center justify-center p-20">
            <div className="max-w-xl w-full">
              <div className="relative group">
                {/* Decorative border */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                
                <div className="relative bg-white p-4 rounded-[1.5rem] shadow-2xl border border-emerald-50 transform hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src={illustration}
                    alt={illustrationAlt}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-emerald-50 animate-bounce-slow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trusted Solution</div>
                      <div className="text-lg font-black text-slate-900 leading-none">AI Driven</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2025 SmaranAI • All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-foreground transition-colors">Legal</a>
            <a href="#" className="hover:text-foreground transition-colors">Site Map</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
