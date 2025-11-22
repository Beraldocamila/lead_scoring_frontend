import api from "./api";

// GET todos los correos
const getMails = () => {
    return api.get("/correos/historial");
};



const mailService = {
    getMails
};

export default mailService;