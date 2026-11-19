import { useEffect, useState } from "react";
import { fechaLarga } from "./fechas.js";

const CLAVE_GUARDADA = "barberia-clave";

// El navegador puede bloquear localStorage (por ejemplo, en modo incógnito), así que no debe romper la página.
const leerClave = () => {
    try {
        return localStorage.getItem(CLAVE_GUARDADA) || "";
    } catch {
        return "";
    }
};

const guardarClave = (clave) => {
    try {
        if (clave) {
            localStorage.setItem(CLAVE_GUARDADA, clave);
        } else {
            localStorage.removeItem(CLAVE_GUARDADA);
        }
    } catch {
        // Si no se puede guardar, el barbero tendrá que escribirla la próxima vez.
    }
};

// Agrupa las reservas por fecha y las ordena por hora: { "2026-11-24": [reserva, reserva], ... }
const agruparPorDia = (reservas) => {
    const ordenadas = [...reservas].sort((a, b) => `${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
    const grupos = {};
    for (const reserva of ordenadas) {
        grupos[reserva.fecha] = grupos[reserva.fecha] || [];
        grupos[reserva.fecha].push(reserva);
    }
    return grupos;
};

export default function PanelBarbero() {
    const [clave, setClave] = useState(leerClave);
    const [reservas, setReservas] = useState(null);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const cargarReservas = async (claveAUsar) => {
        setCargando(true);
        setError("");

        try {
            const respuesta = await fetch("/reservas", {
                headers: { Authorization: `Bearer ${claveAUsar}` },
            });

            if (respuesta.status === 401) {
                setError("Clave incorrecta.");
                setReservas(null);
                guardarClave("");
                return;
            }

            setReservas(await respuesta.json());
            guardarClave(claveAUsar);
        } catch {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setCargando(false);
        }
    };

    // Si el barbero ya había entrado antes, carga las reservas al abrir la página.
    useEffect(() => {
        const claveGuardada = leerClave();
        if (claveGuardada) {
            cargarReservas(claveGuardada);
        }
    }, []);

    const entrar = (evento) => {
        evento.preventDefault();
        cargarReservas(clave);
    };

    const salir = () => {
        guardarClave("");
        setClave("");
        setReservas(null);
    };

    if (reservas) {
        const grupos = agruparPorDia(reservas);
        const fechas = Object.keys(grupos);

        return (
            <section className="tarjeta">
                <div className="barra">
                    <p>
                        {reservas.length} {reservas.length === 1 ? "reserva" : "reservas"}
                    </p>
                    <div className="barra-botones">
                        <button className="boton-secundario" onClick={() => cargarReservas(clave)}>
                            Actualizar
                        </button>
                        <button className="boton-secundario" onClick={salir}>
                            Salir
                        </button>
                    </div>
                </div>

                {fechas.length === 0 && <p className="vacio">Todavía no hay reservas.</p>}

                {fechas.map((fecha) => (
                    <div key={fecha} className="dia">
                        <h2>{fechaLarga(fecha)}</h2>
                        <ul>
                            {grupos[fecha].map((reserva) => (
                                <li key={reserva.id}>
                                    <span className="hora">{reserva.hora.slice(0, 5)}</span>
                                    <span>{reserva.nombre}</span>
                                    <a href={`tel:${reserva.telefono}`}>{reserva.telefono}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        );
    }

    return (
        <form className="tarjeta" onSubmit={entrar}>
            <label className="campo">
                <span>Clave</span>
                <input
                    type="password"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    placeholder="Tu clave de barbero"
                    autoComplete="current-password"
                />
            </label>

            <button className="boton-principal" disabled={!clave || cargando}>
                {cargando ? "Entrando..." : "Entrar"}
            </button>

            {error && <p className="aviso error">{error}</p>}
        </form>
    );
}
