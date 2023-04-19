import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { assign, createMachine } from "xstate";
import { getConfirm, signIn } from "../auth";

const SignInMachine = {
    id: "Sign In Machine",
    initial: "Input Phone",
    states: {
        "Input Phone": {
            on: {
                "CHECK PHONE": {
                    target: "Get Confirm",
                    actions: "assignPhone",
                },
            },
        },
        "Get Confirm": {
            invoke: {
                src: "getConfirm",
                id: "getConfirm",
                onDone: {
                    target: "Input OTP",
                    actions: "assignConfirm",
                },
                onError: {
                    target: "Input Phone",
                    actions: "assignError",
                },
            },
        },
        "Input OTP": {
            on: {
                "CHECK OTP": {
                    target: "Submit Verification",
                    actions: "assignOTP",
                },
                "CLOSE": {
                    target: "Input Phone",
                },
            },
        },
        "Submit Verification": {
            invoke: {
                src: "signIn",
                id: "signIn",
                onDone: {
                    target: "Complete",
                },
                onError: {
                    target: "Input OTP",
                    actions: "assignError",
                },
            },
        },
        "Complete": {
            type: "final" as "final",
        },
    },
    schema: {
        context: {} as {
            phone: string;
            otp: string;
            confirm: FirebaseAuthTypes.ConfirmationResult | null;
            error: Error | null;
        },
        events: {} as
            | { type: "CHECK PHONE"; phone: string }
            | { type: "CHECK OTP"; otp: string }
            | { type: "CLOSE" },
    },
    context: { phone: "", otp: "", confirm: null, error: null },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const signInMachine = createMachine(SignInMachine, {
    services: {
        getConfirm: (context: { phone: string }) => getConfirm(context.phone),
        signIn: (context: { confirm: FirebaseAuthTypes.ConfirmationResult | null; otp: string }) =>
            signIn(context.confirm!, context.otp),
    },
    actions: {
        assignPhone: assign({
            phone: (context, event) => (event.type === "CHECK PHONE" ? event.phone : context.phone),
        }),
        assignConfirm: assign({
            confirm: (_, event: any) => event.data,
            error: null,
        }),
        assignError: assign({
            error: (_, event: any) => event.data.message,
        }),
        assignOTP: assign({
            otp: (_, event: any) => event.otp,
            error: null,
        }),
    },
});
