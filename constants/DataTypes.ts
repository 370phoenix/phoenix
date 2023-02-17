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

type Coords = {
    lat: number;
    lng: number;
};

type PostType = {
    pickup: Coords | string;
    dropoff: Coords | string;
    postID: PostID;
    numFriends: number;
    availableSpots: number;
    notes: string;
    startTime: number;
    endTime: number;
    roundTrip: boolean;
    isMatched: boolean;
    isRequested: boolean;
    riders: UserID[];
};

export { PostID, UserType, PostType, Coords };
