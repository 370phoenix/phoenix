import { Coords } from "../constants/DataTypes";

function convertDate(date: number | Date) {
    let tempDate;
    if (typeof date === "number") tempDate = new Date(date);
    else tempDate = date;
    const dayOfWeek = tempDate.toLocaleString('en-us', {  weekday: 'long' });
    const month = tempDate.toLocaleString('en-us', {  month: 'long' });

    const fDate = `${dayOfWeek}, ${month} ${tempDate.getDate()}`;
    return fDate;
}

function convertTime(date: number | Date) {
    let tempDate;
    if (typeof date === "number") tempDate = new Date(date);
    else tempDate = date;
    let minutes: string | number = tempDate.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let hours: string | number = tempDate.getHours();
    hours = hours > 12 ? hours - 12 : hours;
    const ampm = hours >= 12 ? 'pm' : 'am';

    const fTime = `${hours}:${minutes}${ampm}`;
    return fTime;
}

function convertLocation(location: string | Coords) {
    // TODO: Convert coords to string, string to coords with geocoding
    return typeof location === "string" ? location : "Could not parse date from location"
}

export default { convertLocation, convertDate, convertTime };
