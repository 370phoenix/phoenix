import { LocationObject } from "expo-location";

function convertDate(date: number | Date) {
    if (typeof date === "number") return new Date(date);
    else return date.getTime();
}

function convertLocation(location: string | LocationObject) {
    // TODO: Convert coords to string, string to coords with geocoding
    if (typeof location === "string") {
        try {

        } catch (e) {
            console.log("error: " + e);
        }
    }
}

// Function to convert date to string (will be useful for reading from database)
const formatDateString = (tempDate: Date): string => {
    const fDate = tempDate.getMonth() + 1 + "/" + tempDate.getDate() + "/" + tempDate.getFullYear();
    let minutes: string | number = tempDate.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let hours: string | number = tempDate.getHours();
    hours = hours > 12 ? hours - 12 : hours;

    const fTime = `${hours}:${minutes}`;
    return fDate + " " + fTime;
};

export default { convertLocation, convertDate, formatDateString };
