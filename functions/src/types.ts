export type PostID = string;
export type UserID = string;
export type PostType = {
    pickup: string;
    dropoff: string;
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

export type UserInfo = {
    username: string;
    phone: string;
    major: string;
    gradYear: number;
    pronouns: string;
    chillIndex: number | undefined;
    ridesCompleted: number;
    completed: PostID[] | undefined;
    posts: string[] | undefined;
    pending: string[] | undefined;
    matches: string[] | undefined;
    requests: [string, string][];
};

export type Clean<T> = {
    [K in keyof T]?: any;
};
