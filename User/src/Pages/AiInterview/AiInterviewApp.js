import { useState, useEffect } from 'react';
import { useAuthModal } from '../../context/AuthModalContext';
import ResumeUpload from './components/ResumeUpload';
import Interview from './components/Interview';
import Results from './components/Results';

export default function AiInterviewApp() {
    const { profile, loginbool, setActivePage } = useAuthModal();
    const [currentView, setCurrentView] = useState('upload');
    const [interviewData, setInterviewData] = useState(null);
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!loginbool || !profile) {
            setActivePage('login');
        }
    }, [loginbool, profile, setActivePage]);

    if (!loginbool || !profile) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] flex items-center justify-center text-slate-900 dark:text-white">
                <p>Please log in to use the AI Interview feature.</p>
            </div>
        );
    }

    const handleResumeUpload = (data) => {
        setInterviewData(data);
        setCurrentView('interview');
    };

    const handleInterviewComplete = (data) => {
        setResults(data);
        setCurrentView('results');
    };

    return (
        <div className="pt-20"> {/* Add padding for the header */}
            {currentView === 'upload' && (
                <ResumeUpload
                    userId={profile.id}
                    userName={profile.name || profile.full_name || profile.email?.split('@')[0]}
                    userEmail={profile.email}
                    onNext={handleResumeUpload}
                    onLogout={() => { /* Logout is handled in Header */ }}
                />
            )}
            {currentView === 'interview' && interviewData && (
                <Interview
                    interviewId={interviewData.interviewId}
                    interviewData={interviewData}
                    onComplete={handleInterviewComplete}
                />
            )}
            {currentView === 'results' && results && (
                <Results results={results} />
            )}
        </div>
    );
}
