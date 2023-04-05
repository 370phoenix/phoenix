import { Coords } from "../constants/DataTypes";
import Filter from "bad-words";
import Location from "expo-location";

export enum MessageType {
    error,
    success,
}

export type SuccessMessage = {
    message?: string;
    type: MessageType.success;
}

export type ErrorMessage = {
    message: string;
    type: MessageType.error;
}


type ValidatePostParams = {
    startTime: Date;
    endTime: Date;
    pickup: string;
    pickupCoords: number[] | undefined;
    dropoff: string;
    dropoffCoords: number[] | undefined;
    numSeats: number;
    notes: string;
}

async function geocodePickup(pText: string) {
    const geocodedLocation = await Location.geocodeAsync(pText);
    let lat: number = geocodedLocation[0].latitude;
    let long: number = geocodedLocation[0].longitude;
    let locCords = [lat, long];
    return locCords;
}

async function geocodeDropoff(dText: string) {
    const geocodedLocation = await Location.geocodeAsync(dText);
    let lat: number = geocodedLocation[0].latitude;
    let long: number = geocodedLocation[0].longitude;
    let locCords = [lat, long];
    return locCords;
}

export default async function validateData({
    startTime,
    endTime,
    pickup,
    pickupCoords,
    dropoff,
    dropoffCoords,
    numSeats,
    notes,
}: ValidatePostParams): Promise<SuccessMessage | ErrorMessage> {
    //checks each case and returns error or success message
    try {


        if (!startTime)
            return { type: MessageType.error, message: "Enter a start time." }

        if (!endTime)
            return { type: MessageType.error, message: "Enter an end time." }

        if (startTime > endTime)
            return { type: MessageType.error, message: "End time cannot occur before start time." }

        console.log("geocoding pickup");
        pickupCoords = await geocodePickup(pickup);
        console.log("Pickup Coords: " + pickupCoords);

        dropoffCoords = await geocodeDropoff(dropoff);
        console.log("Dropoff coords: " + dropoffCoords);

        if (pickupCoords[0] == 0 && pickupCoords[1] == 0) {
            return { type: MessageType.error, message: "Pickup location invalid." }
        }
        if (dropoffCoords[0] == 0 && pickupCoords[1] == 0) {
            return { type: MessageType.error, message: "Dropoff location invalid." }
        }
        const filter = new Filter();

        if (!pickup)
            return { type: MessageType.error, message: "Enter a pickup location." }

        if (!dropoff)
            return { type: MessageType.error, message: "Enter a dropoff location." }

        if (pickup == dropoff)
            return { type: MessageType.error, message: "Enter a dropoff location that is different from the pickup location." }
        if (filter.isProfane(notes))
            return { type: MessageType.error, message: "Notes can not be profane." }
        return { type: MessageType.success }

    } catch (e: any) {
        return { type: MessageType.error, message: `Error: ${e.message}` };
    }
    // Check each argument for edge cases and write descriptive error messages

}
