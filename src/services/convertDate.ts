const converDate = (date: Date) => {
    const startDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
    };
    return startDate.toLocaleDateString("en-GB", options);
}

export default converDate;