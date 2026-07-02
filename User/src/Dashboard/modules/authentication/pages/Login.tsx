import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  User, 
  ShieldCheck, 
  Users, 
  Bot, 
  Award, 
  Briefcase,
  ArrowRight,
  Mail,
  Lock
} from "lucide-react";
import AuthLayout from "../../../components/AuthLayout";
import signupIllustration from "../../../assets/signup-illustration.png";
import { Button } from "Dashboard/components/ui/button";
import { Input } from "Dashboard/components/ui/input";
import { Label } from "Dashboard/components/ui/label";
import { cn } from "Dashboard/lib/utils";
import { useAuthModal } from "../../../../context/AuthModalContext";
import { toast } from "react-toastify";

type Role = "intern" | "hr" | "supervisor" | "ai-interview" | "certificates" | "program-manager";

const roles: { id: Role; label: string; icon: any; color: string }[] = [
  { id: "intern", label: "Intern", icon: User, color: "emerald" },
  { id: "hr", label: "HR", icon: ShieldCheck, color: "teal" },
  { id: "supervisor", label: "Supervisor", icon: Users, color: "emerald" },
  { id: "ai-interview", label: "AI Interview", icon: Bot, color: "teal" },
  { id: "certificates", label: "Certificates", icon: Award, color: "emerald" },
  { id: "program-manager", label: "Program Manager", icon: Briefcase, color: "teal" },
];

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>("intern");
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle, user, profile } = useAuthModal();

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (user && profile) {
      const role = profile.role === "client" ? "intern" : profile.role;
      const routes: Record<string, string> = {
        hr: "/dashboard/hr",
        supervisor: "/dashboard/supervisor",
        "ai-interview": "/dashboard/ai-interview",
        certificates: "/dashboard/certificates",
        "program-manager": "/dashboard/program-manager",
        intern: "/dashboard/dashboard"
      };
      
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", role);
      navigate(routes[role] || "/dashboard/dashboard");
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("Login successful");
      
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", activeRole);

      const routes: Record<string, string> = {
        hr: "/dashboard/hr",
        supervisor: "/dashboard/supervisor",
        "ai-interview": "/dashboard/ai-interview",
        certificates: "/dashboard/certificates",
        "program-manager": "/dashboard/program-manager",
        intern: "/dashboard/dashboard"
      };

      navigate(routes[activeRole] || "/dashboard/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      illustration={signupIllustration}
      illustrationAlt="Login to SmaranAI"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto w-full"
      >
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
            Welcome back.
          </h2>
          <p className="text-slate-500 font-medium tracking-tight">
            Select your portal and enter your credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Role Selection Grid */}
          <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700 uppercase tracking-widest">
              Choose Portal
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group",
                    activeRole === role.id 
                      ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100 ring-4 ring-emerald-500/10" 
                      : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50/50"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-xl mb-3 transition-colors duration-300",
                    activeRole === role.id ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                  )}>
                    <role.icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "text-xs font-bold leading-none tracking-tight text-center",
                    activeRole === role.id ? "text-emerald-700" : "text-slate-500"
                  )}>
                    {role.label}
                  </span>
                  {activeRole === role.id && (
                    <motion.div 
                      layoutId="activeRole"
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="pl-12 h-14 bg-slate-50/50 border-slate-200 rounded-2xl focus:bg-white focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" title="Enter Password" className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-14 bg-slate-50/50 border-slate-200 rounded-2xl focus:bg-white focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-base font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <AnimatePresence mode="wait"><motion.div key="hide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><EyeOff className="h-5 w-5" /></motion.div></AnimatePresence> : <AnimatePresence mode="wait"><motion.div key="show" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Eye className="h-5 w-5" /></motion.div></AnimatePresence>}
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg shadow-xl shadow-emerald-200 group relative overflow-hidden transition-all active:scale-[0.98]"
            >
              <span className={cn("flex items-center justify-center gap-2", isLoading ? "opacity-0" : "opacity-100")}>
                Sign In <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </Button>
          </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-1 border-slate-200" />
              <span className="mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">or continue with</span>
              <hr className="flex-1 border-slate-200" />
            </div>

            {/* Google Sign-in */}
            <Button
              type="button"
              variant="outline"
              onClick={() => loginWithGoogle()}
              className="w-full h-14 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 hover:border-emerald-200 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 group-hover:scale-110 transition-transform"
              />
              <span className="text-slate-700 font-bold">Sign in with Google</span>
            </Button>

            <p className="text-sm text-slate-500 text-center font-medium">
              Don't have an account yet?{" "}
              <Link to="/dashboard/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline underline-offset-4 transition-all">
                Create an account
              </Link>
            </p>
        </form>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
