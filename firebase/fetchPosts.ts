import { getDatabase, ref, child, get } from "firebase/database";

const dbRef = ref(getDatabase());

const fetchPosts = async () : Promise<any>=> {
    try {

        const response = await get(child(dbRef, "posts"));
        const data = response.val();
        return data;
    }
    catch(e: any) {
        return e.message;
    }
};

export { fetchPosts };
