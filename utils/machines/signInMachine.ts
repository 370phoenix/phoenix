import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { assign, createMachine, DoneInvokeEvent, ErrorExecutionEvent } from "xstate";
import { getConfirm, signIn } from "../auth";

const SignInMachine = {
    id: "Sign In Machine",
    initial: "Input Phone",
    states: {
        "Input Phone": {
            on: {
                "CHECK PHONE": {
                    target: "Get Confirm",
                    actions: assign({
                        phone: (_, event: { phone: string }) => event.phone,
                    }),
                },
            },
        },
        "Get Confirm": {
            invoke: {
                src: (context: { phone: string }) => getConfirm(context.phone),
                id: "getConfirm",
                onDone: {
                    target: "Input OTP",
                    actions: assign({
                        confirm: (
                            _,
                            event: DoneInvokeEvent<FirebaseAuthTypes.ConfirmationResult>
                        ) => event.data,
                        error: null,
                    }),
                },
                onError: {
                    target: "Input Phone",
                    actions: assign({
                        error: (_, event: ErrorExecutionEvent) => event.data.message,
                    }),
                },
            },
        },
        "Input OTP": {
            on: {
                "CHECK OTP": {
                    target: "Submit Verification",
                    actions: [
                        assign({
                            otp: (_, event: { otp: string }) => event.otp,
                            error: null,
                        }),
                    ],
                },
                "CLOSE": {
                    target: "Input Phone",
                },
            },
        },
        "Submit Verification": {
            invoke: {
                src: (context: {
                    confirm: FirebaseAuthTypes.ConfirmationResult | null;
                    otp: string;
                }) => signIn(context.confirm!, context.otp),
                id: "signIn",
                onDone: {
                    target: "Complete",
                },
                onError: {
                    target: "Input OTP",
                    actions: assign({
                        error: (_, event: ErrorExecutionEvent) => event.data.message,
                    }),
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
            error: string;
        },
        events: {} as
            | { type: "CHECK PHONE"; phone: string }
            | { type: "CHECK OTP"; otp: string }
            | { type: "CLOSE" },
    },
    context: { phone: "", otp: "", confirm: null, error: "" },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const signInMachine = createMachine(SignInMachine, {});
