"use client";

import { createContext, ReactNode, useContext } from "react";

export const DictionaryContext = createContext<any>(null);

export const useDictionary = () => useContext(DictionaryContext);

export const DictionaryProvider = ({ children, dict }: { children: ReactNode; dict: any }) => {
    return <DictionaryContext.Provider value={dict}>{children}</DictionaryContext.Provider>;
};
