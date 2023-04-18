import crashlytics from "@react-native-firebase/crashlytics";
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
