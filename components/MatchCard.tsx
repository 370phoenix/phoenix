import { StyleSheet, Pressable, Platform } from "react-native";

import { View, Text, Spacer } from "./Themed";
import Colors from "../constants/Colors";
import { PostType, UserType } from "../constants/DataTypes";
import { convertDate, convertLocation, convertTime } from "../firebase/ConvertPostTypes";
import { useNavigation } from "@react-navigation/native";
import { Right } from "../assets/icons/Arrow";
import { Full, Outline } from "../assets/icons/User";
import RoundTrip from "../assets/icons/RoundTrip";
import MatchButton from "./MatchButton";
import { Button } from "./Themed";



export default function MatchCard({ user }: { user: UserType }) {
    const requester = "Cole Smith";
    const gender = "he/him/his";
    const gradyear = "2024";
    const major = "Chemistry/CS"

return (
    <Pressable
        //navigate to post onPress={() => }
        style={({ pressed }) => [
            styles.cardContainer,
            {
                backgroundColor: pressed ? Colors.gray[4] : Colors.purple[3],
            },
        ]}>
        <View style={styles.body}>
            <Text textStyle="header" styleSize="m" style={styles.text}>
                {requester}
                <Text textStyle="label" style={styles.subtext}>
                {gender}
                
                <Button
                    title="match"
                    color="green"
                    onPress={() => this.color="grey"}>
                </Button>

                
            </Text>
            </Text>
            
            
                
                <Text textStyle="body" styleSize="m" style={styles.text}>
                    {major} {gradyear}
                </Text>
            
            
            
            
        </View>
        <Spacer direction="row" size={16} />
        
    </Pressable>
);
}

function UserInfo({ user }: {user: UserType}){
    
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
subtext: {
    color: Colors.gray[2],
},
//riderBadge: { height: 100, flexDirection: "column", justifyContent: "center" },
headerContainer: {
    marginLeft: -4,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
},
});