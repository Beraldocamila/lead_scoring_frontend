import { useContext } from "react";
import ClientContext from "../contexts/ClientContext";

const useClients = () => {
    const contextClient = useContext(ClientContext);

    if (!contextClient) {
        throw new Error("useClients debe usarse dentro de un ClientProvider");
    }

    return contextClient;
};

export default useClients;