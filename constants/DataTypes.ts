export type UserID = string;

export type PostID = string;

export type Coords = {
    lat: number;
    lng: number;
};

export type NewPostType = {
    pickup: Coords | string;
    pickupCoords: number[] | undefined;
    dropoff: Coords | string;
    dropoffCoords: number[] | undefined;
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
    pickupCoords: number[];
    dropoff: Coords | string;
    dropoffCoords: number[];
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
