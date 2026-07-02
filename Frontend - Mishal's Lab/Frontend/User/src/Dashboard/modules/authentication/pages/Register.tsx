import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthModal } from "../../../../context/AuthModalContext";
import { Eye, EyeOff, ChevronLeft, Upload, Bot } from "lucide-react";
import AuthLayout from "../../../components/AuthLayout";
import signupIllustration from "../../../assets/signup-illustration.png";

type Role = "Intern" | "HR" | "Supervisor" | "AI Screening Interview" | "Certificates" | "Program Manager" | null;
type Status = "Paid" | "Unpaid" | null;

const Register = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuthModal();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1 form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2 form data
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [status, setStatus] = useState<Status>(null);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/verify");
  };

  const roles: Role[] = ["Intern", "HR", "Supervisor", "AI Screening Interview", "Certificates", "Program Manager"];

  if (step === 2) {
    return (
      <AuthLayout
        illustration={signupIllustration}
        illustrationAlt="Sign up illustration"
      >
        <form onSubmit={handleStep2Submit} className="max-w-xl">
          {/* Back button */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-sm text-foreground hover:text-primary mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Please Enter Your Details
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Github Link */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Github link (optional)
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="Github Profile Link"
                  className="auth-input w-full"
                />
              </div>

              {/* LinkedIn ID */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  LinkedIn ID (optional)
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="LinkedIn Profile Link"
                  className="auth-input w-full bg-secondary"
                />
              </div>

              {/* Upload Resume */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload Resume (optional)
                </label>
                <label className="auth-input w-full flex items-center justify-between cursor-pointer bg-secondary">
                  <span className="text-muted-foreground">
                    {resume ? resume.name : "Choose file (.pdf, .docx {max 10 MB})"}
                  </span>
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              {/* Select Your Role */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Your Role
                </label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`role-option w-full ${selectedRole === role ? "role-option-selected" : ""
                        }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStatus("Paid")}
                    className={`status-toggle flex-1 ${status === "Paid" ? "status-toggle-selected" : ""
                      }`}
                  >
                    Paid
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Unpaid")}
                    className={`status-toggle flex-1 ${status === "Unpaid" ? "status-toggle-selected" : ""
                      }`}
                  >
                    Unpaid
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Register Button and AI Bot Info */}
          <div className="mt-8 flex flex-col md:flex-row items-start gap-4">
            <button type="submit" className="auth-button min-w-[160px]">
              Register
            </button>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Bot className="h-8 w-8 text-primary/60 flex-shrink-0" />
              <span>
                Applicants: You Will Interact With Our AI Bot After Sign Up For
                Screening
              </span>
            </div>
          </div>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      illustration={signupIllustration}
      illustrationAlt="Sign up illustration"
    >
      <form onSubmit={handleStep1Submit} className="max-w-xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Enter Your Details To Create An Account
        </h2>

        {/* Google Sign-in (Always available) */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            className="w-full flex items-center justify-center gap-3 border-2 border-slate-100 hover:bg-slate-50 hover:border-emerald-200 py-3 rounded-2xl transition-all duration-300 group"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
            <span className="font-bold text-slate-700">Sign in with Google</span>
          </button>

          <div className="flex items-center my-6">
            <hr className="flex-1 border-slate-200" />
            <span className="mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">or register manually</span>
            <hr className="flex-1 border-slate-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              First Name*
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your name.."
              className="auth-input auth-input-active w-full"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Last Name*
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your name.."
              className="auth-input w-full bg-secondary"
              required
            />
          </div>

          {/* Email ID */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email ID*
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="info@xyz.com"
              className="auth-input w-full bg-secondary"
              required
            />
          </div>

          {/* Mobile No */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Mobile No.
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 - 98596 58000"
              className="auth-input w-full bg-secondary"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="xxxxxxxxxx"
                className="auth-input w-full bg-secondary pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm Password*
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="xxxxxxxxxx"
                className="auth-input w-full bg-secondary pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button type="submit" className="auth-button min-w-[160px]">
            Submit
          </button>
        </div>

        {/* Login Link */}
        <p className="mt-4 text-sm text-foreground">
          Already Have An Account?{" "}
          <Link to="/dashboard/login" className="auth-link">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
