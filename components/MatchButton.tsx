import { useState } from "react";

import { Button } from "./Themed";

export default function MatchButton({matched, onChangeMatched}: {matched: boolean, onChangeMatched: any}) {
    // state variables for onClick event, change status of match and appearance of button

    return (
        // TODO: Update status in database
        <Button
            title={matched ? "Cancel Match" : "Match!"}
            onPress={onChangeMatched}
            color="purple"
        />
    );
}
