"use client";

import { useState, useEffect } from "react";

interface BetaWarningProps {
    dict: any;
}

export function BetaWarning({ dict }: BetaWarningProps) {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        // Check if user has previously closed the warning
        const hasClosedWarning = localStorage.getItem('relif-beta-warning-closed');
        if (!hasClosedWarning) {
            setShowWarning(true);
        }
    }, []);

    const handleCloseWarning = () => {
        setShowWarning(false);
        localStorage.setItem('relif-beta-warning-closed', 'true');
    };

    if (!showWarning) {
        return null;
    }

    return (
        <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-lg">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <span className="text-2xl">🚀</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">
                            {dict.testWarning.title}
                        </h3>
                        <p className="text-xs text-blue-700 leading-relaxed mb-3">
                            {dict.testWarning.message}
                        </p>
                        <button
                            onClick={handleCloseWarning}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium"
                        >
                            {dict.testWarning.closeButton}
                        </button>
                    </div>
                    <button
                        onClick={handleCloseWarning}
                        className="flex-shrink-0 text-blue-400 hover:text-blue-600 transition-colors duration-200"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
} 