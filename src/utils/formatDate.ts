// Enhanced date parsing function to handle multiple formats
const parseDate = (dateString: string): Date | null => {
    if (!dateString || dateString.trim() === "") {
        return null;
    }

    let date: Date | null = null;
    const cleanedDate = dateString.trim();

    // Add debug logging in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
        console.log(`🔍 Parsing date: "${cleanedDate}"`);
    }

    // First, try standard Date constructor (works for ISO formats)
    date = new Date(cleanedDate);
    if (!isNaN(date.getTime())) {
        if (isDevelopment) {
            console.log(`✅ Successfully parsed with Date constructor: ${date.toISOString()}`);
        }
        return date;
    }

    if (isDevelopment) {
        console.log(`❌ Date constructor failed, trying manual parsing...`);
    }

    // If that fails, try DD/MM/YYYY format (common in forms)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanedDate)) {
        const parts = cleanedDate.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // Month is 0-indexed in JavaScript
            const year = parseInt(parts[2]);
            
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                date = new Date(year, month, day);
                // Verify the date components match (handles invalid dates like Feb 30)
                if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                    if (isDevelopment) {
                        console.log(`✅ Successfully parsed as DD/MM/YYYY: ${date.toISOString()}`);
                    }
                    return date;
                }
            }
        }
    }

    // Try MM/DD/YYYY format as fallback
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanedDate)) {
        const parts = cleanedDate.split('/');
        if (parts.length === 3) {
            const month = parseInt(parts[0]) - 1; // Month is 0-indexed
            const day = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                date = new Date(year, month, day);
                // Verify the date components match
                if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                    if (isDevelopment) {
                        console.log(`✅ Successfully parsed as MM/DD/YYYY: ${date.toISOString()}`);
                    }
                    return date;
                }
            }
        }
    }

    // Try YYYY/MM/DD format
    if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(cleanedDate)) {
        const parts = cleanedDate.split('/');
        if (parts.length === 3) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // Month is 0-indexed
            const day = parseInt(parts[2]);
            
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                date = new Date(year, month, day);
                // Verify the date components match
                if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                    if (isDevelopment) {
                        console.log(`✅ Successfully parsed as YYYY/MM/DD: ${date.toISOString()}`);
                    }
                    return date;
                }
            }
        }
    }

    if (isDevelopment) {
        console.error(`❌ Failed to parse date: "${cleanedDate}" - trying all known formats`);
    }

    return null;
};

const formatDate = (dateString: string, locale: "en" | "pt" | "es"): string => {
    // Handle null, undefined, or empty strings
    if (!dateString || dateString.trim() === "") {
        return "No date set";
    }

    const date = parseDate(dateString);
    
    // Check if the date is valid
    if (!date || isNaN(date.getTime())) {
        console.warn(`Invalid date format received: "${dateString}"`);
        return "Invalid date";
    }

    // Check for unrealistic dates
    const currentYear = new Date().getFullYear();
    const dateYear = date.getFullYear();
    if (dateYear < 1900 || dateYear > currentYear + 10) {
        console.warn(`Unrealistic date received: "${dateString}" (year: ${dateYear})`);
        return "Invalid date";
    }

    try {
        switch (locale) {
            case "en":
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
            case "pt":
                return date
                    .toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })
                    .replace(/^(\d{2}) de (\w+) de (\d{4})$/, "$1 de $2 de $3");
            case "es":
                return date.toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
            default:
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
        }
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
    }
};

// Enhanced age calculation function that uses the robust date parser
const calculateAge = (dateString: string): number => {
    // Handle null, undefined, or empty strings
    if (!dateString || dateString.trim() === "") {
        return 0;
    }

    const birthDate = parseDate(dateString);
    const today = new Date();
    
    // Check if the date is valid
    if (!birthDate || isNaN(birthDate.getTime())) {
        console.warn(`Invalid birthdate format received: "${dateString}"`);
        return 0;
    }

    // Check if birthdate is in the future
    if (birthDate > today) {
        console.warn(`Birthdate is in the future: "${dateString}"`);
        return 0;
    }

    // Check for unrealistic birthdates (before 1900 or too far in future)
    const currentYear = today.getFullYear();
    const birthYear = birthDate.getFullYear();
    if (birthYear < 1900 || birthYear > currentYear) {
        console.warn(`Unrealistic birthdate: "${dateString}" (year: ${birthYear})`);
        return 0;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age > 0 ? age : 0;
};

// Test utility function for debugging date formats (only use in development)
const testDateFormats = (dateString: string): void => {
    if (process.env.NODE_ENV !== 'development') {
        return;
    }

    console.group(`🧪 Testing date formats for: "${dateString}"`);
    
    const parsed = parseDate(dateString);
    if (parsed) {
        console.log(`✅ Parsed successfully: ${parsed.toISOString()}`);
        console.log(`📅 Formatted (en): ${formatDate(dateString, 'en')}`);
        console.log(`🎂 Age: ${calculateAge(dateString)} years`);
    } else {
        console.error(`❌ Failed to parse date: "${dateString}"`);
        console.log('💡 Supported formats:');
        console.log('  - ISO: 2025-01-14T10:30:00.000Z or 2025-01-14');
        console.log('  - DD/MM/YYYY: 14/01/2025 or 14/1/2025');
        console.log('  - MM/DD/YYYY: 01/14/2025 or 1/14/2025');
        console.log('  - YYYY/MM/DD: 2025/01/14 or 2025/1/14');
    }
    
    console.groupEnd();
};

export { formatDate, calculateAge, parseDate, testDateFormats };
