import Reservar from "./Reservar.jsx";
import PanelBarbero from "./PanelBarbero.jsx";

// Una sola página con dos pantallas: /barbero muestra el panel, y cualquier otra dirección, el formulario.
export default function App() {
    const esPanel = window.location.pathname === "/barbero";

    return (
        <main className="contenedor">
            <header className="encabezado">
                <p className="logo">✂</p>
                <h1>Barbería Chile</h1>
                <p className="subtitulo">{esPanel ? "Panel del barbero" : "Reserva tu hora online"}</p>
            </header>

            {esPanel ? <PanelBarbero /> : <Reservar />}
        </main>
    );
}
