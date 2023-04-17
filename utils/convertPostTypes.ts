export function convertDate(date: Date) {
    const dayOfWeek = date.toLocaleString("en-us", { weekday: "long" }).split(",")[0];
    const month = date.toLocaleString("en-us", { month: "long" });

    return `${dayOfWeek}, ${month} ${date.getDate()}`;
}

export function convertTime(date: Date) {
    const minutes = Math.floor(date.getMinutes() / 5) * 5;
    const minuteString = minutes < 10 ? "0" + minutes : String(minutes);

    let hours = date.getHours();
    hours = hours > 12 ? hours - 12 : hours;
    if (hours === 0) hours = 12;

    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    return `${hours}:${minuteString} ${ampm}`;
}
