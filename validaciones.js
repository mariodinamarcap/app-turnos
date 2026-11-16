const TURNOS = ["10:00", "10:30", "11:00", "11:30"];

// Fecha y hora actuales en Chile, como "2026-11-16 10:30".
// No depende de la zona horaria del computador donde corre el servidor.
const ahoraEnChile = () => {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Santiago",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(new Date());

    const valor = (tipo) => partes.find((parte) => parte.type === tipo).value;
    return `${valor("year")}-${valor("month")}-${valor("day")} ${valor("hour")}:${valor("minute")}`;
};

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

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return "La fecha debe tener el formato AAAA-MM-DD";
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);
    const fechaComoDate = new Date(Date.UTC(anio, mes - 1, dia));
    if (fechaComoDate.getUTCMonth() !== mes - 1 || fechaComoDate.getUTCDate() !== dia) {
        return "La fecha no existe";
    }

    const diaSemana = fechaComoDate.getUTCDay();
    if (diaSemana === 0 || diaSemana === 6) {
        return "Solo se atiende de lunes a viernes";
    }

    if (!TURNOS.includes(hora)) {
        return "Solo hay turnos a las 10:00, 10:30, 11:00 y 11:30";
    }

    if (`${fecha} ${hora}` <= ahoraEnChile()) {
        return "No se puede reservar en el pasado";
    }

    return null;
};

module.exports = { validarReserva };
