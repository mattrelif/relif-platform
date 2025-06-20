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
import {
    getCaseById,
    getCaseDocuments,
    getCaseNotes,
} from "@/repository/organization.repository";

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
                
                console.log("📅 Building timeline for case:", caseId);
                
                // Fetch case data, documents, and notes in parallel
                const [caseResponse, documentsResponse, notesResponse] = await Promise.allSettled([
                    getCaseById(caseId),
                    getCaseDocuments(caseId),
                    getCaseNotes(caseId)
                ]);
                
                console.log("📅 API Responses:", {
                    case: caseResponse.status,
                    documents: documentsResponse.status,
                    notes: notesResponse.status
                });
                
                const events: TimelineEvent[] = [];
                
                // Add case creation event
                if (caseResponse.status === 'fulfilled') {
                    const caseData = caseResponse.value.data;
                    console.log("📄 Case data:", caseData);
                    events.push({
                        id: `case-created-${caseData.id}`,
                        type: "created",
                        title: "Case Created",
                        description: `Case "${caseData.title}" was created in the system`,
                        user: { name: caseData.assigned_to ? `${caseData.assigned_to.first_name} ${caseData.assigned_to.last_name}` : "System", role: "Case Worker" },
                        timestamp: caseData.created_at,
                    });
                    
                    // Add case assignment if exists
                    if (caseData.assigned_to) {
                        events.push({
                            id: `case-assigned-${caseData.id}`,
                            type: "assigned",
                            title: "Case Assigned",
                            description: "Case was assigned to a case worker",
                            user: { name: "System", role: "System" },
                            timestamp: caseData.created_at, // Use creation time as assignment time
                            metadata: {
                                new_value: `${caseData.assigned_to.first_name} ${caseData.assigned_to.last_name}`,
                            },
                        });
                    }
                } else {
                    console.error("❌ Failed to fetch case data:", caseResponse.reason);
                }
                
                // Add document events
                if (documentsResponse.status === 'fulfilled') {
                    const documents = Array.isArray(documentsResponse.value.data) 
                        ? documentsResponse.value.data 
                        : [];
                    
                    console.log("📄 Documents data:", documents);
                    documents.forEach((doc: any) => {
                        events.push({
                            id: `doc-${doc.id}`,
                            type: "document_added",
                            title: "Document Added",
                            description: "New document was uploaded to the case",
                            user: { 
                                name: doc.uploaded_by?.name || "Unknown User", 
                                role: "Case Worker" 
                            },
                            timestamp: doc.created_at,
                            metadata: {
                                document_name: doc.document_name,
                            },
                        });
                    });
                } else {
                    console.error("❌ Failed to fetch documents:", documentsResponse.reason);
                }
                
                // Add note/update events
                if (notesResponse.status === 'fulfilled') {
                    const notesData = notesResponse.value.data;
                    const notes = Array.isArray(notesData) 
                        ? notesData 
                        : (notesData?.data && Array.isArray(notesData.data) ? notesData.data : []);
                    
                    console.log("📄 Notes data:", notes);
                    notes.forEach((note: any) => {
                        events.push({
                            id: `note-${note.id}`,
                            type: "comment_added",
                            title: note.title || "Case Update",
                            description: note.content || "Case update was added",
                            user: { 
                                name: note.created_by?.name || "Unknown User", 
                                role: "Case Worker" 
                            },
                            timestamp: note.created_at,
                            metadata: {
                                comment: note.content,
                            },
                        });
                    });
                } else {
                    console.error("❌ Failed to fetch notes:", notesResponse.reason);
                }
                
                // Sort events by timestamp (oldest first - chronological order)
                events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                
                console.log("📅 Timeline events built:", events.length, "events", events);
                setTimelineEvents(events);
                onTimelineEventsLoad?.(events.length);
                
                // If no events were built and we're in development mode, use mock data
                if (events.length === 0 && process.env.NODE_ENV === 'development') {
                    console.log("🎭 Development mode: Using mock timeline data due to API failures");
                    
                    const mockTimelineEvents: TimelineEvent[] = [
                        {
                            id: "mock-case-created",
                            type: "created",
                            title: "Case Created",
                            description: 'Case "Emergency Housing Assistance" was created in the system',
                            user: { name: "Ana Silva", role: "Case Worker" },
                            timestamp: "2025-01-15T10:30:00Z",
                        },
                        {
                            id: "mock-case-assigned",
                            type: "assigned",
                            title: "Case Assigned",
                            description: "Case was assigned to a case worker",
                            user: { name: "Ana Silva", role: "Case Worker" },
                            timestamp: "2025-01-15T10:35:00Z",
                            metadata: {
                                new_value: "Ana Silva",
                            },
                        },
                        {
                            id: "mock-doc-1",
                            type: "document_added",
                            title: "Document Added",
                            description: "New document was uploaded to the case",
                            user: { 
                                name: "Ana Silva", 
                                role: "Case Worker" 
                            },
                            timestamp: "2025-01-15T11:00:00Z",
                            metadata: {
                                document_name: "Identity Document Copy",
                            },
                        },
                        {
                            id: "mock-doc-2",
                            type: "document_added",
                            title: "Document Added",
                            description: "New document was uploaded to the case",
                            user: { 
                                name: "Legal Advisor", 
                                role: "Legal Specialist" 
                            },
                            timestamp: "2025-01-16T09:30:00Z",
                            metadata: {
                                document_name: "Legal Consultation Notes",
                            },
                        },
                        {
                            id: "mock-note-1",
                            type: "comment_added",
                            title: "Case Update",
                            description: "Case update was added",
                            user: { 
                                name: "Ana Silva", 
                                role: "Case Worker" 
                            },
                            timestamp: "2025-01-17T14:15:00Z",
                            metadata: {
                                comment: "Initial assessment completed. Beneficiary requires immediate legal documentation support.",
                            },
                        },
                        {
                            id: "mock-note-2",
                            type: "comment_added",
                            title: "Legal Consultation",
                            description: "Case update was added",
                            user: { 
                                name: "Legal Advisor", 
                                role: "Legal Specialist" 
                            },
                            timestamp: "2025-01-18T10:45:00Z",
                            metadata: {
                                comment: "Legal consultation session conducted. Documentation process initiated with local authorities.",
                            },
                        }
                    ];
                    
                    // Sort mock events by timestamp (oldest first - chronological order)
                    mockTimelineEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                    
                    console.log("🎭 Mock timeline events:", mockTimelineEvents.length, "events");
                    setTimelineEvents(mockTimelineEvents);
                    onTimelineEventsLoad?.(mockTimelineEvents.length);
                }
                
            } catch (error) {
                console.error("❌ Error building timeline:", error);
                
                // Fallback to minimal timeline only if we have no events at all
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
                                                        "{event.metadata.comment.length > 100 
                                                            ? event.metadata.comment.substring(0, 100) + '...' 
                                                            : event.metadata.comment}"
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
                </div>
            </div>
        </div>
    );
};

export default CaseTimeline;
export { CaseTimeline }; 