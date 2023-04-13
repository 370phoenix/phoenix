export type UserID = string;

export type PostID = string;

export type Coords = {
    lat: number;
    lng: number;
};

export type NewPostType = {
    pickup: Coords | string;
    dropoff: Coords | string;
    totalSpots: number;
    notes: string;
    startTime: number;
    endTime: number;
    roundTrip: boolean;
    user: UserID;
    riders: UserID[] | undefined;
    pending: UserID[] | undefined;
};

export type PostType = {
    pickup: Coords | string;
    dropoff: Coords | string;
    postID: PostID;
    totalSpots: number;
    notes: string;
    startTime: number;
    endTime: number;
    roundTrip: boolean;
    user: UserID;
    riders: UserID[] | undefined;
    pending: UserID[] | undefined;
};

export type FeedbackEntryType = {
    message: string;
    postID: string;
    userID: string;
    timestamp: number;
};
