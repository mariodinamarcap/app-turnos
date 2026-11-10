-- Crea la tabla de reservas de la app de turnos.
-- Uso: psql app_turnos -f schema.sql

CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    CONSTRAINT reservas_fecha_hora_unica UNIQUE (fecha, hora)
);
