import { assign, createMachine } from "xstate";
import { logError } from "../errorHandling";
import { getAllPostUpdates, Unsubscribe } from "../posts";
import { PostType } from "../postValidation";

const PostListMachine = {
    id: "Post List Machine",
    initial: "Set Listeners",
    states: {
        "Set Listeners": {
            initial: "Listeners Set",
            invoke: [
                {
                    src: "setListeners",
                    id: "setListeners",
                },
            ],
            states: {
                "Listeners Set": {
                    on: {
                        "CHANGED LISTENER FIRED": {
                            target: "Listeners Set",
                            actions: "replacePost",
                            internal: false,
                        },
                        "ADDED LISTENER FIRED": {
                            target: "Listeners Set",
                            actions: "addPost",
                            internal: false,
                        },
                        "REMOVE LISTENER FIRED": {
                            target: "Listeners Set",
                            actions: "removePost",
                            internal: false,
                        },
                        "EXIT": {
                            target: "#Post List Machine.Complete",
                        },
                    },
                },
            },
        },
        "Complete": {
            type: "final" as "final",
        },
    },
    schema: {
        context: {} as {
            posts: PostType[];
            isSet: boolean;
        },
        events: {} as
            | { type: "CHANGED LISTENER FIRED"; post: PostType }
            | { type: "SET UNSUB"; unsub: Unsubscribe }
            | { type: "ADDED LISTENER FIRED"; post: PostType }
            | { type: "REMOVE LISTENER FIRED"; post: PostType }
            | { type: "EXIT" },
    },
    context: { posts: [], isSet: false },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const postListMachine = createMachine(PostListMachine, {
    services: {
        setListeners: (_) => (callback) => {
            try {
                return getAllPostUpdates({
                    onChildChanged: (post) => {
                        callback({ type: "CHANGED LISTENER FIRED", post });
                    },
                    onChildAdded: (post) => {
                        callback({ type: "ADDED LISTENER FIRED", post });
                    },
                    onChildRemoved: (post) => {
                        callback({ type: "REMOVE LISTENER FIRED", post });
                    },
                });
            } catch (error: any) {
                logError(error);
            }
        },
    },
    actions: {
        addPost: assign((context, event) => {
            return {
                posts: "post" in event ? [...context.posts, event.post] : context.posts,
            };
        }),
        removePost: assign((context, event) => {
            if (!("post" in event)) return {};
            const prev = context.posts;
            const post = event.post;

            let i = 0;
            if ((i = prev.findIndex((val) => val.postID === post.postID)) !== -1) {
                const newPosts = [...prev];
                newPosts.splice(i, 1);
                return { posts: newPosts };
            }
            return { posts: prev };
        }),
        replacePost: assign((context, event) => {
            if (!("post" in event)) return {};
            const prev = context.posts;
            const post = event.post;

            let i = 0;
            if ((i = prev.findIndex((val) => val.postID === post.postID)) !== -1) {
                const newPosts = [...prev];
                newPosts[i] = post;
                return { posts: newPosts };
            }
            return { posts: prev };
        }),
    },
});
