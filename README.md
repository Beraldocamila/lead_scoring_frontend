Proyecto: Interfaz de Usuario (UI) del Lead Scoring System

## Propósito

Este proyecto corresponde a la **interfaz de usuario (Front-End)** del sistema de **Scoring y Cross-Selling con IA para Compañías de Seguros**.

La aplicación permite al equipo comercial:

- Visualizar el **puntaje (Scoring 1–100)** de los clientes según su historial.  
- Obtener **recomendaciones automáticas de productos (Cross-Selling)** basadas en el puntaje.  
- **Editar y enviar correos personalizados** con las recomendaciones generadas.  

---

## Tecnologías utilizadas

- **ReactJS** — v19.1.1  
- **CSS** — para el diseño visual de la interfaz  
- **React Router DOM** — para la gestión de rutas  
- **React Icons** — para el uso de íconos en la interfaz  

---

## Instalación y ejecución

### Requisitos previos

Para ejecutar el proyecto necesitás tener instalado: 
- **Node.js**

---

### 1. Clonar el repositorio

Descargá el proyecto con el siguiente comando: **git clone https://github.com/Beraldocamila/lead_scoring_frontend.git**

### 2. Instalar dependencias
Ingresá a la carpeta del proyecto y ejecutá: **npm install**


### 3. Ejecutar la aplicación
Iniciá el entorno de desarrollo con: **npm start**

Luego abrí tu navegador y entrá a: **http://localhost:3000**

---

## Estructura de pantallas

### Login
Pantalla de acceso que gestiona la autenticación mediante JWT.

### Búsqueda de clientes
Permite buscar clientes por documento o nombre.
Incluye filtros por pólizas y opciones para ordenar por Nombre o DNI.

Muestra:
Listado de clientes con opción de ver el detalle de cada uno.

### Detalle del cliente
Pantalla información personal, estado de Seguro, interacciones, puntaje de Scoring y aptitud para Cross-Selling.

### Borrador de correo
Pantalla que muestra el correo de recomendación generado automáticamente.
El usuario puede:
- Editar el contenido.
- Ver la vista previa.
- Enviar o cancelar el envío del correo.

### Reportes de correos enviados
Lista de correos enviados con información como:
- Destinatario
- Producto recomendado
- Fecha de envío

Incluye filtros por cliente, producto o fecha, y opción de exportar a PDF o Excel.

### Back-End y base de datos
Este repositorio contiene solo el Front-End.
El sistema se integra con un Back-End desarrollado en Python y una base de datos MySQL, según los requerimientos técnicos del proyecto.
