import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../../components/AuthLayout";
import verificationIllustration from "../../../assets/verification-illustration.png";

const Verify = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard or home after verification
    navigate("/");
  };

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <AuthLayout
      illustration={verificationIllustration}
      illustrationAlt="Verification illustration"
    >
      <div className="max-w-lg">
        {/* Back to login */}
        <Link
          to="/login"
          className="flex items-center gap-1 text-sm text-foreground hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to login
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-3">
          Verify Code
        </h1>
        <p className="text-muted-foreground mb-8">
          An authentication code has been sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showCode ? "text" : "password"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Code"
              className="auth-input w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button type="submit" className="auth-button w-full">
            Verify
          </button>

          <p className="text-sm text-foreground">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="auth-link"
              disabled={resent}
            >
              {resent ? "Code sent!" : "Resend"}
            </button>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Verify;
