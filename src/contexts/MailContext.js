import { createContext, useState } from "react";
import mailService from "../services/mailService";

const MailContext = createContext();

export const MailProvider = ({ children }) => {
    // Estado para la lista completa de correos
    const [mails, setMails] = useState([]);
    const [loadingMails, setLoadingMails] = useState(true);
    const [mailError, setMailError] = useState(null);

    // Estado para el historial de correos de una persona seleccionada
    const [personMails, setPersonMails] = useState([]); // Historial de mails de la persona
    const [loadingPersonMails, setLoadingPersonMails] = useState(false);
    const [personMailsError, setPersonMailsError] = useState(null);

    // Trae todos los mails
    const getMailsContext = async () => {
        setLoadingMails(true);
        try {
            const res = await mailService.getMails();
            setMails(res.data);
            setMailError(null);
        } catch (error) {
            console.error("Error al traer los correos:", error);
            setMailError("No se pudieron cargar los correos.");
        } finally {
            setLoadingMails(false);
        }
    };

    // Trae los mails de una persona
    const getMailsByPersonaContext = async (idPersona) => {
        setLoadingPersonMails(true);
        try {
            const res = await mailService.getHistorialByPersona(idPersona);
            
            setPersonMails(res.data); 
            setPersonMailsError(null);
        } catch (error) {
            console.error("Error al traer historial de la persona:", error);
            setPersonMailsError("No se pudo cargar el historial de correos del cliente.");
        } finally {
            setLoadingPersonMails(false);
        }
    };

    return (
        <MailContext.Provider
            value={{
                mails,
                loadingMails,
                mailError,
                personMails,
                loadingPersonMails,
                personMailsError,
                getMailsContext,
                getMailsByPersonaContext,
            }}
        >
            {children}
        </MailContext.Provider>
    );
};

export default MailContext;