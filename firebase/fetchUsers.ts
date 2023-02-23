import { getUserOnce, MessageType, UserInfo } from "./auth";

const riders = ["3am4yYAEZVgIfWcgMcM5FJV8gCD3", "4juT5MULjiWbwBrTgctpo18XzQB2", "pVGSX6ls8xNXKD17CQc143zHK6G2"];
const matches: UserInfo[] = [];

export default async function fetchUsers() {
    await riders.forEach(async (uid) => {
        const res = await getUserOnce(uid);
        // if (res.type === MessageType.error) setMessage(res.message);
        if (res.type !== MessageType.success)
            throw Error(`Error fetching user data: ${res.message}`);
        const userInfo = res.data;

        if (!userInfo) throw new Error("Could not find user info.");
        matches.push(userInfo);
    });
    console.log(matches);
    // setMatches(matches);
};

// fetchUsers();
// console.log(matches);