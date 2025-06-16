"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface DebugInfoProps {
    title: string;
    data?: any;
    error?: any;
    isLoading?: boolean;
}

export const DebugInfo = ({ title, data, error, isLoading }: DebugInfoProps) => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    // Only show in development
    useEffect(() => {
        setIsVisible(process.env.NODE_ENV === 'development');
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 max-w-md bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm">{title} Debug</h3>
                <button 
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>
            
            <div className="text-xs space-y-2">
                <div>
                    <strong>Path:</strong> {pathname}
                </div>
                
                <div>
                    <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
                </div>
                
                {error && (
                    <div>
                        <strong className="text-red-400">Error:</strong>
                        <pre className="bg-gray-800 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(error, null, 2)}
                        </pre>
                    </div>
                )}
                
                <div>
                    <strong>Data:</strong>
                    <pre className="bg-gray-800 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
                
                <div>
                    <strong>Token:</strong> {typeof window !== 'undefined' && localStorage.getItem("r_to") ? "Present" : "Missing"}
                </div>
                
                <div>
                    <strong>Timestamp:</strong> {new Date().toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
}; 