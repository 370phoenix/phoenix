import { assign, createMachine } from "xstate";

const DropdownMachine = {
    id: "Dropdown Machine",
    initial: "Start",
    states: {
        Start: {
            on: {
                INIT: {
                    target: "Closed",
                    actions: "init",
                },
            },
        },
        Closed: {
            on: {
                OPEN: {
                    target: "Opened",
                    actions: "assignTop",
                },
            },
        },
        Opened: {
            on: {
                "SELECTED CHANGED": {
                    target: "Closed",
                    actions: ["assignSelected", "runOnChange"],
                },
                "CLOSE": {
                    target: "Closed",
                },
            },
        },
    },
    schema: {
        context: {} as {
            selected: number;
            onChange: ((newVal: string) => void) | null;
            options: string[];
            top: number;
        },
        events: {} as
            | { type: "SELECTED CHANGED"; selected: number }
            | { type: "OPEN"; top: number }
            | { type: "CLOSE" }
            | {
                  type: "INIT";
                  onChange: (newVal: string) => void;
                  options: string[];
                  firstSelected: number;
              },
    },
    context: {
        selected: 0,
        onChange: null,
        options: [],
        top: 0,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
};

export const dropdownMachine = createMachine(DropdownMachine, {
    actions: {
        init: assign({
            onChange: (_, event) => (event.type === "INIT" ? event.onChange : () => {}),
            options: (_, event) => (event.type === "INIT" ? event.options : []),
            selected: (_, event) => (event.type === "INIT" ? event.firstSelected : 0),
        }),
        assignTop: assign({
            top: (context, event) => (event.type === "OPEN" ? event.top : context.top),
        }),
        assignSelected: assign({
            selected: (context, event) =>
                event.type === "SELECTED CHANGED" ? event.selected : context.selected,
        }),
        runOnChange: (context, event) => {
            if (event.type === "SELECTED CHANGED") {
                if (!context.onChange) console.error("NO ON CHANGE FOR DROPDOWN");
                else if (event.selected >= context.options.length)
                    console.error("SELECTED INDEX OUT OF BOUNDS");
                else context.onChange(context.options[event.selected]);
            }
        },
    },
});
