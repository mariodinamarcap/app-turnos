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

    if (!/^\+569\d{8}$/.test(telefono)) {
        return "El teléfono debe tener el formato +56912345678";
    }

    return null;
};

module.exports = { validarReserva };
