import { useState } from "react";

import { Button } from "./Themed";

export default function MatchButton() {
    // state variables for onClick event, change status of match and appearance of button
    const [status, setStatus] = useState("default");

    return (
        // TODO: Update status in database
        <Button
            title={status === "default" ? "Match!" : "Cancel Match"}
            onPress={() => setStatus(status === "default" ? "requested" : "default")}
            color="purple"
            light
        />
    );
}
