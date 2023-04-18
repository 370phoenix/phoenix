import { createMachine, assign } from "xstate";
import { PostType } from "../../constants/DataTypes";
// import { MessageType } from "../auth";
import { fetchSomePosts } from "../posts";

const MutliplePostsMachine = {
    id: "multiplePosts",
    initial: "Start",
    states: {
        "Start": {
            on: {
                LOAD: {
                    target: "Loading Posts",
                    actions: "assignIDs",
                },
            },
        },
        "Loading Posts": {
            invoke: {
                src: "loadPosts",
                id: "loadPosts",
                onDone: {
                    target: "Posts Loaded",
                    actions: "assignPosts",
                },
                onError: {
                    target: "Error",
                    actions: "assignError",
                },
            },
        },
        "Posts Loaded": {
            on: {
                CLOSE: {
                    target: "Final",
                },
            },
        },
        "Error": {
            on: {
                CLOSE: {
                    target: "Final",
                },
            },
        },
        "Final": {
            type: "final" as "final",
        },
    },
    context: {
        postIDs: [],
        posts: [],
        error: null,
    },
    schema: {
        context: {} as MultiplePostsContext,
        events: {} as MultiplePostsEvents,
    },
};

type MultiplePostsContext = {
    postIDs: string[];
    posts: PostType[];
    error: string | null;
};

type MultiplePostsEvents = { type: "LOAD"; postIDs: string[] } | { type: "CLOSE" };

export const multiplePostsMachine = createMachine(MutliplePostsMachine, {
    services: {
        loadPosts: async (context: MultiplePostsContext) => {
            const res = await fetchSomePosts(context.postIDs);
            if (res.type === MessageType.error) throw Error(res.message);
            else return res.data;
        },
    },
    actions: {
        assignIDs: assign({
            postIDs: (_, event) => (event.type === "LOAD" ? event.postIDs : []),
        }),
        assignPosts: assign({
            posts: (_, event: any) => event.data,
        }),
        assginError: assign({
            error: (_, event: any) => event.data,
        }),
    },
});
