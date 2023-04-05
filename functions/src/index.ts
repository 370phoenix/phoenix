import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { PostType } from "../../constants/DataTypes";
import { fetchPost } from "../../utils/posts" 
import { MessageType } from "../../utils/auth";
import { getMultiplePushTokens } from "../../utils/notifications";

admin.initializeApp();

export const ridersChangedNotification = functions.database.ref("/posts/{postID}/riders")
.onUpdate((change, context) => {
    const {postID} = context.params;

    const before = change.before.val();
    const after = change.after.val();
    
    // if(after.length > before.length){
    //     sendMatchNotifications(postID);
    // }
})

export const clearCompleted = functions.pubsub
    .schedule("0 0 * * *")
    .timeZone("America/New_York")
    .onRun(async (context) => {
        await deletePosts();
        console.log("COMPLETED");
    });

async function deletePosts() {
    try {
        const db = admin.database();
        const currentDate = Date.now();

        const snapshot = await db.ref("posts").get();

        if (snapshot.exists()) {
            const posts: any[] = Object.values(snapshot.val());

            for (const post of posts) {
                console.log(post.endTime, currentDate);
                if (post.endTime < currentDate) {
                    const userInfo = await getUserOnce(post.user);
                    await deletePost(post.postID, post.user, userInfo);
                }
            }
        }
    } catch (e: any) {
        console.log(`Error in DELETE POSTS: ${e.message}`);
    }
}

async function deletePost(postID: string, userID: string, userInfo: UserInfo) {
    try {
        console.log(userInfo);
        const db = admin.database();

        const postRef = db.ref("posts/" + postID);
        await postRef.remove();

        let newPosts = userInfo.posts ? userInfo.posts : [];
        if (newPosts.length == 1) newPosts = [];
        else {
            const i = newPosts.indexOf(postID);
            if (i !== -1) newPosts.splice(i, 1);
        }
        userInfo.posts = newPosts;

        const res = await writeUser(userID, userInfo);

        if (typeof res === "string") throw Error(res);

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
        if (snapshot.exists()) return snapshot.val();
        throw Error("No info stored");
    } catch (e: any) {
        return e.message;
    }
}

type UserInfo = {
    username: string;
    phone: string;
    major: string;
    gradYear: number;
    pronouns: string;
    chillIndex: number | undefined;
    ridesCompleted: number;
    posts: string[] | undefined;
    pending: string[] | undefined;
    matches: string[] | undefined;
    requests: [string, string][];
};

type Clean<T> = {
    [K in keyof T]?: any;
};

function cleanUndefined<T extends object>(obj: T): T {
    let clean: Clean<T> = {};
    for (const k in obj) {
        if (obj[k]) clean[k] = obj[k];
    }
    return clean as T;
}



//////////////////////////////////////////
//////////////////////////////////////////
/////////// NOTIFICATIONS ////////////////
//////////////////////////////////////////
//////////////////////////////////////////

/**
 * Send push notifications for accepted/rejected requests when listener detects update
 */
export async function sendCancelNotifications(postID: string) {
    try {
        const r1 = await fetchPost(postID);
        if(r1.type !== MessageType.success){
            throw Error("Error fetching post data");
        }
        const post = r1.data;
        // remaining riders matched with post should be notified of cancellation
        const riders = post.riders;
        if(!riders) return;
        
        // get tokens from user IDs
        const tokens = await getMultiplePushTokens(riders);
        // send notification to each user
        for(const token of tokens){
            makeCancelNotification(token);
        }

    } catch (e: any) {
        console.warn(`Error: ${e}`);
    }
    
}

async function makeCancelNotification(expoPushToken: string) {
    const message = {
      to: expoPushToken,
      title: 'Rider Canceled',
      body: 'A rider has canceled their match with your ride!',
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }