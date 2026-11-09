const express = require("express");
const { Pool, types } = require("pg");
types.setTypeParser(1082, (valor) => valor);

const app = express();

app.use(express.json());

const pool = new Pool({ database: "app_turnos" });

app.get("/", (req, res) => {
    console.log("Llegó una petición a /");
    res.send("ruta raiz");
});

app.get("/hola", (req, res) => {
    res.send("Hola desde el servidor");
});

app.get("/reservas", async (req, res) => {
    const resultado = await pool.query("SELECT * FROM reservas;");
    res.json(resultado.rows);
});

app.post("/reservas", async (req, res) => {
    try {
        const { nombre, telefono, fecha, hora } = req.body;

        if (!nombre || !telefono || !fecha || !hora) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const resultado = await pool.query(
            "INSERT INTO reservas (nombre, telefono, fecha, hora) VALUES ($1, $2, $3, $4) RETURNING *;",
            [nombre, telefono, fecha, hora]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ error: "hora ocupada" });
        }
        console.error(error);
        res.status(500).json({ error: "Error interno" });
    }
});

app.listen(3001);