import crashlytics from "@react-native-firebase/crashlytics";
import { State } from "xstate";
import { z } from "zod";

export function logError(error: Error) {
    const isZodError = error instanceof z.ZodError;

    if (isZodError) {
        const zodError = error as z.ZodError;
        zodError.issues.forEach((issue) => {
            if (__DEV__) console.log("ZodError", issue);
            else crashlytics().log(`ZodError (path: ${issue.path.join(".")}): ${issue.message}`);
        });
    } else {
        console.error(error);
        if (!__DEV__) crashlytics().recordError(error);
    }
}

export function safeRun(fn: () => void) {
    try {
        fn();
    } catch (error: any) {
        logError(error);
    }
}

export function logAuthState(state: State<any, any>) {
    console.log(state.event.type);
    console.log("  ", state.value);
    console.log("  numPosts: ", state.context.posts ? state.context.posts.length : 0);
    console.log("  user: ", state.context.user ? state.context.user.uid : "null");
    console.log("  userInfo: ", state.context.userInfo ? state.context.userInfo : "null");
    console.log("  error: ", state.context.error ? state.context.error : "null");
    console.log("  ranOnce: ", state.context.ranOnce ? state.context.ranOnce : "null");
}
