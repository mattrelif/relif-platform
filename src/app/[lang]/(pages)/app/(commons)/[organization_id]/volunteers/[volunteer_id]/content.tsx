"use client";

import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { getVolunteerById } from "@/repository/volunteer.repository";
import { VoluntarySchema } from "@/types/voluntary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaCity } from "react-icons/fa";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { MdContactEmergency, MdError, MdMail, MdPhone } from "react-icons/md";

import { Toolbar } from "./toolbar.layout";

const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        // eslint-disable-next-line no-plusplus
        age--;
    }

    return age > 0 ? age : 0;
};

const RELATIONSHIPS_MAPPING = {
    parent: "Parent",
    child: "Child",
    sibling: "Sibling",
    spouse: "Spouse",
    grandparent: "Grandparent",
    grandchild: "Grandchild",
    "aunt-uncle": "Aunt/Uncle",
    "niece-nephew": "Niece/Nephew",
    cousin: "Cousin",
    guardian: "Guardian",
    other: "Other (specify)",
};

const GENDER_MAPPING = {
    male: "Male",
    female: "Female",
    "non-binary": "Non-Binary",
    "prefer-not-to-say": "Prefer Not to Say",
    transgender: "Transgender",
    "gender-fluid": "Gender Fluid",
    agender: "Agender",
    other: "Other",
};

