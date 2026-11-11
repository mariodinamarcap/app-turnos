const validarReserva = ({ nombre, telefono, fecha, hora }) => {
    if (!nombre || !telefono || !fecha || !hora) {
        return "Faltan datos obligatorios";
    }

    return null;
};

module.exports = { validarReserva };
