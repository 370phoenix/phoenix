type userProfile = {
    gradYear: number;
    gender: string
}

type remainingSpotsObject = {
    capacity: number;
    filled: number;
}

type postObject = {
    pickupTime : string;
    dropoffTime: string;
    pickupLocation: string;
    dropoffLocation: string;
    riders: userProfile[];
    remainingSpots: remainingSpotsObject;
    rideNotes: string[];
    isMatched: boolean;
    isRequested: boolean;
}

export {userProfile, remainingSpotsObject, postObject}