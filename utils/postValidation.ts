import { Coords } from "../constants/DataTypes";
import Filter from "bad-words";


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
    pickup: string | Coords;
    dropoff: string | Coords;
    numSeats: Number;
    notes: string;
}

export default function validateData({
    startTime,
    endTime,
    pickup,
    dropoff,
    numSeats,
    notes,
}: ValidatePostParams): SuccessMessage | ErrorMessage {
    //checks each case and returns error or success message
    try {
        if (!startTime)
            return { type: MessageType.error, message: "Enter a start time." }

        if (!endTime)
            return { type: MessageType.error, message: "Enter an end time." }

        if (startTime > endTime)
            return { type: MessageType.error, message: "End time cannot occur before start time." }

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
