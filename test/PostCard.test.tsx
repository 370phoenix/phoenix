//External Exports
import React from "react";
import Renderer from "react-test-renderer";

//Internal Exports
import PostCard from "../components/PostCard";
import { deletePost } from "../firebase/posts";
import { useNavigation } from "@react-navigation/native";

jest.mock("@react-navigation/native", () => {
    return {
        useNavigation: jest.fn().mockImplementation(() => ({
            navigate: jest.fn(),
        })),
    };
});

jest.mock("../firebase/posts", () => {
    return {
        deletePost: jest.fn().mockImplementation(() => {
            return new Promise(() => ({ type: 2 }));
        }),
    };
});

describe("PostCard ", () => {
    it("has 1 child", () => {
        const postCard = Renderer.create(
            <PostCard
                post={{
                    pickup: "Math and Science Center",
                    dropoff: "State Farm Arena",
                    postID: "101",
                    totalSpots: 6,
                    notes: "Come to the Game!",
                    startTime: 10,
                    endTime: 11,
                    roundTrip: false,
                    user: "Sam",
                    riders: ["Will", "Jordan", "Alex"],
                    pending: [],
                }}
            />
        ).toJSON();

        // console.log(postCard);

        expect(postCard).not.toBeNull(); //go back and find the null test case
    });
});
