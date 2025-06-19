"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
    FaFlag,
    FaFileAlt,
    FaUser,
    FaEdit,
    FaCheck,
    FaClock,
    FaPlus,
    FaExclamationTriangle,
    FaComments,
    FaUserCheck,
    FaLock,
    FaUnlock,
} from "react-icons/fa";

interface TimelineEvent {
    id: string;
    type: "created" | "status_change" | "priority_change" | "assigned" | "document_added" | "comment_added" | "updated" | "closed" | "reopened";
    title: string;
    description: string;
    user: {
        name: string;
        role: string;
    };
    timestamp: string;
    metadata?: {
        previous_value?: string;
        new_value?: string;
        document_name?: string;
        comment?: string;
    };
}

interface TimelineProps {
    caseId: string;
    onTimelineEventsLoad?: (count: number) => void;
}

const CaseTimeline = ({ caseId, onTimelineEventsLoad }: TimelineProps): ReactNode => {
    const pathname = usePathname();
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";
    
    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTimelineEvents = async () => {
            try {
                setIsLoading(true);
                
                // TODO: Replace with actual API call when timeline endpoint is available
                // const response = await getCaseTimeline(caseId);
                // setTimelineEvents(response.data);
                
                // For now, create timeline events based on case creation
                const mockEvents: TimelineEvent[] = [
                    {
                        id: "1",
                        type: "created" as const,
                        title: "Case Created",
                        description: "New case opened in the system",
                        user: { name: "System", role: "System" },
                        timestamp: new Date().toISOString(),
                    }
                ];
                
                setTimelineEvents(mockEvents);
                onTimelineEventsLoad?.(mockEvents.length);
                
            } catch (error) {
                console.error("Error fetching timeline events:", error);
                // Fallback to minimal timeline
                const fallbackEvents: TimelineEvent[] = [
                    {
                        id: "1",
                        type: "created" as const,
                        title: "Case Created",
                        description: "Case created in the system",
                        user: { name: "System", role: "System" },
                        timestamp: new Date().toISOString(),
                    }
                ];
                setTimelineEvents(fallbackEvents);
                onTimelineEventsLoad?.(fallbackEvents.length);
            } finally {
                setIsLoading(false);
            }
        };

        if (caseId) {
            fetchTimelineEvents();
        }
    }, [caseId, onTimelineEventsLoad]);

    const getEventIcon = (type: string) => {
        switch (type) {
            case "created":
                return <FaPlus className="w-4 h-4 text-green-600" />;
            case "status_change":
                return <FaFlag className="w-4 h-4 text-blue-600" />;
            case "priority_change":
                return <FaExclamationTriangle className="w-4 h-4 text-orange-600" />;
            case "assigned":
                return <FaUserCheck className="w-4 h-4 text-purple-600" />;
            case "document_added":
                return <FaFileAlt className="w-4 h-4 text-cyan-600" />;
            case "comment_added":
                return <FaComments className="w-4 h-4 text-gray-600" />;
            case "updated":
                return <FaEdit className="w-4 h-4 text-yellow-600" />;
            case "closed":
                return <FaLock className="w-4 h-4 text-red-600" />;
            case "reopened":
                return <FaUnlock className="w-4 h-4 text-green-600" />;
            default:
                return <FaClock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case "created":
                return "border-green-200 bg-green-50";
            case "status_change":
                return "border-blue-200 bg-blue-50";
            case "priority_change":
                return "border-orange-200 bg-orange-50";
            case "assigned":
                return "border-purple-200 bg-purple-50";
            case "document_added":
                return "border-cyan-200 bg-cyan-50";
            case "comment_added":
                return "border-gray-200 bg-gray-50";
            case "updated":
                return "border-yellow-200 bg-yellow-50";
            case "closed":
                return "border-red-200 bg-red-50";
            case "reopened":
                return "border-green-200 bg-green-50";
            default:
                return "border-gray-200 bg-gray-50";
        }
    };

    if (isLoading) {
        return (
            <div className="w-full border-[1px] border-slate-200 rounded-lg p-4 flex flex-col h-[750px]">
                <h3 className="text-relif-orange-200 font-bold text-base pb-4 flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    Case Timeline
                </h3>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-slate-500 text-sm">Loading timeline...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full border-[1px] border-slate-200 rounded-lg p-4 flex flex-col h-[750px]">
            <h3 className="text-relif-orange-200 font-bold text-base pb-4 flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                Case Timeline ({timelineEvents.length} events)
            </h3>

            <div className="relative flex-1 overflow-y-auto">
                <div className="space-y-6 pr-2 relative">
                    {/* Continuous timeline line */}
                    <div 
                        className="absolute w-0.5 bg-slate-300 z-0" 
                        style={{
                            left: '24px', // Center of 48px (w-12) dot
                            top: '24px',  // Start from center of first dot
                            height: `calc(100% - 24px)` // Extend to the end
                        }}
                    ></div>

                    {timelineEvents.map((event, index) => (
                        <div key={event.id} className="relative flex items-start gap-4">
                            {/* Timeline dot */}
                            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getEventColor(event.type)} flex-shrink-0`}>
                                {getEventIcon(event.type)}
                            </div>

                            {/* Event content */}
                            <div className="flex-1 min-w-0 pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-slate-900">
                                            {event.title}
                                        </h4>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {event.description}
                                        </p>

                                        {/* Metadata */}
                                        {event.metadata && (
                                            <div className="mt-2 space-y-1">
                                                {event.metadata.previous_value && event.metadata.new_value && (
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Badge variant="outline" className="text-red-600 border-red-200">
                                                            {event.metadata.previous_value}
                                                        </Badge>
                                                        <span className="text-slate-500">→</span>
                                                        <Badge variant="outline" className="text-green-600 border-green-200">
                                                            {event.metadata.new_value}
                                                        </Badge>
                                                    </div>
                                                )}
                                                {event.metadata.new_value && !event.metadata.previous_value && (
                                                    <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs">
                                                        {event.metadata.new_value}
                                                    </Badge>
                                                )}
                                                {event.metadata.document_name && (
                                                    <Badge variant="outline" className="text-cyan-600 border-cyan-200 text-xs">
                                                        📄 {event.metadata.document_name}
                                                    </Badge>
                                                )}
                                                {event.metadata.comment && (
                                                    <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-700 italic border-l-2 border-slate-300">
                                                        "{event.metadata.comment}"
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* User and timestamp */}
                                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                                            <FaUser className="w-3 h-3" />
                                            <span className="font-medium">{event.user.name}</span>
                                            <span>({event.user.role})</span>
                                            <span>•</span>
                                            <span>{formatDate(event.timestamp, locale)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Timeline end indicator */}
                    <div className="relative flex items-center gap-4 mt-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 border-slate-300 bg-slate-100">
                            <FaCheck className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="text-sm text-slate-500 italic">
                            Timeline complete
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseTimeline;
export { CaseTimeline }; 