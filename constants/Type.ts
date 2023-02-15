export interface TypeInfo {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    letterSpacing?: number;
}

export type TypeFamily = {
    l?: TypeInfo;
    m?: TypeInfo;
    s?: TypeInfo;
};

export interface TypeShape {
    title: TypeFamily;
    lineTitle: TypeFamily;
    display: TypeFamily;
    header: TypeFamily;
    body: TypeFamily;
    label: TypeFamily;
}

export default {
    display: {
        l: {
            fontFamily: "inter-extrabold",
            fontSize: 60,
            lineHeight: 82,
        },
        m: {
            fontFamily: "inter-bold",
            fontSize: 48,
            lineHeight: 58,
        },
        s: {
            fontFamily: "inter-bold",
            fontSize: 40,
            lineHeight: 48,
        },
    },
    header: {
        l: {
            fontFamily: "inter-bold",
            fontSize: 28,
            lineHeight: 36,
        },
        m: {
            fontFamily: "inter-semibold",
            fontSize: 24,
            lineHeight: 32,
        },
        s: {
            fontFamily: "inter-semibold",
            fontSize: 20,
            lineHeight: 24,
        },
    },
    body: {
        m: {
            fontFamily: "inter-regular",
            fontSize: 16,
            lineHeight: 24,
        },
        s: {
            fontFamily: "inter-regular",
            fontSize: 13,
            lineHeight: 20,
        },
    },
    label: {
        l: {
            fontFamily: "inter-medium",
            fontSize: 16,
            lineHeight: 20,
            letterSpacing: 0.1,
        },
        m: {
            fontFamily: "inter-medium",
            fontSize: 13,
            lineHeight: 15,
            letterSpacing: 0.5,
        },
        s: {
            fontFamily: "inter-medium",
            fontSize: 10,
            lineHeight: 14,
            letterSpacing: 0.5,
        },
    },
    lineTitle: {
        l: {
            fontFamily: "inter-extrabold",
            fontSize: 16,
            lineHeight: 20,
            letterSpacing: 1.5,
        },
    },
    title: {
        l: {
            fontFamily: "inter-medium",
            fontSize: 34,
            lineHeight: 40,
        },
    },
} as TypeShape;
