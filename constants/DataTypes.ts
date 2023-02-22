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


type UserType = {
    gender: string;
    gradyear: string;
    major: string;
    phone: string;
    ridesCompleted: Number;
    username: string;
};

export { PostID, PostType, Coords, UserType, UserID };
