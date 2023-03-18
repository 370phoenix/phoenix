import { assign, createMachine } from "xstate";
import { PostType } from "../../constants/DataTypes";
import { MessageType } from "../auth";
import { fetchSomePosts } from "../posts";

const ProfilePostMachine = {
    id: "Profile Post Machine",
    initial: "Updating Posts",
    states: {
        "Updating Posts": {
            initial: "Start",
            states: {
                "Start": {
                    on: {
                        LOAD: {
                            target: "Loading New Posts",
                            actions: assign((_, event: any) => ({
                                userPosts: event.userPosts ? event.userPosts : [],
                            })),
                        },
                    },
                },
                "Loading New Posts": {
                    invoke: {
                        src: "loadNewPosts",
                        id: "loadNewPosts",
                        onDone: [
                            {
                                target: "#Profile Post Machine.Loaded",
                                actions: [
                                    assign({ posts: (_, event: any) => event.data }),
                                    "removeExtras",
                                ],
                            },
                        ],
                        onError: [
                            {
                                target: "#Profile Post Machine.Loaded",
                                actions: assign({ error: (_, event: any) => event.data }),
                            },
                        ],
                    },
                },
            },
        },
        "Complete": {
            type: "final" as "final",
        },
        "Loaded": {
            on: {
                UPDATE: {
                    target: "Updating Posts.Loading New Posts",
                    actions: assign((_, event: any) => ({
                        userPosts: event.userPosts ? event.userPosts : [],
                    })),
                },
                EXIT: {
                    target: "Complete",
                },
            },
        },
    },
    schema: {
        context: {} as {
            userPosts: string[];
            posts: PostType[];
            error: string | null;
        },
        events: {} as
            | { type: "UPDATE"; userPosts: string[] | undefined }
            | { type: "EXIT" }
            | { type: "LOAD"; userPosts: string[] | undefined },
    },
    context: { userPosts: [], posts: [], error: null },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const profilePostMachine = createMachine(ProfilePostMachine, {
    services: {
        loadNewPosts: async (context) => {
            const { posts, userPosts } = context;
            console.log(userPosts);
            let toLoad: string[] = [];
            for (const id of userPosts) {
                let flag = false;
                for (const post of posts) {
                    if (post.postID === id) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) toLoad.push(id);
            }

            if (toLoad.length < 1) return posts;

            const res = await fetchSomePosts(toLoad);
            if (res.type === MessageType.error) throw Error(res.message);
            if (!res.data) return posts;

            let newPosts;
            if (posts) {
                newPosts = posts.concat(res.data);
            } else newPosts = res.data;
            newPosts.sort((a, b) => a.startTime - b.startTime);
            return newPosts;
        },
    },
    actions: {
        removeExtras: assign((context) => {
            const { posts, userPosts } = context;

            if (!posts || !userPosts || userPosts.length === 0) {
                return { posts: [] };
            } else if (userPosts) {
                for (const post of posts) {
                    if (!userPosts.includes(post.postID)) {
                        const i = posts.indexOf(post);
                        const newPosts = posts;
                        newPosts.splice(i, 1);
                        return { posts: newPosts };
                    }
                }
            }
            return { posts: posts };
        }),
    },
});
