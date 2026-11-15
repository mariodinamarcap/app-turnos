const validarReserva = ({ nombre, telefono, fecha, hora }) => {
    if (!nombre || !telefono || !fecha || !hora) {
        return "Faltan datos obligatorios";
    }

    const nombreLimpio = nombre.trim();
    if (nombreLimpio.length < 2) {
        return "Nombre muy corto";
    }
    if (nombreLimpio.length > 50) {
        return "Nombre muy largo";
    }

    return null;
};

module.exports = { validarReserva };
