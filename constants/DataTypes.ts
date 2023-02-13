import Location from "expo-location";

type UserType = {
    firstName: string;
    lastName: string;
    userID: string;
    gender: string;
    gradYear: number;
    major: string;
    email: string;
};

type UserID = string;

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
    riders: UserID[];
};

// type postObject = {
//     dropoffLocation: string;
//     earliestTime: string;
//     isMatched: boolean;
//     isRequested: boolean;
//     latestTime: string;
//     pickupLocation: string;
//     remainingSpots: remainingSpotsObject;
//     rideNotes: string[];
//     riders: userProfile[];
// };

export { UserType, PostType };
