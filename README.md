# App de turnos para barbería

API para reservar horas en una barbería. Permite guardar reservas y listarlas, e impide que dos personas reserven la misma fecha y hora, aunque lo intenten al mismo tiempo.

Por ahora es solo el backend: no tiene pantallas. Lo estoy construyendo para aprender desarrollo full stack.

## Tecnologías

- **Node.js** y **Express 5**: servidor y rutas HTTP.
- **PostgreSQL**: base de datos.
- **pg**: conexión entre Node.js y PostgreSQL.

## Requisitos

- Node.js 18 o superior.
- PostgreSQL instalado y en ejecución.

## Instalación

1. Clonar el repositorio y entrar a la carpeta:

   ```bash
   git clone https://github.com/mariodinamarcap/app-turnos.git
   cd app-turnos
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Crear la base de datos y la tabla:

   ```bash
   createdb app_turnos
   psql app_turnos -f schema.sql
   ```

4. Encender el servidor:

   ```bash
   node servidor.js
   ```

   El servidor queda escuchando en `http://localhost:3001`.

> La conexión usa la base de datos `app_turnos` con el usuario de PostgreSQL de tu sistema, sin contraseña. Por ahora no se puede configurar.

## Uso

### Listar las reservas

```bash
curl http://localhost:3001/reservas
```

Responde `200` con un arreglo de reservas:

```json
[
  { "id": 1, "nombre": "Ana", "telefono": "12345678", "fecha": "2026-11-10", "hora": "10:00:00" }
]
```

### Crear una reserva

```bash
curl -i -X POST http://localhost:3001/reservas \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Carla","telefono":"+56987654321","fecha":"2026-11-10","hora":"11:00"}'
```

| Status | Cuándo |
|---|---|
| `201 Created` | La reserva se guardó. Responde con la reserva creada, incluido su `id` |
| `400 Bad Request` | Falta el nombre, el teléfono, la fecha o la hora |
| `409 Conflict` | Ya existe una reserva para esa fecha y hora |
| `500 Internal Server Error` | Error inesperado del servidor |

## Estado del proyecto

En construcción.

**Funciona:**

- Guardar y listar reservas en PostgreSQL.
- Rechazar horas ocupadas con una regla `UNIQUE` en la base de datos.
- Rechazar reservas con datos incompletos.
- Consultas con marcadores (`$1`, `$2`...) para evitar la inyección SQL.

**Pendiente:**

- Validar el formato de los datos, las fechas pasadas, el horario de atención y los turnos de 30 minutos.
- Proteger `GET /reservas`: hoy cualquiera puede ver los nombres y teléfonos.
- Configurar la conexión a la base de datos con variables de entorno.
- Crear el frontend con React.
