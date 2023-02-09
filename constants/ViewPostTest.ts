import { userProfile, remainingSpotsObject, postObject } from "./Types";

let testProfile1: userProfile = {
    gradYear: 2024,
    gender: 'M',
    first: 'Greg',
    last: 'Fenves',
    userID: 1
};
let testProfile2: userProfile = {
    gradYear: 1999,
    gender: 'T',
    first: 'Gordon',
    last: 'Mezli',
    userID: 3
};
let testProfile3: userProfile = {
    gradYear: 1900,
    gender: 'F',
    first: 'Deez',
    last: 'Nuts',
    userID: 2
};

let remSpots1: remainingSpotsObject = {
    capacity: 4,
    filled: 3,
};

let remSpots2: remainingSpotsObject = {
    capacity: 3,
    filled: 2,
};

let testPost1: postObject = {
    earliestTime: "1PM",
    latestTime: "3PM",
    pickupLocation: "Eagle Hall",
    dropoffLocation: "Publix",
    riders: [testProfile1, testProfile2, testProfile3],
    remainingSpots: remSpots1,
    rideNotes: [],
    isMatched: false,
    isRequested: false,
};

let testPost2: postObject = {
    earliestTime: "4PM",
    latestTime: "10PM",
    pickupLocation: "Your Mom's House",
    dropoffLocation: "Cox",
    riders: [testProfile2, testProfile3],
    remainingSpots: remSpots2,
    rideNotes: [],
    isMatched: false,
    isRequested: false,
};

let testPost3: postObject = {
    earliestTime: "6AM",
    latestTime: "7AM",
    pickupLocation: "Raoul Circle",
    dropoffLocation: "Hartsfield Jackson",
    riders: [testProfile1, testProfile3],
    remainingSpots: remSpots2,
    rideNotes: [],
    isMatched: false,
    isRequested: false,
};

export default [testPost1, testPost2, testPost3];
