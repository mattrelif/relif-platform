export const getTimezone = (): string => {
    const date = new Date();
    const offsetInMinutes = date.getTimezoneOffset();
    const offsetInHours = offsetInMinutes / 60;

    const timezoneOffset =
        offsetInHours > 0 ? `UTC-${Math.abs(offsetInHours)}` : `UTC+${Math.abs(offsetInHours)}`;

    return timezoneOffset;
};
