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
}

type PostType = {
    pickup: Coords | string;
    dropoff: Coords | string;
    postID: PostID;
    numFriends: number;
    availableSpots: number;
    notes: string;
    dateTime: number;
    roundTrip: boolean;
    isMatched: boolean;
    isRequested: boolean;
    riders: UserID[];
};

export { UserType, PostType, Coords };
