# App de turnos para barbería

App para reservar horas en **Barbería Chile**. Los clientes reservan desde una página web, y el barbero ve sus reservas en un panel protegido con clave. Impide que dos personas reserven la misma fecha y hora, aunque lo intenten al mismo tiempo.

Lo estoy construyendo para aprender desarrollo full stack.

## Tecnologías

- **Node.js** y **Express 5**: servidor y rutas HTTP.
- **PostgreSQL**: base de datos.
- **pg**: conexión entre Node.js y PostgreSQL.
- **React** y **Vite**: las pantallas, en la carpeta `frontend`.

## Pantallas

| Dirección | Para quién | Qué hace |
|---|---|---|
| `/` | Clientes | Formulario para reservar. Solo muestra días de lunes a viernes y no ofrece horas que ya pasaron |
| `/barbero` | El barbero | Pide la clave `ADMIN_TOKEN` y muestra las reservas agrupadas por día. Recuerda la clave en el navegador |

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
   | `ADMIN_TOKEN` | Clave secreta del barbero para ver las reservas. Es obligatoria | Una clave larga y aleatoria |

   Para generar una clave segura:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   El archivo `.env` no se sube a Git, porque puede tener contraseñas.

5. Construir las pantallas:

   ```bash
   npm run build
   ```

   Instala las dependencias de `frontend` y deja las pantallas listas en `frontend/dist`.

6. Encender el servidor:

   ```bash
   npm run dev
   ```

   La app queda en `http://localhost:3001`, y el servidor se reinicia solo al guardar cambios. Para producción, usar `npm start`.

### Programar las pantallas

Para ver los cambios del frontend al instante, sin volver a construirlo, se usan dos terminales:

```bash
npm run dev
```

```bash
npm run dev:frontend
```

Las pantallas quedan en `http://localhost:5173`, y sus peticiones a `/reservas` llegan al backend del puerto 3001.

## Uso

### Listar las reservas

Solo el barbero puede ver las reservas. Hay que enviar la clave `ADMIN_TOKEN` en el header `Authorization`:

```bash
curl http://localhost:3001/reservas \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

Si la clave falta o es incorrecta, responde `401 Unauthorized`. Si es correcta, responde `200` con un arreglo de reservas:

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

## Tests

Los tests de las rutas usan una base de datos aparte, porque la vacían antes de cada test. Hay que crearla una vez:

```bash
createdb app_turnos_test
psql app_turnos_test -f schema.sql
```

Y agregar su dirección al `.env`, en la variable `TEST_DATABASE_URL`. Su nombre debe terminar en `_test`; si no, los tests no se ejecutan, para no borrar las reservas reales.

Después, para ejecutar todos los tests:

```bash
npm test
```

| Archivo | Qué prueba |
|---|---|
| `validaciones.test.js` | Las reglas de una reserva, sin servidor ni base de datos |
| `rutas.test.js` | Las rutas completas: los status `200`, `201`, `400`, `401` y `409` |

Usan `node --test`, el test runner que trae Node, así que no hay que instalar nada.

## Estado del proyecto

En construcción.

**Funciona:**

- Guardar y listar reservas en PostgreSQL.
- Rechazar horas ocupadas con una regla `UNIQUE` en la base de datos.
- Rechazar reservas con datos incompletos o que no cumplen las reglas.
- Consultas con marcadores (`$1`, `$2`...) para evitar la inyección SQL.
- Solo el barbero puede ver las reservas, con una clave secreta.
- Tests automáticos de las reglas de una reserva y de las rutas.
- Pantallas en React para el cliente y para el barbero.

**Pendiente:**

- Publicar la app en internet.
