const express = require("express");
const { Pool, types } = require("pg");
types.setTypeParser(1082, (valor) => valor);
const { validarReserva } = require("./validaciones");
const { soloBarbero } = require("./autenticacion");

for (const variable of ["DATABASE_URL", "ADMIN_TOKEN"]) {
    if (!process.env[variable]) {
        console.error(`Falta la variable ${variable}. Copia .env.example como .env y complétalo.`);
        process.exit(1);
    }
}

const app = express();

app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", (req, res) => {
    console.log("Llegó una petición a /");
    res.send("ruta raiz");
});

app.get("/hola", (req, res) => {
    res.send("Hola desde el servidor");
});

app.get("/reservas", soloBarbero, async (req, res) => {
    const resultado = await pool.query("SELECT * FROM reservas;");
    res.json(resultado.rows);
});

app.post("/reservas", async (req, res) => {
    try {
        const { nombre, telefono, fecha, hora } = req.body;

        const errorValidacion = validarReserva(req.body);
        if (errorValidacion) {
            return res.status(400).json({ error: errorValidacion });
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

module.exports = { app, pool };
