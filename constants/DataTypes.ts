type UserID = string;

type PostID = string;

type Coords = {
    lat: number;
    lng: number;
};

type PostType = {
    pickup: Coords | string;
    dropoff: Coords | string;
    postID: PostID;
    totalSpots: number;
    notes: string;
    startTime: number;
    endTime: number;
    roundTrip: boolean;
    user: UserID;
    riders: UserID[];
    pending: UserID[];
};

export { PostID, PostType, Coords };
