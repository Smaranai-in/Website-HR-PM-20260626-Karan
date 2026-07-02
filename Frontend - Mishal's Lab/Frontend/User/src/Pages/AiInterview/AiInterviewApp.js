import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../../context/AuthModalContext';
import ResumeUpload from './components/ResumeUpload';
import Interview from './components/Interview';
import Results from './components/Results';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

export default function AiInterviewApp() {
    const navigate = useNavigate();
    const { profile, loginbool, setActivePage } = useAuthModal();
    const [currentView, setCurrentView] = useState('upload');
    const [interviewData, setInterviewData] = useState(null);
    const [results, setResults] = useState(null);
    const [isRestored, setIsRestored] = useState(false);

    useEffect(() => {
        if (!loginbool || !profile) {
            setActivePage('login');
        }
    }, [loginbool, profile, setActivePage]);

    // Check if the user is already selected
    useEffect(() => {
        if (profile?.id) {
            const checkSelectionStatus = async () => {
                const { data } = await supabase
                    .from("w_internship_applications")
                    .select("current_status")
                    .eq("user_id", profile.id)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (data && [
                    "Selected",
                    "Pre-boarding / Selected",
                    "Pre-boarding Completed",
                    "Onboarded",
                    "Internship",
                    "Week 1 Review",
                    "Week 2 Review",
                    "On Track",
                    "Performance Issue",
                    "Recommended for Offer",
                    "Completed"
                ].includes(data.current_status)) {
                    toast.error("AI Interview is no longer available since you have been selected.");
                    navigate("/intern-portal");
                }
            };
            checkSelectionStatus();
        }
    }, [profile, navigate]);

    // Restore state from localStorage once profile is loaded
    useEffect(() => {
        if (profile?.id && !isRestored) {
            const storedView = localStorage.getItem(`ai_interview_${profile.id}_currentView`);
            const storedData = localStorage.getItem(`ai_interview_${profile.id}_interviewData`);
            const storedResults = localStorage.getItem(`ai_interview_${profile.id}_results`);

            if (storedView) setCurrentView(storedView);
            if (storedData) {
                try {
                    setInterviewData(JSON.parse(storedData));
                } catch (e) {
                    console.error("Error parsing stored interviewData:", e);
                }
            }
            if (storedResults) {
                try {
                    setResults(JSON.parse(storedResults));
                } catch (e) {
                    console.error("Error parsing stored results:", e);
                }
            }
            setIsRestored(true);
        }
    }, [profile, isRestored]);

    // Persist state changes to localStorage
    useEffect(() => {
        if (profile?.id && isRestored) {
            localStorage.setItem(`ai_interview_${profile.id}_currentView`, currentView);
            if (interviewData) {
                localStorage.setItem(`ai_interview_${profile.id}_interviewData`, JSON.stringify(interviewData));
            } else {
                localStorage.removeItem(`ai_interview_${profile.id}_interviewData`);
            }
            if (results) {
                localStorage.setItem(`ai_interview_${profile.id}_results`, JSON.stringify(results));
            } else {
                localStorage.removeItem(`ai_interview_${profile.id}_results`);
            }
        }
    }, [currentView, interviewData, results, profile, isRestored]);

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

    const handleRetake = () => {
        if (profile?.id) {
            localStorage.removeItem(`ai_interview_${profile.id}_currentView`);
            localStorage.removeItem(`ai_interview_${profile.id}_interviewData`);
            localStorage.removeItem(`ai_interview_${profile.id}_results`);
            localStorage.removeItem(`ai_interview_${profile.id}_currentQuestion`);
            localStorage.removeItem(`ai_interview_${profile.id}_answers`);
            localStorage.removeItem(`ai_interview_${profile.id}_tabSwitchCount`);
            localStorage.removeItem(`ai_interview_${profile.id}_elapsedTime`);
        }
        setInterviewData(null);
        setResults(null);
        setCurrentView('upload');
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
                <Results 
                    results={results} 
                    profile={profile}
                    interviewId={interviewData?.interviewId}
                    onRetake={handleRetake}
                />
            )}
        </div>
    );
}