const Content = ({ volunteerId }: { volunteerId: string }): ReactNode => {
    const pathname = usePathname();
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const [data, setData] = useState<VoluntarySchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        (async () => {
            try {
                if (volunteerId) {
                    const response = await getVolunteerById(volunteerId);
                    setData(response.data);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading)
        return <h2 className="p-4 text-relif-orange-400 font-medium text-sm">Loading...</h2>;

    if (!isLoading && error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                Something went wrong. Please try again later.
            </span>
        );

    if (data) {
        return (
            <div className="w-full h-max flex flex-col gap-2 p-2">
                <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-4 flex flex-col items-center gap-4">
                    <Toolbar volunteer={data as VoluntarySchema} />
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {convertToTitleCase(data.full_name)}
                        </h2>
                        <span className="text-sm text-slate-500 flex items-center gap-4">
                            Registered in {formatDate(data.created_at, locale || "en")}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                        <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                            <IoPerson />
                            Personal data
                        </h3>
                        <ul>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>Full name:</strong> {convertToTitleCase(data.full_name)}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                                <strong>Birthdate:</strong>{" "}
                                {formatDate(data.birthdate, locale || "en")} (
                                {calculateAge(data.birthdate)} years old)
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>E-mail:</strong> {data.email}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                <strong>Gender:</strong>{" "}
                                {GENDER_MAPPING[data.gender as keyof typeof GENDER_MAPPING]}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex flex-wrap gap-2">
                                <strong>Phones:</strong>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-sm text-slate-900 flex items-center gap-2">
                                            {data.phones[0] && data.phones[0].split("_").join(" ")}
                                        </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <h3 className="text-slate-900 font-bold text-sm mb-2">
                                            Phones
                                        </h3>
                                        <ul>
                                            {data.phones.map(phone => (
                                                <li className="text-slate-500 w-full text-xs flex items-center gap-2">
                                                    <MdPhone /> {phone.split("_").join(" ")}
                                                </li>
                                            ))}
                                        </ul>
                                    </HoverCardContent>
                                </HoverCard>
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2 flex-wrap">
                                <strong>Segments:</strong>{" "}
                                {data.segments?.map(segment => (
                                    <Badge className="bg-relif-orange-500">
                                        {convertToTitleCase(segment)}
                                    </Badge>
                                ))}
                            </li>
                        </ul>
                    </div>
                    <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                        <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                            <FaCity />
                            Address
                        </h3>
                        <ul>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>Address:</strong>{" "}
                                {convertToTitleCase(data.address.address_line_1)} -{" "}
                                {convertToTitleCase(data.address.address_line_2)}
                            </li>
                            <div className="flex flex-wrap gap-2 justify-between items-center border-t-[1px] border-slate-100">
                                <li className="p-2 text-sm text-slate-900">
                                    <strong>City:</strong> {convertToTitleCase(data.address.city)}
                                </li>
                                <li className="p-2 text-sm text-slate-900">
                                    <strong>State / Province:</strong>{" "}
                                    {convertToTitleCase(data.address.district)}
                                </li>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-between items-center border-t-[1px] border-slate-100">
                                <li className="p-2 text-sm text-slate-900">
                                    <strong>Zip / Postal Code:</strong>{" "}
                                    {convertToTitleCase(data.address.zip_code)}
                                </li>
                                <li className="p-2 text-sm text-slate-900">
                                    <strong>Country:</strong>{" "}
                                    {convertToTitleCase(data.address.country)}
                                </li>
                            </div>
                        </ul>
                        <h3 className="text-relif-orange-200 font-bold text-base py-4 border-t-[1px] border-slate-200 mt-4 flex items-center gap-2">
                            <MdContactEmergency />
                            Emergency Contacts
                        </h3>
                        <ul>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>Name:</strong>{" "}
                                {convertToTitleCase(data.emergency_contacts[0].full_name)}
                            </li>
                            <li className="w-full p-2 text-sm text-slate-900">
                                <strong>Relationship Degree:</strong>{" "}
                                {RELATIONSHIPS_MAPPING[
                                    data.emergency_contacts[0]
                                        .relationship as keyof typeof RELATIONSHIPS_MAPPING
                                ] || data.emergency_contacts[0].relationship}
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                                <strong>Email:</strong>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-sm text-slate-900 flex items-center gap-2">
                                            {data.emergency_contacts[0].emails[0] &&
                                                data.emergency_contacts[0].emails[0]}
                                            {data.emergency_contacts[0].emails.length >= 2 && (
                                                <Badge variant="outline">
                                                    +{data.emergency_contacts[0].emails.length - 1}
                                                </Badge>
                                            )}
                                        </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <h3 className="text-slate-900 font-bold text-sm mb-2">
                                            E-mails
                                        </h3>
                                        <ul>
                                            {data.emergency_contacts[0].emails.map(email => (
                                                <li className="text-slate-500 w-full text-xs flex items-center gap-2">
                                                    <MdMail /> {email}
                                                </li>
                                            ))}
                                        </ul>
                                    </HoverCardContent>
                                </HoverCard>
                            </li>
                            <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                                <strong>Phone:</strong>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-sm text-slate-900 flex items-center gap-2">
                                            {data.emergency_contacts[0].phones[0] &&
                                                data.phones[0].split("_").join(" ")}
                                            {data.emergency_contacts[0].phones.length >= 2 && (
                                                <Badge variant="outline">
                                                    +{data.emergency_contacts[0].phones.length - 1}
                                                </Badge>
                                            )}
                                        </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent>
                                        <h3 className="text-slate-900 font-bold text-sm mb-2">
                                            Phones
                                        </h3>
                                        <ul>
                                            {data.emergency_contacts[0].phones.map(phone => (
                                                <li className="text-slate-500 w-full text-xs flex items-center gap-2">
                                                    <MdPhone /> {phone.split("_").join(" ")}
                                                </li>
                                            ))}
                                        </ul>
                                    </HoverCardContent>
                                </HoverCard>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <FaBriefcaseMedical />
                        Medical information
                    </h3>
                    <div>
                        <ul className="w-full grid grid-cols-2">
                            <div>
                                <li className="w-full p-2 text-sm text-slate-900">
                                    <strong>Allergies:</strong>{" "}
                                    {data.medical_information.allergies.join(", ")}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Current medications:</strong>{" "}
                                    {data.medical_information.current_medications.join(", ")}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Chronic Medical Conditions:</strong>{" "}
                                    {data.medical_information.recurrent_medical_conditions.join(
                                        ", "
                                    )}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Health Insurance:</strong>{" "}
                                    {data.medical_information.health_insurance_plans.join(", ")}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Blood Type:</strong>{" "}
                                    {data.medical_information.blood_type}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Vaccinations:</strong>{" "}
                                    {data.medical_information.taken_vaccines.join(", ")}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Mental Health:</strong>{" "}
                                    {data.medical_information.mental_health_history.join(", ")}
                                </li>
                            </div>
                            <div>
                                <li className="w-full p-2 text-sm text-slate-900">
                                    <strong>Height:</strong> {data.medical_information.height}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Weight:</strong> {data.medical_information.weight}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Smoking and Alcohol Consumption Habits:</strong>{" "}
                                    {data.medical_information.addictions}{" "}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Disabilities:</strong>{" "}
                                    {data.medical_information.disabilities.join(", ")}
                                </li>
                                <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                                    <strong>Use of prosthesics or medical devices:</strong>{" "}
                                    {data.medical_information.prothesis_or_medical_devices.join(
                                        ", "
                                    )}
                                </li>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return <div />;
};

export { Content };
