import React, { useState } from "react";
import { Brain } from "lucide-react";
import ChatWidget from "./ChatWidget";
import { useAuthModal } from "../context/AuthModalContext";

export default function GlobalChat() {
    const { user, setActivePage } = useAuthModal();
    const [showChat, setShowChat] = useState(false);

    return (
        <>
            {/* 💬 Floating AI Chat Toggle Button */}
            <div
                onClick={() => {
                    if (user) {
                        // ✅ If user logged in → toggle chat window
                        setShowChat((prev) => !prev);
                    } else {
                        // 🚫 If not logged in → open login modal
                        if (setActivePage) setActivePage("login");
                    }
                }}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white 
             rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-[9999] 
             cursor-pointer hover:scale-110 transition-all duration-300 animate-glow"
            >
                {showChat ? (
                    <span className="text-2xl font-bold leading-none select-none">✕</span>
                ) : (
                    <Brain size={28} />
                )}
            </div>

            {/* 🧠 Chat Widget (only show if logged in and toggled on) */}
            {user && showChat && <ChatWidget onClose={() => setShowChat(false)} />}
        </>
    );
}
