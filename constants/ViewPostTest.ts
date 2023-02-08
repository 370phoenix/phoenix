import { userProfile, remainingSpotsObject, postObject } from "./Types";

let testProfile: userProfile = {
    gradYear: 2024,
    gender: 'M'
};

let remSpots1: remainingSpotsObject = {
    capacity: 4,
    filled: 1,
};

let remSpots2: remainingSpotsObject = {
    capacity: 3,
    filled: 2,
};

let testPost1: postObject = {
    pickupTime: "1PM",
    dropoffTime: "3PM",
    pickupLocation: "Eagle Hall",
    dropoffLocation: "Publix",
    riders: [testProfile],
    remainingSpots: remSpots1,
    rideNotes: [],
    isMatched: false,
    isRequested: false,
};

let testPost2: postObject = {
    pickupTime: "4PM",
    dropoffTime: "10PM",
    pickupLocation: "Your Mom's House",
    dropoffLocation: "Cox",
    riders: [testProfile],
    remainingSpots: remSpots2,
    rideNotes: [],
    isMatched: false,
    isRequested: false,
};

let testPost3: postObject = {
    pickupTime: "6AM",
    dropoffTime: "7AM",
    pickupLocation: "Raoul Circle",
    dropoffLocation: "Hartsfield Jackson",
    riders: [testProfile],
    remainingSpots: remSpots2,
    rideNotes: [],
    isMatched: false,
    isRequested: false,
};

export default [testPost1, testPost2, testPost3];
