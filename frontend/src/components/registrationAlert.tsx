import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Fade from "@mui/material/Fade";
import { useState } from "react";

const RegistrationAlert = (message: string) => {

    const [alertVisibility, setAlertVisibility] = useState(true);

    return (
        <Fade
            in={true} //Write the needed condition here to make it appear
            timeout={{ enter: 1000, exit: 1000 }} //Edit these two values to change the duration of transition when the element is getting appeared and disappeard
            addEndListener={() => {
                setTimeout(() => {
                    setAlertVisibility(false)
                }, 2000);
            }}
        >
            <Alert severity="success" variant="standard" className="alert">
                {message}
            </Alert>
        </Fade>
    )
}

export default RegistrationAlert;