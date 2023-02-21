import { StyleSheet, Pressable, Platform } from "react-native";

import { View, Text, Spacer } from "./Themed";
import Colors from "../constants/Colors";
import { PostType } from "../constants/DataTypes";
import { convertDate, convertLocation, convertTime } from "../firebase/ConvertPostTypes";
import { useNavigation } from "@react-navigation/native";
import { Right } from "../assets/icons/Arrow";
import { Full, Outline } from "../assets/icons/User";
import RoundTrip from "../assets/icons/RoundTrip";

export default function MatchCard({ post }: { post: PostType }) {
    const navigation = useNavigation();
    const pickup = convertLocation(post.pickup);
    const dropoff = convertLocation(post.dropoff);
    const fDate = convertDate(post.startTime);
    const fStartTime = convertTime(post.startTime);
    const fEndTime = convertTime(post.endTime);

return (
    <Pressable
        onPress={() => navigation.navigate("PostDetails", { post: post })}
        style={({ pressed }) => [
            styles.cardContainer,
            {
                backgroundColor: pressed ? Colors.gray[4] : Colors.gray.w,
            },
        ]}>
        <View style={styles.body}>
            <Text textStyle="header" styleSize="s" style={styles.text}>
                {pickup}
            </Text>
            <View style={styles.headerContainer}>
                {post.roundTrip ? (
                    <RoundTrip color={Colors.purple.p} height={20} />
                ) : (
                    <Right color={Colors.purple.p} height={20} />
                )}
                <Text textStyle="header" styleSize="s" style={styles.text}>
                    {dropoff}
                </Text>
            </View>
            <Spacer direction="column" size={16} />

            <Text textStyle="label" style={styles.text}>
                {fDate}
            </Text>
            <Text textStyle="body" styleSize="s" style={styles.text}>
                {fStartTime} - {fEndTime}
            </Text>
        </View>
        <Spacer direction="row" size={16} />
        <RiderBadge post={post} />
    </Pressable>
);
}

function RiderBadge({ post }: { post: PostType }) {
const total = post.numFriends + post.availableSpots + 1;
const rows = new Array<Array<number>>(total > 4 ? 2 : 1);
rows[0] = new Array(total > 4 ? 4 : total);
rows[0].fill(0);

if (total - post.availableSpots > 4) rows[0].fill(1);
else rows[0].fill(1, 0, post.availableSpots);

if (rows.length === 2) {
    const temp = rows[0];
    rows[0] = new Array(total - 4);
    rows[0].fill(0);
    if (total - post.availableSpots - 4 > 0)
        rows[0].fill(1, 0, total - post.availableSpots - 4);
    rows[1] = temp;
}

return (
    <>
        {rows.map((row, index) => (
            <View style={styles.riderBadge} key={`row-${index}`}>
                {row.map((rider, index) => (
                    <View style={styles.riderIndicator}>
                        {rider === 1 ? (
                            <Full key={Math.random()} color={Colors.purple.p} height={20} />
                        ) : (
                            <Outline key={Math.random()} color={Colors.purple.p} height={20} />
                        )}
                    </View>
                ))}
            </View>
        ))}
    </>
);
}

const styles = StyleSheet.create({
cardContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Platform.OS === "ios" ? Colors.purple.p : undefined,
    shadowOpacity: 0.5,
    elevation: 10,
    shadowOffset: {
        width: 2,
        height: 4,
    },
    shadowRadius: 4,
},
body: { flex: 1 },
riderIndicator: { justifyContent: "center", alignItems: "center", height: 25 },
text: {
    color: Colors.purple.p,
},
riderBadge: { height: 100, flexDirection: "column", justifyContent: "center" },
headerContainer: {
    marginLeft: -4,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
},
});