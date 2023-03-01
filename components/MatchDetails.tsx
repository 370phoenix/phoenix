import { useState, useEffect } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";

import RequestCard from "./RequestCard";
import MatchCard from "./MatchCard";
import { View, Text } from "./Themed";
import Colors from "../constants/Colors";
import { PostID, UserID } from "../constants/DataTypes";
import { getUserOnce, getUserUpdates, MessageType, UserInfo } from "../firebase/auth";
import { User } from "firebase/auth/react-native";

type Props = {
    post: PostID
};


export default function MatchDetails({ post }: Props) {