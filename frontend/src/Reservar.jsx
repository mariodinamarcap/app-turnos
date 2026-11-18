import { useState } from "react";
import { fechaCorta, fechaLarga, horaActual, proximosDiasHabiles, aTextoISO } from "./fechas.js";

const TURNOS = ["10:00", "10:30", "11:00", "11:30"];

export default function Reservar() {
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("+569");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [resultado, setResultado] = useState(null); // { tipo: "exito" | "error", mensaje }

    const dias = proximosDiasHabiles(10);
    const esHoy = fecha === aTextoISO(new Date());

    const elegirFecha = (dia) => {
        setFecha(dia);
        setHora("");
        setResultado(null);
    };

    const reservar = async (evento) => {
        evento.preventDefault();
        setEnviando(true);
        setResultado(null);

        try {
            const respuesta = await fetch("/reservas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, telefono, fecha, hora }),
            });
            const datos = await respuesta.json();

            if (respuesta.ok) {
                setResultado({
                    tipo: "exito",
                    mensaje: `¡Listo, ${datos.nombre}! Te esperamos el ${fechaLarga(datos.fecha).toLowerCase()} a las ${hora}.`,
                });
                setNombre("");
                setTelefono("+569");
                setFecha("");
                setHora("");
            } else if (respuesta.status === 409) {
                setResultado({ tipo: "error", mensaje: "Esa hora ya está ocupada. Elige otra, por favor." });
            } else {
                setResultado({ tipo: "error", mensaje: datos.error });
            }
        } catch {
            setResultado({ tipo: "error", mensaje: "No se pudo conectar con la barbería. Intenta de nuevo." });
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form className="tarjeta" onSubmit={reservar}>
            <label className="campo">
                <span>Nombre</span>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
            </label>

            <label className="campo">
                <span>Teléfono</span>
                <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    inputMode="tel"
                    placeholder="+56912345678"
                />
            </label>

            <fieldset className="campo">
                <legend>Día</legend>
                <div className="opciones">
                    {dias.map((dia) => (
                        <button
                            key={dia}
                            type="button"
                            className={dia === fecha ? "opcion elegida" : "opcion"}
                            onClick={() => elegirFecha(dia)}
                        >
                            {fechaCorta(dia)}
                        </button>
                    ))}
                </div>
            </fieldset>

            {fecha && (
                <fieldset className="campo">
                    <legend>Hora</legend>
                    <div className="opciones">
                        {TURNOS.map((turno) => (
                            <button
                                key={turno}
                                type="button"
                                className={turno === hora ? "opcion elegida" : "opcion"}
                                disabled={esHoy && turno <= horaActual()}
                                onClick={() => setHora(turno)}
                            >
                                {turno}
                            </button>
                        ))}
                    </div>
                </fieldset>
            )}

            <button className="boton-principal" disabled={!fecha || !hora || enviando}>
                {enviando ? "Reservando..." : "Reservar hora"}
            </button>

            {resultado && <p className={`aviso ${resultado.tipo}`}>{resultado.mensaje}</p>}
        </form>
    );
}
