import Filter from "bad-words";
import { z } from "zod";
import geocodeAddress from "./geocode";

export enum MessageType {
    error,
    success,
}

export type SuccessMessage = {
    message?: string;
    type: MessageType.success;
};

export type ErrorMessage = {
    message: string;
    type: MessageType.error;
};

export const CoordsSchema = z
    .object({
        lat: z.number(),
        long: z.number(),
    })
    .strict();

export type Coords = z.infer<typeof CoordsSchema>;

export const PostSchemaBase = z
    .object({
        user: z.string(),
        pickup: z
            .string()
            .min(1)
            .trim()
            .refine((val) => !isProfane(val), { message: "Pickup location cannot be profane." }),
        pickupCoords: CoordsSchema,
        dropoff: z
            .string()
            .min(1)
            .trim()
            .refine((val) => !isProfane(val), { message: "Dropoff location cannot be profane." }),
        dropoffCoords: CoordsSchema,
        totalSpots: z.number(),
        notes: z
            .string()
            .trim()
            .refine((val) => !isProfane(val))
            .optional(),
        roundTrip: z.coerce.boolean(),
        riders: z.array(z.string()).optional(),
        pending: z.array(z.string()).optional(),
    })
    .strict();

export const PostSchemaFresh = PostSchemaBase.extend({
    startTime: z.date(),
    endTime: z.date(),
});

export const FBToPostSchema = PostSchemaBase.extend({
    startTime: z.coerce.number().transform((val) => new Date(val)),
    endTime: z.coerce.number().transform((val) => new Date(val)),
    postID: z.string(),
});

export const PostToFBSchema = PostSchemaBase.extend({
    startTime: z.date().transform((val) => val.getTime()),
    endTime: z.date().transform((val) => val.getTime()),
    postID: z.string(),
});

export const PostSchema = PostSchemaFresh.extend({
    postID: z.string(),
});

export const FirebasePostSchema = PostSchemaBase.extend({
    postID: z.string(),
    startTime: z.coerce.number(),
    endTime: z.coerce.number(),
});

export type PostType = z.infer<typeof PostSchema>;
export type FreshPostType = z.infer<typeof PostSchemaBase>;
export type FBPostType = z.infer<typeof FirebasePostSchema>;

export function isProfane(val: string): boolean {
    const filter = new Filter();
    return filter.isProfane(val);
}

interface ValidatePostParams {
    pickup: string;
    dropoff: string;
    startTime: Date;
    endTime: Date;
    notes?: string | undefined;
    totalSpots: number;
    user: string;
    roundTrip: boolean;
}
export default async function validateData({
    pickup,
    dropoff,
    startTime,
    endTime: rawEnd,
    notes,
    totalSpots,
    user,
    roundTrip,
}: ValidatePostParams): Promise<FreshPostType> {
    const pickupCoords = await geocodeAddress(pickup);

    const dropoffCoords = await geocodeAddress(dropoff);

    if (!pickupCoords) throw Error("Invalid pickup address.");
    if (!dropoffCoords) throw Error("Invalid dropoff address.");

    const endTime = new Date(rawEnd);
    endTime.setFullYear(startTime.getFullYear());
    endTime.setMonth(startTime.getMonth());
    endTime.setDate(startTime.getDate());

    if (startTime > endTime) throw Error("End time cannot occur before start time.");

    return PostSchemaFresh.parse({
        user,
        pickup,
        pickupCoords,
        dropoff,
        dropoffCoords,
        totalSpots,
        notes,
        startTime,
        endTime,
        roundTrip,
    });
}
