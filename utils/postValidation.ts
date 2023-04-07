import Filter from "bad-words";
import geocodeAddress from "./geocode";
import { NewPostType } from "../constants/DataTypes";

export enum MessageType {
    error,
    success,
}

export type SuccessMessage = {
    message?: string;
    type: MessageType.success;
};

export type ErrorMessage = {
    message: string;
    type: MessageType.error;
};

type ValidatePostParams = {
    post: NewPostType;
};

export default async function validateData({ post }: ValidatePostParams): Promise<NewPostType> {
    const { startTime, endTime, pickup, dropoff, notes } = post;
    const filter = new Filter();
    if (!pickup) throw Error("Enter a pickup location.");
    if (filter.isProfane(pickup)) throw Error("Pickup location cannot be profane.");
    
    const pickupCoords = await geocodeAddress(pickup);
    if (!pickupCoords) throw Error("Pickup location not found. Please enter a valid address.");
    
    if (!dropoff) throw Error("Enter a dropoff location.");
    if (filter.isProfane(dropoff)) throw Error("Dropoff location cannot be profane.");
    const dropoffCoords = await geocodeAddress(dropoff);
    if (!dropoffCoords) throw Error("Dropoff location not found. Please enter a valid address.");

    if (pickup === dropoff)
        throw Error("Enter a dropoff location that is different from the pickup location.");
    if (!startTime) throw Error("Enter a start time.");

    if (!endTime) throw Error("Enter an end time.");

    if (startTime > endTime) throw Error("End time cannot occur before start time.");


    if (filter.isProfane(notes)) throw Error("Notes cannot be profane.");

    const validatedPost: NewPostType = {
        ...post,
        pickup,
        dropoff,
        startTime,
        endTime,
        notes,
        pickupCoords,
        dropoffCoords,
    };
    return validatedPost;
}
