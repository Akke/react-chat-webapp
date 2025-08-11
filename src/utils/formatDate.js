export const convertDateToRelevantTime = (timestamp) => {
    const units = {
        year: 24 * 60 * 60 * 1000 * 365,
        month: 24 * 60 * 60 * 1000 * 365/12,
        day: 24 * 60 * 60 * 1000,
        hour: 60 * 60 * 1000,
        minute: 60 * 1000,
        second: 1000
    }

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "narrow" });
    const elapsed = new Date(timestamp) - new Date();
    for(const unit in units) {
        if(Math.abs(elapsed) > units[unit] || unit == "second") {
            const time = Math.round(elapsed / units[unit]);
            return rtf.format(time, unit).split(" ")[0];
        }
    }
}

export const formatDateToReadable = (timestamp) => {
    const date = new Date(timestamp);
    return `${new Date(date).toDateString()}, ${new Date(date).toLocaleTimeString()}`
}