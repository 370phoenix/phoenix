import { useMachine } from "@xstate/react";
import { useRef } from "react";
import { View, StyleSheet, Pressable, FlatList, ViewProps } from "react-native";
import { Down, Right } from "../../assets/icons/Chevron";
import Colors from "../../constants/Colors";
import { dropdownMachine } from "../../utils/machines/dropdownMachine";

import { Text } from "./Themed";

type DropdownOnly = {
    light?: boolean;
    label: string;
    onChange: (newState: string) => void;
    options: string[];
    firstSelected?: number;
};

type DropdownProps = ViewProps & DropdownOnly;

export default function Dropdown({
    light = false,
    label,
    onChange,
    options,
    firstSelected = 0,
    ...props
}: DropdownProps) {
    const [state, send] = useMachine(dropdownMachine);
    const { selected, top } = state.context;
    const isOpen = state.matches("Opened");
    const openRef = useRef<View | null>(null);

    if (state.matches("Start")) send({ type: "INIT", onChange, options, firstSelected });

    const onPress = () => {
        if (isOpen) send("CLOSE");
        else if (openRef && openRef.current) {
            openRef.current.measure((_fx, fy, _w, h, _px, _py) => {
                send({ type: "OPEN", top: h + fy - 15 });
            });
        }
    };

    return (
        <View style={{ zIndex: 100 }}>
            <View {...props} style={[styles.container, props.style]} ref={openRef}>
                <Pressable
                    onPress={onPress}
                    style={({ pressed }) => [
                        light ? styles.selectedLight : styles.selected,
                        {
                            opacity: pressed ? 0.8 : 1,
                        },
                    ]}>
                    <Text
                        textStyle="body"
                        styleSize="m"
                        style={light ? styles.selectedTextLight : styles.selectedText}>
                        {options[selected]}
                    </Text>
                    {isOpen ? (
                        <Down height={20} color={light ? Colors.gray.w : Colors.gray[1]} />
                    ) : (
                        <Right height={20} color={light ? Colors.gray.w : Colors.gray[1]} />
                    )}
                </Pressable>
                <Text
                    textStyle="label"
                    styleSize="s"
                    allowFontScaling={false}
                    style={light ? styles.labelLight : styles.label}>
                    {label}
                </Text>
            </View>
            {isOpen && (
                <FlatList
                    style={[styles.dropdown, { top }, props.style]}
                    data={options}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <ListItem
                            item={item}
                            index={index}
                            onPress={(newIndex) =>
                                send({ type: "SELECTED CHANGED", selected: newIndex })
                            }
                        />
                    )}
                />
            )}
        </View>
    );
}

type ListItemProps = {
    item: string;
    index: number;
    onPress: (newIndex: number) => object;
};
function ListItem({ item, onPress, index }: ListItemProps) {
    return (
        <Pressable
            onPress={() => onPress(index)}
            style={({ pressed }) => [
                styles.itemContainer,
                { backgroundColor: pressed ? Colors.gray[3] : Colors.gray.w },
            ]}>
            <Text textStyle="body" styleSize="m" style={styles.item}>
                {item}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: "flex-start" },
    selected: {
        flexDirection: "row",
        borderBottomWidth: 2,
        borderBottomColor: Colors.gray.b,
        paddingVertical: 8,
        alignItems: "center",
    },
    selectedLight: {
        flexDirection: "row",
        borderBottomWidth: 2,
        borderBottomColor: Colors.gray.w,
        paddingVertical: 8,
        alignItems: "center",
    },
    label: {
        paddingTop: 4,
    },
    labelLight: {
        paddingTop: 4,
        color: Colors.gray.w,
    },
    dropdown: {
        backgroundColor: Colors.gray.w,
        position: "absolute",
        width: "100%",
        maxHeight: 200,
        borderRadius: 4,
        zIndex: 100,
        paddingVertical: 4,
    },
    selectedText: { flex: 1 },
    selectedTextLight: { flex: 1, color: Colors.gray.w },
    itemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray.b,
        backgroundColor: Colors.gray.w,
    },
    item: {
        width: "100%",
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: Colors.gray.b,
    },
});
