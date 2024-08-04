import { getHousingById } from "@/repository/housing.repository";
import { ReactNode } from "react";
import { Form } from "./form.layout";

export default async function Page({
    params,
}: {
    params: {
        housing_id: string;
    };
}): Promise<ReactNode> {
    const { data } = await getHousingById(params.housing_id);

    return (
        <div className="w-full h-max p-4 grid grid-cols-2 gap-4">
            <Form {...data} />
        </div>
    );
}
