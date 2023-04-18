import { createMachine, assign } from "xstate";
import { PostType } from "../postValidation";
//import { MessageType } from "../auth";
import { fetchSomeCompleted } from "../posts";
import { logError } from "../errorHandling";

const MutlipleCompletedMachine = {
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

export const multipleCompletedMachine = createMachine(MutlipleCompletedMachine, {
    services: {
        loadPosts: async (context: MultiplePostsContext) => {
            //const res = await fetchSomeCompleted(context.postIDs);
            try {
                let posts = await fetchSomeCompleted(context.postIDs);
                return posts;
            } catch (error: any) {
                logError(error);
            }
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
