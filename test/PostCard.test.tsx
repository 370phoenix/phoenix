//use a capital letter for import "import Letter"...
//coverage report- what has a test for it in the code

// mock React
// if whole app doesnt work, then go to component testing
//there is already an app

//close all microsoft docs

//new goal:
//post and type: post object
//copy notes then run git stash

//pass props in React - fundamental*
//pressable- ternary operator (if statement)

//Basic Info - prop here is "post" - any time you want to reference post, its needs to be {} (or reference any JS)
//jsx - any time want to reference js need {}

//need to pass a post into postcard of
//need to create JS opbject with post info then pass that post object into postcard

//TRY: to figure out how to get the import / formamting to function, look at TS stuff, get this one test to work
//look at how react works*********
//

//Next Steps: think of what would be good test cases for us to have
//do 1 or 2 before
//make a PR with basic setup that I have
// get rid of test docs folder- "lock.json"
// need to make a branch - make a pull request
// go back to a clean version of main with nothing on it
// make a new branch
//add basic setup test that runs and passes
// make a PR with it on github
// will will merge it in

//children?.length

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
