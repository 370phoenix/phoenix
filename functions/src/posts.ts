import * as admin from "firebase-admin";

import { PostType, UserInfo } from "./types";
import { cleanUndefined } from "./utils";

export async function removePosts() {
    try {
        // Get all posts
        const db = admin.database();
        const currentDate = Date.now();
        const snapshot = await db.ref("posts").get();
        console.log(snapshot.exists());

        if (snapshot.exists()) {
            const posts: any[] = Object.values(snapshot.val());

            // Compare each post's end time to the current time
            // Move appropriate posts to completed
            for (const post of posts) {
                console.log(post.endTime, currentDate);
                if (post.endTime < currentDate) {
                    const userInfo = await getUserOnce(post.user);
                    await moveToCompleted(post, userInfo);
                }
            }
        }
        return true;
    } catch (e: any) {
        console.error(`Error in DELETE POSTS: ${e.message}`);
        return false;
    }
}

async function moveToCompleted(post: PostType, userInfo: UserInfo) {
    try {
        const db = admin.database();
        const { postID } = post;

        // Remove post from posts
        const postRef = db.ref("posts/" + postID);
        await postRef.remove();

        // Update Users
        const userRes = await updateUsers(post, userInfo);
        if (typeof userRes === "string") throw Error(userRes);

        // Add the post to completed
        const completedRef = db.ref("completed/" + postID);
        await completedRef.set(post);

        return true;
    } catch (e: any) {
        return e.message;
    }
}

async function updateUsers(post: PostType, userInfo: UserInfo) {
    try {
        const { postID } = post;
        const { completed, ridesCompleted } = userInfo;

        // Update User Info
        let newPosts = userInfo.posts ?? [];
        if (newPosts.length == 1) newPosts = [];
        else {
            const i = newPosts.indexOf(postID);
            if (i !== -1) newPosts.splice(i, 1);
        }
        userInfo.posts = newPosts;

        // Collect all info
        const allInfo: UserInfo[] = [userInfo];
        for (const rider of post.riders ?? []) {
            const riderInfo = await getUserOnce(rider);
            allInfo.push(riderInfo);
        }

        // Update all users
        for (const info of allInfo) {
            info.completed = completed ? [...completed, postID] : [postID];
            info.ridesCompleted = ridesCompleted ? ridesCompleted + 1 : 1;
            const res = await writeUser(info.userID, userInfo);
            if (typeof res === "string") throw Error(res);
        }

        return true;
    } catch (e: any) {
        return e.message;
    }
}

async function writeUser(userID: string, userInfo: UserInfo) {
    try {
        if (!userID || !userInfo) throw new Error("No User ID or Info.");

        const db = admin.database();
        const userRef = db.ref("users/" + userID);
        await userRef.set(cleanUndefined(userInfo));
        return true;
    } catch (e: any) {
        return e.message;
    }
}

export async function getUserOnce(userID: string | null): Promise<UserInfo> {
    try {
        const db = admin.database();
        if (!userID) throw Error("No user ID.");
        const userRef = db.ref("users/" + userID);
        const snapshot = await userRef.once("value");
        console.log(snapshot.exists());
        if (snapshot.exists()) return { userID: userID, ...snapshot.val() };
        throw Error("No info stored");
    } catch (e: any) {
        return e.message;
    }
}
