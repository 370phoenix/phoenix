import { useMachine } from "@xstate/react";

import MatchCard from "./MatchCard";
import { postInfoMachine } from "../../utils/machines/postInfoMachine";

type Props = {
    postID: string;
    userID: string;
};
export default function MatchCardWrapper({ postID, userID }: Props) {
    const [state, send] = useMachine(postInfoMachine);
    if (state.matches("Start")) send("LOAD", { id: postID });
    const { post } = state.context;

    if (!post) return <></>;
    return <MatchCard post={post} userID={userID} />;
}
