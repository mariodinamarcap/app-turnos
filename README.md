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

4. Crear el archivo de configuración a partir del ejemplo, y ajustar `DATABASE_URL` con tu usuario de PostgreSQL:

   ```bash
   cp .env.example .env
   ```

   | Variable | Qué es | Ejemplo |
   |---|---|---|
   | `PORT` | Puerto donde escucha el servidor. Si no se indica, usa `3001` | `3001` |
   | `DATABASE_URL` | Dirección de conexión a PostgreSQL. Es obligatoria | `postgresql://usuario:contraseña@localhost:5432/app_turnos` |

   El archivo `.env` no se sube a Git, porque puede tener contraseñas.

5. Encender el servidor:

   ```bash
   npm run dev
   ```

   El servidor queda escuchando en `http://localhost:3001`, y se reinicia solo al guardar cambios. Para producción, usar `npm start`.

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
| `400 Bad Request` | Faltan datos o no cumplen las reglas de abajo. Responde con un mensaje que explica el problema |
| `409 Conflict` | Ya existe una reserva para esa fecha y hora |
| `500 Internal Server Error` | Error inesperado del servidor |

### Reglas de una reserva

- El nombre debe tener entre 2 y 50 caracteres.
- El teléfono debe ser un celular chileno: `+569` seguido de 8 dígitos.
- La fecha debe tener el formato `AAAA-MM-DD` y existir.
- Solo se atiende de lunes a viernes.
- Solo hay turnos a las `10:00`, `10:30`, `11:00` y `11:30`.
- No se puede reservar en el pasado, según la hora de Chile.
- No puede haber dos reservas para la misma fecha y hora.

## Estado del proyecto

En construcción.

**Funciona:**

- Guardar y listar reservas en PostgreSQL.
- Rechazar horas ocupadas con una regla `UNIQUE` en la base de datos.
- Rechazar reservas con datos incompletos o que no cumplen las reglas.
- Consultas con marcadores (`$1`, `$2`...) para evitar la inyección SQL.

**Pendiente:**

- Proteger `GET /reservas`: hoy cualquiera puede ver los nombres y teléfonos.
- Crear el frontend con React.
