// Ayudantes para mostrar y elegir fechas, usando la hora del navegador del cliente.

const dosDigitos = (numero) => String(numero).padStart(2, "0");

// Convierte un Date a "2026-11-24", el formato que espera el backend.
export const aTextoISO = (fecha) =>
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;

const formatear = (textoISO, opciones) => {
    const [anio, mes, dia] = textoISO.split("-").map(Number);
    const texto = new Date(anio, mes - 1, dia).toLocaleDateString("es-CL", opciones).replace(",", "");
    return texto.charAt(0).toUpperCase() + texto.slice(1);
};

// "2026-11-24" → "Martes 24 de noviembre"
export const fechaLarga = (textoISO) => formatear(textoISO, { weekday: "long", day: "numeric", month: "long" });

// "2026-11-24" → "Mar 24 nov"
export const fechaCorta = (textoISO) => formatear(textoISO, { weekday: "short", day: "numeric", month: "short" });

// Los próximos días de lunes a viernes, empezando por hoy.
export const proximosDiasHabiles = (cantidad) => {
    const dias = [];
    const dia = new Date();

    while (dias.length < cantidad) {
        const diaSemana = dia.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) {
            dias.push(aTextoISO(dia));
        }
        dia.setDate(dia.getDate() + 1);
    }

    return dias;
};

// La hora actual como "10:30", para no ofrecer turnos que ya pasaron hoy.
export const horaActual = () => {
    const ahora = new Date();
    return `${dosDigitos(ahora.getHours())}:${dosDigitos(ahora.getMinutes())}`;
};
