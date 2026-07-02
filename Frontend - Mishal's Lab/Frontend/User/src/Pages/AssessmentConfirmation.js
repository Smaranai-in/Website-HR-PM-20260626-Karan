import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Mail, Calendar } from "lucide-react";

const AssessmentConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-[#0A0F2C] dark:via-[#0E1835] dark:to-[#0A0F2C] flex items-center justify-center px-4 pt-24 pb-12">
      <div className="max-w-2xl w-full">
        
        <div className="bg-white dark:bg-[#0E1835] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        
          <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          {/* MAin  Content */}
          <div className="p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Assessment Submitted!
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Your assessment has been successfully submitted. Our team will review your work
              and provide feedback within <span className="font-bold text-emerald-600">5-7 business days</span>.
            </p>

            {/* {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Email Notification */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6">
                <div className="flex justify-center mb-3">
                  <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                  Email Confirmation
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  A confirmation email has been sent to your registered email address.
                </p>
              </div>

              {/* Timeline */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-6">
                <div className="flex justify-center mb-3">
                  <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2">
                  Evaluation Timeline
                </h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Results will be shared within 5-7 business days via email.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-10 text-left">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">What Happens Next?</h3>
              <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>Our team reviews your submission</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>Evaluation and scoring process</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>Detailed feedback and results sent to your email</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span>Interview scheduling (if selected)</span>
                </li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors"
              >
                View Profile
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Have questions? Contact us at{" 9061301778 "}
            <a
              href="mailto:support@smaranai.in"
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              support@smaranai.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentConfirmation;
