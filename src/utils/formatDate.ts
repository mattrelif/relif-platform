const formatDate = (dateString: string, locale: "en" | "pt" | "es"): string => {
    // Handle null, undefined, or empty strings
    if (!dateString || dateString.trim() === "") {
        return "No date set";
    }

    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

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
            return dateString;
    }
};

export { formatDate };
