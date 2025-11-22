import { createContext, useState } from "react";
import clientService from "../services/clientService";

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [clientError, setClientError] = useState(null);

    // Estado para cliente seleccionado (detalle)
    const [selectedClient, setSelectedClient] = useState(null);
    const [loadingSelectedClient, setLoadingSelectedClient] = useState(false);
    const [selectedClientError, setSelectedClientError] = useState(null);

    // Traer todos los clientes
    const getClients = async () => {
        setLoadingClients(true);
        try {
            const response = await clientService.getClients();
            setClients(response.data);
            setClientError(null);
        } catch (error) {
            setClientError(error);
        } finally {
            setLoadingClients(false);
        }
    };

    // Traer un cliente por DNI con predicción
    const getClientByDniContext = async (dni) => {
        setLoadingSelectedClient(true);
        try {
            const response = await clientService.getClientByDniService(dni);
            setSelectedClient(response.data);
            setSelectedClientError(null);
        } catch (error) {
            console.error("Error al obtener cliente:", error);
            setSelectedClientError(error);
            setSelectedClient(null);
        } finally {
            setLoadingSelectedClient(false);
        }
    };

    return (
        <ClientContext.Provider
            value={{
                clients,
                loadingClients,
                clientError,
                selectedClient,
                loadingSelectedClient,
                selectedClientError,
                getClients,
                getClientByDniContext
            }}
        >
            {children}
        </ClientContext.Provider>
    );
};

export default ClientContext;
