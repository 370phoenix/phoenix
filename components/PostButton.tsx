import { useState, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootTabParamList } from "../types";
import { Button, Text, View } from "./Themed";


type Props = NativeStackScreenProps<RootTabParamList, "ViewPosts">;


export default function PostButton({ navigation }: Props) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Post"
          onPress={() => navigation.navigate('ViewPosts')}
          color="purple"
        />
      </View>
    );
  }
/*
export default function PostButton({ navigation }: Props) {
    // state variables for onClick event, change status of match and appearance of button
    const [status, setStatus] = useState("default");
    const [color, setColor] = useState("black");

    useEffect(() => {
        setColor(status === "default" ? "black" : "red");
    }, [status]);

    return (
        // TODO: Update status in database
        <View>
        <Button
            title={"Post"}
            onPress={() => navigation.navigate("ViewPosts")}
            color="purple"
            light
        />
        </View>
    );
}
*/
const styles = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        textAlign: "center",
    },
    matchButton: {
        padding: 16,
        paddingRight: 64,
        paddingLeft: 64,
        margin: 8,
        borderRadius: 8,
        backgroundColor: "white",
        width: "95%",
    },
});
