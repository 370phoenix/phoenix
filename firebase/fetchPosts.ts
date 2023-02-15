import { getDatabase, ref, child, get } from "firebase/database";

const dbRef = ref(getDatabase());

const fetchPosts = async () => {
    let response = await get(child(dbRef, "posts"));
    let data = response.val();
    return data;
};

export { fetchPosts };
