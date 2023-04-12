export type UserID = string;

export type Coords = {
    lat: number;
    long: number;
    }

export type PostID = string;

export type NewPostType = {
    pickup: string;
    pickupCoords: Coords | undefined;
    dropoff: string;
    dropoffCoords: Coords | undefined;
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
    pickup: string;
    pickupCoords: Coords | undefined;
    dropoff: string;
    dropoffCoords: Coords | undefined;
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
