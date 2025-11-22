import api from "./api";

// GET todos los clientes
const getClients = () => {
    return api.get("/clientes");
};

// GET cliente por DNI
const getClientByDniService = (dni) => {
    return api.get(`/predict/${dni}`);
};

const clientService = {
    getClients,
    getClientByDniService
};

export default clientService;