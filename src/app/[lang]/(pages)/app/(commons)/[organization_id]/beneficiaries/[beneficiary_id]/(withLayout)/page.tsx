import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { getBeneficiaryById } from "@/repository/beneficiary.repository";
import { ReactNode } from "react";
import { FaCity, FaMapMarkerAlt } from "react-icons/fa";
import { FaBriefcaseMedical, FaHouseChimneyUser } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { MdContactEmergency, MdMail, MdPhone } from "react-icons/md";
import { Toolbar } from "./toolbar.layout";

export default async function Page({
    params,
}: {
    params: {
        beneficiary_id: string;
    };
}): Promise<ReactNode> {
    const { data: beneficiary } = await getBeneficiaryById(params.beneficiary_id);

    return (
        <div className="w-full h-max flex flex-col gap-2">
            <div className="w-full h-max border-[1px] border-slate-200 rounded-lg p-4 flex flex-col items-center gap-4">
                <Toolbar />
                <div className="w-[130px] h-[130px] rounded-full overflow-hidden border-4 border-relif-orange-200">
                    {/* TODO: IMAGE */}
                    {/* <Image */}
                    {/*    src="https://github.com/anthonyvii27.png" */}
                    {/*    alt="Beneficiary image" */}
                    {/*    width={130} */}
                    {/*    height={130} */}
                    {/*    className="border-2 rounded-full border-white" */}
                    {/* /> */}
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {beneficiary.full_name}
                    </h2>
                    <span className="text-sm text-slate-500 flex items-center gap-4">
                        {/* TODO: Format */}
                        Registered in {beneficiary.created_at}
                        <Badge>{beneficiary.status}</Badge>
                    </span>
                </div>
            </div>
            <div className="w-ful h-max p-4 rounded-lg bg-relif-orange-500 flex justify-between">
                <div className="flex flex-col">
                    <h3 className="text-white font-bold text-base pb-2 flex items-center gap-2">
                        {" "}
                        <FaHouseChimneyUser size={15} />
                        Current housing
                    </h3>
                    <span className="text-xs text-slate-50 flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {/* TODO */}
                        {beneficiary.current_room_id} | Currently in space{" "}
                        <strong>{beneficiary.current_room_id}</strong>.
                    </span>
                    <span className="text-xs text-slate-50 flex items-center gap-1">
                        {/* TODO */}
                        Since Mar 04, 2023
                    </span>
                </div>

                <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:border-relif-orange-200 hover:text-relif-orange-200"
                >
                    View housing
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <IoPerson />
                        Personal data
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Full name:</strong> {beneficiary.full_name}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                            {/* TODO: Format */}
                            <strong>Birthdate:</strong> {beneficiary.birthdate} (24 years old)
                            <span>
                                <Badge className="bg-yellow-300 text-slate-900">Underage</Badge>
                            </span>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>E-mail:</strong> {beneficiary.email}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            {/* TODO: Gender */}
                            <strong>Gender:</strong> Men
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex flex-wrap gap-2">
                            <strong>Phones:</strong>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <span className="text-xs text-slate-500 flex items-center gap-2">
                                        <MdPhone />
                                        {beneficiary.phones[0] &&
                                            beneficiary.phones[0].split("_").join(" ")}
                                        {beneficiary.phones.length >= 2 && (
                                            <Badge variant="outline">
                                                +{beneficiary.phones.length - 1}
                                            </Badge>
                                        )}
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <h3 className="text-slate-900 font-bold text-sm mb-2">
                                        Phones
                                    </h3>
                                    <ul>
                                        {beneficiary.phones.map(phone => (
                                            <li className="text-slate-500 w-full text-xs flex items-center gap-2">
                                                <MdPhone /> {phone.split("_").join(" ")}
                                            </li>
                                        ))}
                                    </ul>
                                </HoverCardContent>
                            </HoverCard>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Civil status:</strong> {beneficiary.civil_status}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                            <strong>Languages spoken:</strong>{" "}
                            {beneficiary.spoken_languages?.map(language => (
                                <Badge className="bg-relif-orange-500">
                                    {language.toUpperCase()}
                                </Badge>
                            ))}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Education:</strong> {beneficiary.education}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            {/* TODO: Backend */}
                            <strong>Occupation:</strong> Bus driver
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
                            {/* TODO: alterar */}
                            <strong>Address:</strong> {beneficiary.address.street_name} -{" "}
                            {beneficiary.address.street_number}
                        </li>
                        <div className="flex flex-wrap gap-2 justify-between items-center border-t-[1px] border-slate-100">
                            <li className="p-2 text-sm text-slate-900">
                                <strong>City:</strong> {beneficiary.address.city}
                            </li>
                            <li className="p-2 text-sm text-slate-900">
                                <strong>State / Province:</strong> {beneficiary.address.district}
                            </li>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-between items-center border-t-[1px] border-slate-100">
                            <li className="p-2 text-sm text-slate-900">
                                <strong>Zip / Postal Code:</strong> {beneficiary.address.zip_code}
                            </li>
                            <li className="p-2 text-sm text-slate-900">
                                <strong>Country:</strong> {beneficiary.address.country}
                            </li>
                        </div>
                    </ul>
                    <h3 className="text-relif-orange-200 font-bold text-base py-4 border-t-[1px] border-slate-200 mt-4 flex items-center gap-2">
                        <MdContactEmergency />
                        Emergency Contacts
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Family:</strong> Yes
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                            <strong>Email:</strong>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <span className="text-xs text-slate-500 flex items-center gap-2">
                                        <MdMail />
                                        {beneficiary.emergency_contacts.emails[0] &&
                                            beneficiary.emergency_contacts.emails[0]}
                                        {beneficiary.emergency_contacts.emails.length >= 2 && (
                                            <Badge variant="outline">
                                                +{beneficiary.emergency_contacts.emails.length - 1}
                                            </Badge>
                                        )}
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <h3 className="text-slate-900 font-bold text-sm mb-2">
                                        E-mails
                                    </h3>
                                    <ul>
                                        {beneficiary.emergency_contacts.emails.map(email => (
                                            <li className="text-slate-500 w-full text-xs flex items-center gap-2">
                                                <MdMail /> {email}
                                            </li>
                                        ))}
                                    </ul>
                                </HoverCardContent>
                            </HoverCard>
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900 flex items-center gap-2">
                            <strong>Phones:</strong>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <span className="text-xs text-slate-500 flex items-center gap-2">
                                        <MdPhone />
                                        {beneficiary.emergency_contacts.phones[0] &&
                                            beneficiary.phones[0].split("_").join(" ")}
                                        {beneficiary.emergency_contacts.phones.length >= 2 && (
                                            <Badge variant="outline">
                                                +{beneficiary.emergency_contacts.phones.length - 1}
                                            </Badge>
                                        )}
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <h3 className="text-slate-900 font-bold text-sm mb-2">
                                        Phones
                                    </h3>
                                    <ul>
                                        {beneficiary.emergency_contacts.phones.map(phone => (
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
            <div className="grid grid-cols-2 gap-2">
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4">
                    <h3 className="text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <FaBriefcaseMedical />
                        Medical information
                    </h3>
                    <ul>
                        <li className="w-full p-2 text-sm text-slate-900">
                            <strong>Allergies:</strong>{" "}
                            {beneficiary.medical_information.allergies.join(", ")}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Current medications:</strong>{" "}
                            {beneficiary.medical_information.current_medications.join(", ")}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Chronic Medical Conditions:</strong>{" "}
                            {beneficiary.medical_information.recurrent_medical_conditions.join(
                                ", "
                            )}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Health Insurance:</strong>{" "}
                            {beneficiary.medical_information.health_insurance_plans.join(", ")}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Blood Type:</strong>{" "}
                            {beneficiary.medical_information.blood_type}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Vaccinations:</strong>{" "}
                            {beneficiary.medical_information.taken_vaccines.join(", ")}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Mental Health:</strong>{" "}
                            {beneficiary.medical_information.mental_health_history.join(", ")}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Height:</strong> {beneficiary.medical_information.height}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Weight:</strong> {beneficiary.medical_information.weight}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Smoking and Alcohol Consumption Habits:</strong>{" "}
                            {beneficiary.medical_information.cigarettes_usage},{" "}
                            {beneficiary.medical_information.alcohol_consumption}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            <strong>Disabilities:</strong>{" "}
                            {beneficiary.medical_information.disabilities.join(", ")}
                        </li>
                        <li className="w-full p-2 border-t-[1px] border-slate-100 text-sm text-slate-900">
                            {/* TODO: backend */}
                            <strong>Use of prosthesics or medical devices:</strong> Uso de
                            marca-passo
                        </li>
                        {/* TODO: REST... */}
                        <Button variant="link" className="p-0 pl-2">
                            See more
                        </Button>
                    </ul>
                </div>
                {/* <div className="w-full grow border-[1px] border-relif-orange-200 rounded-lg overflow-hidden">
                    <h3 className="pt-4 pl-4 pr-4 text-relif-orange-200 font-bold text-base pb-3 flex items-center gap-2">
                        <MdOutlineFamilyRestroom />
                        Family
                    </h3>
                    <ul className="h-[480px] overflow-y-scroll overflow-x-hidden pt-2 pb-4 pl-4 pr-4 flex flex-col gap-2">
                        <Link href="#">
                            <li className="w-full rounded-md bg-relif-orange-200/10 flex gap-4 p-4 hover:bg-relif-orange-200/20 cursor-pointer">
                                <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
                                    <Image
                                        src="https://github.com/anthonyvii27.png"
                                        alt="Family image"
                                        width={80}
                                        height={80}
                                        className="p-[1px] border-2 rounded-full border-relif-orange-200"
                                    />
                                </div>
                                <div className="h-max w-[calc(100%-80px)] flex flex-col">
                                    <span className="w-full text-sm text-slate-900 font-bold">
                                        Samanta Marks Oliver
                                    </span>
                                    <span className="w-full text-sm text-slate-500 mt-2 flex items-center gap-1">
                                        <FaBirthdayCake /> March 24, 1987
                                    </span>
                                    <div className="mt-3 flex gap-2">
                                        <span>
                                            <Badge className="flex">Wife</Badge>
                                        </span>
                                        <span>
                                            <Badge className="bg-relif-orange-400 flex items-center gap-1">
                                                <MdSpaceDashboard />
                                                In the same space
                                            </Badge>
                                        </span>
                                        <span>
                                            <Badge className="bg-relif-orange-400 flex items-center gap-1">
                                                <MdSpaceDashboard />
                                                In another space
                                            </Badge>
                                        </span>
                                    </div>
                                </div>
                            </li>
                        </Link>
                    </ul>
                </div> */}
            </div>
        </div>
    );
}
