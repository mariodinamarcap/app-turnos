const { describe, test, before, beforeEach, after } = require("node:test");
const assert = require("node:assert");

// Los tests borran la tabla, así que nunca deben usar la base de datos real.
const urlDePrueba = process.env.TEST_DATABASE_URL;
if (!urlDePrueba || !urlDePrueba.endsWith("_test")) {
    throw new Error("TEST_DATABASE_URL debe apuntar a una base de datos que termine en _test.");
}
process.env.DATABASE_URL = urlDePrueba;
process.env.ADMIN_TOKEN = "clave-de-prueba";

const { app, pool } = require("./app");

const reservaValida = {
    nombre: "Pedro",
    telefono: "+56912345678",
    fecha: "2030-01-07",
    hora: "10:00",
};

let servidor;
let url;

// Enciende la app en un puerto libre, elegido por el sistema.
before(async () => {
    await new Promise((listo) => {
        servidor = app.listen(0, listo);
    });
    url = `http://localhost:${servidor.address().port}`;
});

// Cada test empieza con la tabla vacía.
beforeEach(async () => {
    await pool.query("TRUNCATE reservas RESTART IDENTITY;");
});

after(async () => {
    servidor.close();
    await pool.end();
});

const crearReserva = (datos) =>
    fetch(`${url}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });

describe("GET /reservas", () => {
    test("responde 401 sin clave", async () => {
        const respuesta = await fetch(`${url}/reservas`);
        assert.strictEqual(respuesta.status, 401);
    });

    test("responde 401 con una clave incorrecta", async () => {
        const respuesta = await fetch(`${url}/reservas`, {
            headers: { Authorization: "Bearer clave-falsa" },
        });
        assert.strictEqual(respuesta.status, 401);
    });

    test("responde 200 y las reservas con la clave correcta", async () => {
        await crearReserva(reservaValida);

        const respuesta = await fetch(`${url}/reservas`, {
            headers: { Authorization: "Bearer clave-de-prueba" },
        });
        const reservas = await respuesta.json();

        assert.strictEqual(respuesta.status, 200);
        assert.strictEqual(reservas.length, 1);
        assert.strictEqual(reservas[0].nombre, "Pedro");
    });
});

describe("POST /reservas", () => {
    test("responde 201 y la reserva creada", async () => {
        const respuesta = await crearReserva(reservaValida);
        const reserva = await respuesta.json();

        assert.strictEqual(respuesta.status, 201);
        assert.strictEqual(reserva.id, 1);
        assert.strictEqual(reserva.fecha, "2030-01-07");
    });

    test("responde 400 con un sábado", async () => {
        const respuesta = await crearReserva({ ...reservaValida, fecha: "2030-01-12" });
        const cuerpo = await respuesta.json();

        assert.strictEqual(respuesta.status, 400);
        assert.strictEqual(cuerpo.error, "Solo se atiende de lunes a viernes");
    });

    test("responde 409 si la hora ya está ocupada", async () => {
        await crearReserva(reservaValida);

        const respuesta = await crearReserva({ ...reservaValida, nombre: "Juan" });

        assert.strictEqual(respuesta.status, 409);
    });
});
