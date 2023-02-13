import { Location } from "./LocationPicker";

type PostID = number[] | string;

type PostType = {
    pickup: Location.LocationObject | null | string;
    dropoff: Location.LocationObject | null | string;
    postID: PostID;
    numFriends: number;
    availableSpots: number;
    notes: string;
    dateTime: Date;
    roundTrip: boolean;
    isMatched: PostID[];
    isRequested: PostID[];
};

export default function validateData(): string {
    // Check each argument for edge cases and write descriptive error messages
    return "Valid";
}

export { PostID, PostType };
