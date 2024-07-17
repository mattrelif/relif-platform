import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { i18n } from "./i18n-config";

function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    // eslint-disable-next-line no-return-assign
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const { locales } = i18n;

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

    return matchLocale(languages, locales, i18n.defaultLocale);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        [
            "/manifest.json",
            "/favicon.ico",
            // Your other files in `public`
        ].includes(pathname)
    )
        return;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        // e.g. incoming request is /products
        // The new URL is now /en-US/products
        // eslint-disable-next-line consistent-return
        return NextResponse.redirect(
            new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
