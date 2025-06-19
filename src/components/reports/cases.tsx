"use client";

import { CaseSchema } from "@/types/case.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { ReactNode } from "react";

const styles = StyleSheet.create({
    page: {
        padding: 30,
        backgroundColor: "#FFF",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#000",
    },
    subHeader: {
        fontSize: 12,
        textAlign: "center",
        marginBottom: 15,
        color: "#666",
    },
    listItem: {
        marginBottom: 10,
        padding: 10,
        borderBottom: "1px solid #e0e0e0",
    },
    itemHeader: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#222",
    },
    itemText: {
        fontSize: 10,
        color: "#444",
        marginBottom: 2,
    },
    itemRow: {
        flexDirection: "row",
        marginBottom: 2,
    },
    itemLabel: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#333",
        width: "30%",
    },
    itemValue: {
        fontSize: 10,
        color: "#444",
        width: "70%",
    },
    statusBadge: {
        fontSize: 9,
        padding: "2 6",
        borderRadius: 3,
        backgroundColor: "#f0f0f0",
        color: "#333",
        marginTop: 2,
    },
    priorityHigh: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
    },
    priorityUrgent: {
        backgroundColor: "#fef2f2",
        color: "#b91c1c",
    },
    footer: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 12,
        color: "#777",
    },
});

const STATUS_LABELS = {
    "IN_PROGRESS": "In Progress",
    "PENDING": "Pending",
    "ON_HOLD": "On Hold",
    "CLOSED": "Closed",
    "CANCELLED": "Cancelled",
};

const PRIORITY_LABELS = {
    "LOW": "Low",
    "MEDIUM": "Medium", 
    "HIGH": "High",
    "URGENT": "Urgent",
};

const CASE_TYPE_LABELS = {
    "HOUSING": "Housing",
    "LEGAL": "Legal",
    "MEDICAL": "Medical",
    "SUPPORT": "Support",
    "OTHER": "Other",
};

const URGENCY_LABELS = {
    "IMMEDIATE": "Immediate",
    "WITHIN_WEEK": "Within Week",
    "WITHIN_MONTH": "Within Month",
    "FLEXIBLE": "Flexible",
};

type CasesPDFDocumentProps = {
    title: string;
    cases: CaseSchema[];
};

const CasesPDFDocument = ({ title, cases }: CasesPDFDocumentProps): ReactNode => {
    const date = new Date();
    const datetime = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>{title}</Text>
                <Text style={styles.subHeader}>
                    Total Cases: {cases.length} | Generated: {datetime}
                </Text>
                
                <View>
                    {cases?.map(case_ => (
                        <View style={styles.listItem} key={case_.id}>
                            <Text style={styles.itemHeader}>
                                {case_.case_number} - {convertToTitleCase(case_.title)}
                            </Text>
                            
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Status:</Text>
                                <Text style={styles.itemValue}>
                                    {STATUS_LABELS[case_.status as keyof typeof STATUS_LABELS] || case_.status}
                                </Text>
                            </View>
                            
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Priority:</Text>
                                <Text style={styles.itemValue}>
                                    {PRIORITY_LABELS[case_.priority as keyof typeof PRIORITY_LABELS] || case_.priority}
                                </Text>
                            </View>
                            
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Service Types:</Text>
                                <Text style={styles.itemValue}>
                                    {case_.service_types?.length > 0 
                                        ? case_.service_types.slice(0, 2).join(", ") + (case_.service_types.length > 2 ? "..." : "")
                                        : "None"
                                    }
                                </Text>
                            </View>
                            
                            {case_.urgency_level && (
                                <View style={styles.itemRow}>
                                    <Text style={styles.itemLabel}>Urgency:</Text>
                                    <Text style={styles.itemValue}>
                                        {URGENCY_LABELS[case_.urgency_level as keyof typeof URGENCY_LABELS] || case_.urgency_level}
                                    </Text>
                                </View>
                            )}
                            
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Beneficiary:</Text>
                                <Text style={styles.itemValue}>
                                    {case_.beneficiary?.full_name || 'Not assigned'}
                                </Text>
                            </View>
                            
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Assigned to:</Text>
                                <Text style={styles.itemValue}>
                                    {case_.assigned_to ? 
                                        `${case_.assigned_to.first_name} ${case_.assigned_to.last_name}` : 
                                        'Not assigned'
                                    }
                                </Text>
                            </View>
                            
                            {case_.due_date && (
                                <View style={styles.itemRow}>
                                    <Text style={styles.itemLabel}>Due Date:</Text>
                                    <Text style={styles.itemValue}>
                                        {formatDate(case_.due_date, "en")}
                                    </Text>
                                </View>
                            )}
                            
                            {case_.budget_allocated && (
                                <View style={styles.itemRow}>
                                    <Text style={styles.itemLabel}>Budget:</Text>
                                    <Text style={styles.itemValue}>{case_.budget_allocated}</Text>
                                </View>
                            )}
                            
                            {case_.description && (
                                <View style={styles.itemRow}>
                                    <Text style={styles.itemLabel}>Description:</Text>
                                    <Text style={styles.itemValue}>
                                        {case_.description.length > 100 
                                            ? `${case_.description.substring(0, 100)}...` 
                                            : case_.description
                                        }
                                    </Text>
                                </View>
                            )}
                            
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Notes:</Text>
                                <Text style={styles.itemValue}>{case_.notes_count || 0}</Text>
                            </View>
                            
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Documents:</Text>
                                <Text style={styles.itemValue}>{case_.documents_count || 0}</Text>
                            </View>
                            
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Created:</Text>
                                <Text style={styles.itemValue}>
                                    {formatDate(case_.created_at, "en")}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
                
                <Text style={styles.footer}>Generated at: {datetime}</Text>
            </Page>
        </Document>
    );
};

export { CasesPDFDocument }; 