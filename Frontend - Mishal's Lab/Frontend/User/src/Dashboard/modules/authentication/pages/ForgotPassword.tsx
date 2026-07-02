import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import AuthLayout from "../../../components/AuthLayout";
import forgotPasswordIllustration from "../../../assets/forgot-password-illustration.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AuthLayout
      illustration={forgotPasswordIllustration}
      illustrationAlt="Forgot password security illustration"
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
          Forgot your password?
        </h1>
        <p className="text-muted-foreground mb-8">
          Enter your email below to recover your password
        </p>

        {submitted ? (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm text-primary">
            Password reset link has been sent to your email address.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address*"
                className="auth-input w-full"
                required
              />
            </div>

            <button type="submit" className="auth-button w-full">
              Submit
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
