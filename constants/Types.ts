type userProfile = {
    first: string;
    last: string;
    userID: number;
    gradYear: number;
    gender: string;
};

type remainingSpotsObject = {
    capacity: number;
    filled: number;
};

type postObject = {
    dropoffLocation: string;
    earliestTime: string;
    isMatched: boolean;
    isRequested: boolean;
    latestTime: string;
    pickupLocation: string;
    remainingSpots: remainingSpotsObject;
    rideNotes: string[];
    riders: userProfile[];
};

export { userProfile, remainingSpotsObject, postObject };
