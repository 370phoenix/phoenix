export type UserID = string;

export type PostID = string;

export type NewPostType = {
    pickup: string;
    pickupCoords: number[] | undefined;
    dropoff: string;
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
    pickup: string;
    pickupCoords: number[] | undefined;
    dropoff: string;
    dropoffCoords: number[] | undefined;
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
