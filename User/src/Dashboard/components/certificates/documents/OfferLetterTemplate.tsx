import type { OfferLetterData } from "../../../types/document";
import smaranaiLogo from "../../../assets/smaran-logo.png";

interface OfferLetterTemplateProps {
  data: OfferLetterData;
}

const OfferLetterTemplate = ({ data }: OfferLetterTemplateProps) => {
  return (
    <div className="w-[794px] min-h-[1123px] bg-white relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left gradient border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2"
        style={{
          background: 'linear-gradient(180deg, #00D9D5 0%, #3B82F6 50%, #5B4FD6 100%)'
        }}
      />

      {/* Top gradient line */}
      <div
        className="absolute left-2 right-0 top-0 h-1"
        style={{
          background: 'linear-gradient(90deg, #00D9D5 0%, #F59E0B 100%)'
        }}
      />

      {/* Bottom gradient line */}
      <div
        className="absolute left-2 right-0 bottom-0 h-1"
        style={{
          background: 'linear-gradient(90deg, #00D9D5 0%, #F59E0B 100%)'
        }}
      />

      <div className="pl-10 pr-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <img src={smaranaiLogo} alt="SmaranAI" className="h-20 w-auto" />
          <h1
            className="text-4xl font-bold tracking-wide"
            style={{
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 50%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            OFFER LETTER
          </h1>
        </div>

        {/* Date */}
        <div className="text-right mb-6 text-sm">
          Date: {data.issueDate || '[DD Month YYYY]'}
        </div>

        {/* Greeting */}
        <div className="mb-4">
          <p className="text-base">Dear {data.internName || '[Intern Name]'},</p>
        </div>

        {/* Congratulations */}
        <div className="mb-6">
          <p className="font-semibold text-base mb-1">Congratulations!</p>
          <p className="text-sm">
            We are pleased to offer you the position of <strong>{data.roleTitle || 'Role Title'} Intern</strong> at <strong>SmaranAI.in</strong>.
          </p>
        </div>

        {/* Internship Terms */}
        <div className="mb-6">
          <h2 className="font-bold text-base mb-3 uppercase">Internship Terms</h2>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Position: {data.roleTitle || 'Role Title'} Intern</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Department: [{data.department || 'Department Name'}]</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Reporting To: Lead Consultant</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Duration: 1–2 Week Trial → {data.duration || 'Total Months'} (extendable)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Mode: {data.mode || 'Remote/On-Site/Hybrid'}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Weekly Commitment: {data.weeklyCommitment || 'Half Day: 15-20 hours, Full Day: 25–30 hours'}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Stipend: Unpaid (voluntary learning engagement)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Official DOJ: [{data.dateOfJoining || 'DD Month YYYY'}] (confirmed after trial)</span>
            </li>
          </ul>
        </div>

        {/* Trial & Performance Requirements */}
        <div className="mb-6">
          <h2 className="font-bold text-base mb-3 uppercase">Trial & Performance Requirements</h2>
          <p className="text-sm mb-2">Your first 1–2 weeks will be evaluated based on:</p>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Attendance & daily check-ins on Microsoft Teams</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Consistent engagement and communication</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Initiative and independence</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Quality and timely submission of daily work via Google Form</span>
            </li>
          </ul>
          <p className="text-sm mt-3">
            Failure to meet expectations may result in immediate discontinuation.
          </p>
        </div>

        {/* Next Steps */}
        <div className="mb-8">
          <h2 className="font-bold text-base mb-3 uppercase">Next Steps</h2>
          <p className="text-sm mb-3">
            To accept this <strong>Conditional Internship Offer</strong>, please reply within <strong>2 days</strong> with your acceptance and your confirmed Date of Joining.
          </p>
          <p className="text-sm">
            We look forward to welcoming you to <strong>SmaranAI.in</strong> and supporting your professional growth.
          </p>
        </div>

        {/* Signature */}
        <div className="mb-8">
          <p className="text-sm">Warm regards,</p>
          <p className="font-bold text-sm">SmaranAI Hiring Team</p>
          <p className="text-sm">SmaranAI.in</p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-10 right-8">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <span>www.smaranai.in</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>Linkedin</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
              </svg>
              <span>@smaranAI.in</span>
            </div>
            <a href="mailto:admin@smaranAI.in" className="flex items-center gap-1 text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span className="underline">admin@smaranAI.in</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferLetterTemplate;
