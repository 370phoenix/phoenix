import { Coords } from "../constants/DataTypes";

export function convertDate(date: number | Date) {
    let tempDate;
    if (typeof date === "number") tempDate = new Date(date);
    else tempDate = date;
    const dayOfWeek = tempDate.toLocaleString("en-us", { weekday: "long" }).split(",")[0];
    const month = tempDate.toLocaleString("en-us", { month: "long" });

    const fDate = `${dayOfWeek}, ${month} ${tempDate.getDate()}`;
    return fDate;
}

export function convertTime(date: number | Date) {
    let tempDate;
    if (typeof date === "number") tempDate = new Date(date);
    else tempDate = date;
    let minutes: string | number = tempDate.getMinutes();
    minutes = Math.floor(minutes / 5) * 5;
    minutes = minutes < 10 ? "0" + minutes :     minutes;
    let hours: string | number = tempDate.getHours();
    hours = hours > 12 ? hours - 12 : hours;
    if(hours === 0) hours = 12;
    const ampm = tempDate.getHours() >= 12 ? "pm" : "am";

    const fTime = `${hours}:${minutes}${ampm}`;
    return fTime;
}

export function convertLocation(location: string | Coords) {
    // TODO: Convert coords to string, string to coords with geocoding
    return typeof location === "string" ? location : "Could not parse date from location";
}
