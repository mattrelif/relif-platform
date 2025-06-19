"use client";

import { ReactNode, useEffect, useState } from "react";
import { getVolunteerById } from "@/repository/volunteer.repository";
import { VoluntarySchema } from "@/types/voluntary.types";
import { useDictionary } from "@/app/context/dictionaryContext";
import { MdError } from "react-icons/md";

import { Form } from "./form.layout";

export default function Page({
    params,
}: {
    params: {
        volunteer_id: string;
    };
}): ReactNode {
    const dict = useDictionary();
    const [volunteerData, setVolunteerData] = useState<VoluntarySchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchVolunteerData = async () => {
            try {
                setIsLoading(true);
                const response = await getVolunteerById(params.volunteer_id);
                setVolunteerData(response.data);
            } catch (error) {
                console.error("Error fetching volunteer data:", error);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVolunteerData();
    }, [params.volunteer_id]);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <span className="text-base font-bold text-slate-900">{dict.root.loading}</span>
            </div>
        );
    }

    if (error || !volunteerData) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                    <MdError />
                    {dict.commons.volunteers.edit.errorFetchingVolunteer || "Error fetching volunteer data"}
                </span>
            </div>
        );
    }

    return <Form volunteerId={params.volunteer_id} volunteerData={volunteerData} />;
}
