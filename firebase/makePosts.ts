import { getDatabase, ref, set } from "firebase/database";

import { PostType } from "../constants/DataTypes";

const examplePost : PostType = {
    pickup: "Publix",
    dropoff: "home",
    postID: "123456",
    numFriends: 1,
    availableSpots: 3,
    notes: "riding with dog",
    dateTime: new Date().getTime(),
    roundTrip: false,
    isMatched: false,
    isRequested: false,
    // TODO: get poster's UserID and add to list
    riders: [],
};

export default function writeUserData(post: PostType) {
    const db = getDatabase();
    set(ref(db, "posts/" + post.postID), {
        post,
    })
    .then(() => {
      //data successfullly saved
    })
    .catch((error) => {
        //write failed
    });
}

export { examplePost };
