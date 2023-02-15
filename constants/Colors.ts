export type BaseColorIndicators = {
    p: string;
    m: string;
    1: string;
    2: string;
    3: string;
    4: string;
};

export type GrayColorIndicators = {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    b: string;
    w: string;
};

export type BaseColor<Type> = {
    [Property in keyof Type]: string;
};

interface ColorInterface {
    purple: BaseColor<BaseColorIndicators>;
    navy: BaseColor<BaseColorIndicators>;
    gold: BaseColor<BaseColorIndicators>;
    gray: BaseColor<GrayColorIndicators>;
    green: BaseColor<BaseColorIndicators>;
    red: BaseColor<BaseColorIndicators>;
}

export default {
    purple: {
        p: "#402E5A",
        m: "#725F7A",
        1: "#A577BA",
        2: "#C8A8D6",
        3: "#EDDBF4",
        4: "#FCF5FF",
    },
    navy: {
        p: "#1E406E",
        m: "#152D4D",
        1: "#4B668B",
        2: "#8FA0B7",
        3: "#BCC6D4",
        4: "#E9ECF1",
    },
    gold: {
        p: "#F39A11",
        m: "#AA6C0C",
        1: "#F4CC6F",
        2: "#FAD7A0",
        3: "#FBE1B8",
        4: "#FEF5E7",
    },
    gray: {
        b: "#141315",
        1: "#282629",
        2: "#77737C",
        3: "#C6C0CE",
        4: "#DDD9E2",
        5: "#EEECF0",
        w: "#F9F9FA",
    },
    green: {
        p: "#15803D",
        m: "#14532D",
        1: "#16A34A",
        2: "#4ADE80",
        3: "#BBF7D0",
        4: "#F0FDF4",
    },
    red: {
        p: "#B91C1C",
        m: "#7F1D1D",
        1: "#DC2626",
        2: "#F87171",
        3: "#FECACA",
        4: "#FEF2F2",
    },
} as ColorInterface;
