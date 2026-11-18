const { describe, test } = require("node:test");
const assert = require("node:assert");
const { validarReserva } = require("./validaciones");

// Una reserva que cumple todas las reglas: lunes 7 de enero de 2030, a las 10:00.
// Cada test cambia solo el dato que quiere probar.
const reservaValida = {
    nombre: "Pedro",
    telefono: "+56912345678",
    fecha: "2030-01-07",
    hora: "10:00",
};

describe("validarReserva", () => {
    test("acepta una reserva correcta", () => {
        assert.strictEqual(validarReserva(reservaValida), null);
    });

    test("rechaza una reserva sin teléfono", () => {
        const reserva = { ...reservaValida, telefono: undefined };
        assert.strictEqual(validarReserva(reserva), "Faltan datos obligatorios");
    });

    test("rechaza un nombre de una letra", () => {
        const reserva = { ...reservaValida, nombre: "P" };
        assert.strictEqual(validarReserva(reserva), "Nombre muy corto");
    });

    test("no cuenta los espacios del nombre", () => {
        const reserva = { ...reservaValida, nombre: "   P   " };
        assert.strictEqual(validarReserva(reserva), "Nombre muy corto");
    });

    test("rechaza un nombre de más de 50 caracteres", () => {
        const reserva = { ...reservaValida, nombre: "a".repeat(51) };
        assert.strictEqual(validarReserva(reserva), "Nombre muy largo");
    });

    test("rechaza un teléfono sin +569", () => {
        const reserva = { ...reservaValida, telefono: "912345678" };
        assert.strictEqual(validarReserva(reserva), "El teléfono debe tener el formato +56912345678");
    });

    test("rechaza una fecha con otro formato", () => {
        const reserva = { ...reservaValida, fecha: "07-01-2030" };
        assert.strictEqual(validarReserva(reserva), "La fecha debe tener el formato AAAA-MM-DD");
    });

    test("rechaza el 30 de febrero", () => {
        const reserva = { ...reservaValida, fecha: "2030-02-30" };
        assert.strictEqual(validarReserva(reserva), "La fecha no existe");
    });

    test("rechaza un sábado", () => {
        const reserva = { ...reservaValida, fecha: "2030-01-12" };
        assert.strictEqual(validarReserva(reserva), "Solo se atiende de lunes a viernes");
    });

    test("rechaza un domingo", () => {
        const reserva = { ...reservaValida, fecha: "2030-01-13" };
        assert.strictEqual(validarReserva(reserva), "Solo se atiende de lunes a viernes");
    });

    test("rechaza un turno a las 12:00", () => {
        const reserva = { ...reservaValida, hora: "12:00" };
        assert.strictEqual(validarReserva(reserva), "Solo hay turnos a las 10:00, 10:30, 11:00 y 11:30");
    });

    test("rechaza una fecha pasada", () => {
        const reserva = { ...reservaValida, fecha: "2020-01-06" };
        assert.strictEqual(validarReserva(reserva), "No se puede reservar en el pasado");
    });
});
