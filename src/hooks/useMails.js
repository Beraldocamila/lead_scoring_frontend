import { useContext } from "react";
import { MailContext } from "../contexts/MailContext";

const useMails = () => {
    const contextMail = useContext(MailContext);

    if (!contextMail) {
        throw new Error("useMails debe usarse dentro de un MailProvider");
    }

    return contextMail;
};

export default useMails;