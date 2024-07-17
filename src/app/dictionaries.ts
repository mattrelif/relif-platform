import "server-only";
import { Locale } from "@/app/i18n-config";

const dictionaries = {
    en: () => import("./_dictionaries/en.json").then(module => module.default),
    nl: () => import("./_dictionaries/nl.json").then(module => module.default),
};

export const getDictionary = async (locale: Locale): Promise<any> =>
    // @ts-ignore
    dictionaries[locale]?.() ?? dictionaries.en();
