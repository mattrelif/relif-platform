"use client";

import { ReactNode } from "react";
import { MdError } from "react-icons/md";

const Error = (): ReactNode => {
    return (
        <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
            <MdError />
            Something went wrong. Please try again later.
        </span>
    );
};

export default Error;
