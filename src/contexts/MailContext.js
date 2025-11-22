import { createContext, useState, useEffect } from "react";
import mailService from "../services/mailService";

export const MailContext = createContext();

export const MailProvider = ({ children }) => {
    const [mails, setMails] = useState([]);
    const [loadingMails, setLoadingMails] = useState(true);
    const [mailError, setMailError] = useState(null);

    useEffect(() => {
        const fetchMails = async () => {
            try {
                const res = await mailService.getMails();
                setMails(res.data);
            } catch (error) {
                console.error("Error al traer los correos:", error);
                setMailError("No se pudieron cargar los correos.");
            } finally {
                setLoadingMails(false);
            }
        };

        fetchMails();
    }, []);

    return (
        <MailContext.Provider
            value={{
                mails,
                setMails,
                loadingMails,
                mailError
            }}
        >
            {children}
        </MailContext.Provider>
    );
};

export default MailContext;
