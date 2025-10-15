import { useState } from 'react';
import mockClientes from '../../data/mockClientes.json';


// Esto cambia. se conecta con el Back
const getClientData = (dni) => {
    return mockClientes.find(client => client.dni === dni);
};


const DetalleCliente = ({ dni: propDni }) => {

    const client = getClientData(propDni);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    // Score
    const score = client.score_actual;
    let scoreColorClass;
    let scoreBgClass;
    let scoreBorderColor;
    const progress = `${score}%`;

    if (score >= 71) {
        // ALTO
        scoreColorClass = 'text-scoring-verde';
        scoreBgClass = 'bg-scoring-verde';
        scoreBorderColor = 'border-scoring-verde';
    } else if (score >= 41) {
        // MEDIO
        scoreColorClass = 'text-scoring-naranja';
        scoreBgClass = 'bg-scoring-naranja';
        scoreBorderColor = 'border-scoring-naranja';
    } else {
        // BAJO
        scoreColorClass = 'text-scoring-rojo';
        scoreBgClass = 'bg-scoring-rojo';
        scoreBorderColor = 'border-scoring-rojo';
    }

    const sectionTitleColor = 'text-primary';
    const cardBorderColor = 'border-primary';

    return (
        <div className="min-h-screen bg-app-fondo text-texto-claro font-sans">

            {/* Contenedor principal*/}
            <div className="max-w-7xl mx-auto p-6 bg-app-fondo">

                {/* Header */}
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <img
                            src="/img/icono_user.png"
                            alt="Ícono de Usuario"
                            className="w-12 h-12 mr-4 text-primary"
                        />
                        <h1 className={`text-5xl font-bold ${sectionTitleColor}`}>
                            {client.nombre}
                        </h1>
                    </div>

                    {/* Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="text-primary hover:text-primary focus:outline-none transition duration-150 flex items-center"
                        >
                            <img
                                src="/img/user.png"
                                alt="Menú de Usuario"
                                className="w-8 h-8"
                            />
                            <span className="ml-2 text-2xl">
                                {isUserMenuOpen ? '▼' : '▲'}
                            </span>
                        </button>
                        {isUserMenuOpen && (

                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10 text-texto-claro">

                                {/*Perfil*/}
                                <div className="flex items-center p-3 border-b border-gray-200">
                                    {/* Icono de Perfil */}
                                    <img src="/img/icono_user.png" alt="Perfil" className="w-10 h-10 mr-3 text-primary" />
                                    <span className="font-semibold text-sm text-texto-claro">User123</span>
                                </div>

                                {/* Clientes*/}
                                <a href="#" className="flex items-center px-4 py-3 hover:bg-indigo-50 transition duration-150">
                                    {/* Icono Clientes */}
                                    <img src="/img/icono_personas.png" alt="Clientes" className="w-6 h-6 mr-3 text-primary" />
                                    <span className="font-medium text-xs">CLIENTES</span>
                                </a>

                                {/* Correos */}
                                <a href="#" className="flex items-center px-4 py-3 hover:bg-indigo-50 transition duration-150">
                                    {/* Icono Correos */}
                                    <img src="/img/icono_mail.png" alt="Correos Enviados" className="w-6 h-6 mr-3 text-primary" />
                                    <span className="font-medium text-xs">CORREOS ENVIADOS</span>
                                </a>

                                {/* Editar Productos */}
                                <a href="#" className="flex items-center px-4 py-3 hover:bg-indigo-50 transition duration-150">
                                    {/* Icono Editar Productos */}
                                    <img src="/img/icono_editar.png" alt="Editar Productos" className="w-6 h-6 mr-3 text-primary" />
                                    <span className="font-medium text-xs">EDITAR PRODUCTOS</span>
                                </a>

                                {/* Separador */}
                                <div className="border-t border-gray-200 my-1"></div>

                                {/* Cerrar Sesion */}
                                <a href="#" className="flex items-center px-4 py-3 hover:bg-red-50 transition duration-150">
                                    {/* Icono Cerrar Sesión */}
                                    <img src="/img/icono_cerrar_sesion.png" alt="Cerrar Sesión" className="w-6 h-6 mr-3 text-primary" />
                                    <span className="font-medium text-xs text-texto-claro">CERRAR SESION</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Body - 2 columnas*/}
                <div className="flex space-x-8 mt-6">

                    {/* Columna Izquierda - Detalle del Cliente */}
                    <div className="w-2/3 space-y-6">

                        {/* Info Personal */}
                        <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${cardBorderColor}`}>
                            <h3 className={`text-xl font-semibold border-b border-gray-200 pb-2 mb-4 ${sectionTitleColor}`}>
                                INFORMACIÓN PERSONAL
                            </h3>
                            <div className="text-texto-claro grid grid-cols-2 gap-y-3">
                                <p><strong className="font-bold">DNI:</strong> {client.dni}</p>
                                <p><strong className="font-bold">Edad:</strong> {client.edad} años</p>
                                <p className="col-span-2"><strong className="font-bold">Mail:</strong> {client.mail}</p>
                            </div>
                        </div>

                        {/* Estado de Seguros */}
                        <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${cardBorderColor}`}>
                            <h3 className={`text-xl font-semibold border-b border-gray-200 pb-2 mb-4 ${sectionTitleColor}`}>
                                ESTADO DE SEGUROS
                            </h3>
                            <div className="text-texto-claro space-y-3">
                                <p><strong className="font-bold">Pólizas activas:</strong> {client.polizas_activas}</p>
                                <p><strong className="font-bold">Pagos:</strong> {client.pagos}</p>
                                <p><strong className="font-bold">Siniestros:</strong> {client.siniestros}</p>
                            </div>
                        </div>

                        {/* Interacciones */}
                        <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${cardBorderColor}`}>
                            <h3 className={`text-xl font-semibold border-b border-gray-200 pb-2 mb-4 ${sectionTitleColor}`}>
                                INTERACCIONES
                            </h3>
                            <div className="text-texto-claro">
                                <p className="font-medium">{client.interacciones}</p>
                            </div>
                        </div>

                    </div>



                    {/* Columna Derecha - Score*/}
                    <div className="w-1/3 space-y-6">

                        <div
                            className={`bg-white p-6 rounded-xl shadow-lg border ${scoreBorderColor} text-center`}
                        >

                            <h3 className={`text-2xl font-bold mb-6 ${scoreColorClass}`}>
                                Score Actual
                            </h3>

                            {/* Barra de Progreso */}
                            <div className="w-full bg-gray-200 rounded-full h-3.5 mb-6 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${scoreBgClass}`}
                                    style={{ width: progress }}
                                ></div>
                            </div>

                            {/* Puntaje y Rango */}
                            <p className={`text-4xl font-bold text-center mb-6 ${scoreColorClass}`}>{client.score_actual}/100</p>

                            <p className={`text-xl font-bold ${scoreColorClass}`}>
                                {client.rango_score}
                            </p>

                            {/* Mensaje Apto/No Apto */}
                            <p className={`text-2xl font-bold mt-3 ${scoreColorClass}`}>
                                {client.estado_cross_selling}
                            </p>

                        </div>
                        {/* Botón de Correo (condicional) */}
                        {client.estado_cross_selling === 'Apto para Cross-Selling' && (
                            <button
                                onClick={() => console.log('Visualizar Correo')}
                                className={`mt-6 px-6 py-3 text-white font-bold rounded-3xl shadow-md transition duration-300 bg-scoring-verde hover:opacity-90 block mx-auto w-2/3 max-w-[250px]`}
                            >
                                Visualizar Correo
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalleCliente;