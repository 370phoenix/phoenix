import { z } from "zod";

import { isProfane } from "./postValidation";
import Pronouns from "../constants/Pronouns.json";

export const UserSchema = z
    .object({
        userID: z.string().trim(),
        username: z
            .string()
            .trim()
            .refine((val) => !isProfane(val), { message: "username cannot be profane." }),
        phone: z.string().trim(),
        major: z
            .string()
            .trim()
            .refine((val) => !isProfane(val), { message: "major cannot be profane." }),
        pronouns: z.string().refine((val) => Pronouns.includes(val), {
            message: "Pronouns not accepted. Please email us if we've made a mistake.",
        }),
        gradYear: z.coerce.number(),
        ridesCompleted: z.number().optional(),
        posts: z.object({}).catchall(z.literal(true).nullable()).optional(),
        matches: z.object({}).catchall(z.literal(true).nullable()).optional(),
        pending: z.object({}).catchall(z.literal(true).nullable()).optional(),
        completed: z.object({}).catchall(z.literal(true).nullable()).optional(),
    })
    .strict();

export type UserInfo = z.infer<typeof UserSchema>;

type ValidateProfileParams = {
    username: string;
    major: string;
    gradString: string;
    pronouns: string;
    phone?: string | null;
    userInfo?: UserInfo | null;
    userID?: string | null;
};
/**
 * Checks to see if user info is valid, and returns a clean version.
 *
 * @param param0 (ValidateProfileParams): inputs to validate
 * @returns (UserInfo): The cleaned user info
 *
 * @throws (Error): If validation fails
 */
export function validateProfile({
    username,
    major,
    pronouns,
    gradString,
    userID = null,
    phone = null,
    userInfo = null,
}: ValidateProfileParams): UserInfo {
    const noUserError = "Must supply either phone or previous user info.";
    if (!phone && !userInfo) throw new Error(noUserError);

    const gradYear = Number(gradString);
    if (userInfo)
        // Changing Info
        return UserSchema.parse(userInfo);
    else if (phone && userID) {
        // Inital Profile Setup
        return UserSchema.parse({
            userID,
            username,
            major,
            pronouns,
            gradYear,
            phone,
            ridesCompleted: 0,
        });
    } else throw noUserError;
}
