import type { AcademicCertificateData } from "../../../types/document";
import smaranaiLogo from "../../../assets/smaran-logo.png";

interface AcademicCertificateTemplateProps {
  data: AcademicCertificateData;
}

const AcademicCertificateTemplate = ({ data }: AcademicCertificateTemplateProps) => {
  return (
    <div
      className="bg-white relative overflow-hidden"
      style={{
        width: '1123px',
        height: '794px',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Left purple decorative panel */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[140px]"
        style={{
          background: "linear-gradient(180deg, #5B4FD6 0%, #3B82F6 45%, #00D9D5 100%)"
        }}
      />

      {/* Left teal/cyan accent strip */}
      <div
        className="absolute left-8 top-0 bottom-0 w-4"
        style={{
          background: 'linear-gradient(180deg, #00D9D5 0%, #5EEAD4 50%, #00D9D5 100%)'
        }}
      />

      {/* Inner border frame */}
      <div
        className="absolute top-5 bottom-5 right-5"
        style={{
          left: '140px',
          border: '3px solid #5B4FD6',
          borderLeft: 'none'
        }}
      />

      {/* Top purple line inside border */}
      <div
        className="absolute right-5 h-1"
        style={{
          left: '140px',
          top: '20px',
          background: '#5B4FD6'
        }}
      />

      {/* Content area */}
      <div className="absolute top-0 bottom-0 right-0 flex flex-col" style={{ left: '160px', padding: '40px 50px 30px 30px' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1
              className="text-6xl font-black tracking-wide leading-none"
              style={{ fontFamily: 'Poppins, sans-serif', color: '#1a1a2e' }}
            >
              CERTIFICATE
            </h1>
            <h2
              className="text-2xl font-bold tracking-widest mt-1"
              style={{ fontFamily: 'Poppins, sans-serif', color: '#5B4FD6' }}
            >
              OF INTERNSHIP
            </h2>
          </div>
          <img src={smaranaiLogo} alt="SmaranAI" className="h-28 w-auto" />
        </div>

        {/* Certificate body */}
        <div className="flex-1 relative">
          {/* Watermark brain - faded in background */}
          <div
            className="absolute pointer-events-none"
            style={{
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '300px',
              height: '300px',
              opacity: 0.06
            }}
          >
            <img src={smaranaiLogo} alt="" className="w-full h-full object-contain" />
          </div>

          <p
            className="text-sm uppercase tracking-[0.25em] mb-2"
            style={{ color: '#6B7280' }}
          >
            THIS IS TO CERTIFY THAT
          </p>

          <h3
            className="text-5xl font-black pb-2 mb-4 inline-block"
            style={{
              fontFamily: 'Poppins, sans-serif',
              color: '#1a1a2e',
              borderBottom: '4px solid #5B4FD6'
            }}
          >
            [{data.internName || 'INTERN NAME'}]
          </h3>

          <p className="text-sm leading-relaxed mb-4 max-w-3xl" style={{ color: '#374151' }}>
            a student of <strong style={{ color: '#1a1a2e' }}>{data.collegeName || '{College Name}'}</strong>, pursuing <strong style={{ color: '#1a1a2e' }}>{data.courseName || '{Course Name}'}</strong> ({data.yearSemester || '{Year/Semester}'}), has successfully completed an internship at SmaranAI.in as a <strong style={{ color: '#1a1a2e' }}>{data.roleTitle || '{Role Title}'}</strong> Intern from{' '}
            <strong style={{ color: '#1a1a2e' }}>{data.startDate || '{Start Date}'}</strong> to <strong style={{ color: '#1a1a2e' }}>{data.endDate || '{End Date}'}</strong> with a total engagement of{' '}
            <strong style={{ color: '#1a1a2e' }}>{data.totalWorkingHours || '{Total Working Hours}'} hours</strong>, under Internship ID: <strong style={{ color: '#1a1a2e' }}>{data.internshipId || '{Internship ID}'}</strong> in <strong style={{ color: '#1a1a2e' }}>{data.mode || '{Mode}'}</strong> mode.
          </p>

          <p className="text-sm mb-2" style={{ color: '#374151' }}>
            The internship formed part of the student's academic curriculum and offered valuable practical experience.
          </p>

          <p className="text-sm mb-4" style={{ color: '#374151' }}>
            Throughout the internship, <strong style={{ color: '#1a1a2e' }}>{data.internName || '{Intern Name}'}</strong> gained valuable experience in:
          </p>

          {/* Skills badges */}
          <div className="flex gap-4 mb-8">
            <span
              className="px-5 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #00D9D5 0%, #3B82F6 100%)' }}
            >
              Organizational Skills
            </span>
            <span
              className="px-5 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' }}
            >
              Project Execution
            </span>
            <span
              className="px-5 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #5B4FD6 100%)' }}
            >
              Professional Collaboration
            </span>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end max-w-2xl">
            <div className="text-center">
              {data.supervisorSignature ? (
                <img
                  src={data.supervisorSignature}
                  alt="Supervisor Signature"
                  className="h-14 object-contain mb-1 mx-auto"
                />
              ) : (
                <div className="h-14 mb-1" />
              )}
              <p className="font-bold text-lg" style={{ color: '#1a1a2e' }}>
                {data.supervisorSignature ? '' : '[Supervisor Signature]'}
              </p>
              <p className="text-sm" style={{ color: '#6B7280' }}>Supervisor</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>SmaranAI.in</p>
            </div>
            <div className="text-center">
              {data.hrSignature ? (
                <img
                  src={data.hrSignature}
                  alt="HR Signature"
                  className="h-14 object-contain mb-1 mx-auto"
                />
              ) : (
                <div className="h-14 mb-1" />
              )}
              <p className="font-bold text-lg" style={{ color: '#1a1a2e' }}>
                {data.hrSignature ? '' : '[HR Signature]'}
              </p>
              <p className="text-sm" style={{ color: '#6B7280' }}>Human Resources</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>SmaranAI.in</p>
            </div>
          </div>
        </div>

        {/* Footer with note and date */}
        <div className="flex justify-between items-end mt-2">
          <p className="text-xs italic" style={{ color: '#9CA3AF' }}>
            This certificate is issued for college and academic reference purposes.
          </p>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Date <strong style={{ color: '#1a1a2e' }}>{data.issueDate || 'DD Month 20XX'}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcademicCertificateTemplate;
