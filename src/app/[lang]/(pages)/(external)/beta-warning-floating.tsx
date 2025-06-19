"use client";

import { useState } from "react";

interface BetaWarningFloatingProps {
    dict: any;
}

export function BetaWarningFloating({ dict }: BetaWarningFloatingProps) {
    const [showWarning, setShowWarning] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCloseWarning = () => {
        setShowWarning(false);
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    if (!showWarning) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isExpanded ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-lg backdrop-blur-sm max-w-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <span className="text-lg">🚀</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-blue-800 mb-2">
                                {dict.testWarning.title}
                            </h3>
                            <p className="text-xs text-blue-700 leading-relaxed mb-3">
                                {dict.testWarning.message}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCloseWarning}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium"
                                >
                                    {dict.testWarning.closeButton}
                                </button>
                                <button
                                    onClick={toggleExpanded}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium"
                                >
                                    Minimize
                                </button>
                            </div>
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
            ) : (
                <button
                    onClick={toggleExpanded}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
                    title="Beta Testing Info"
                >
                    <span className="text-lg">🚀</span>
                </button>
            )}
        </div>
    );
} 