import api from "./api";

// GET: todos los correos
const getMails = () => {
    return api.get("/correos/historial");
};

// GET: historial por persona
const getHistorialByPersona = (idPersona) => {
    return api.get(`/correos/historial/persona/${idPersona}`);
};

const mailService = {
    getMails,
    getHistorialByPersona
};

export default mailService;