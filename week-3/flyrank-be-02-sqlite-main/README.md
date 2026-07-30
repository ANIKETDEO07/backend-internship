# FlyRank BE-04: Dockerized PostgreSQL Task API

## Project overview
This repository contains the FlyRank BE-04 backend assignment. It migrates the BE-02 task API from SQLite/in-memory storage to PostgreSQL and runs the API and database inside Docker Compose.

## Architecture
- `app.js` is the Docker-compatible entrypoint.
- `index.js` configures Express, middleware, routes, and error handling.
- `src/db/database.js` implements the PostgreSQL repository layer using `pg`.
- `src/routes/tasks.js` implements the task CRUD REST API.
- `docker-compose.yml` orchestrates the Node app and PostgreSQL database.
- `docker/init.sql` initializes the database schema and seeds sample data.

## Technologies used
- Node.js 20
- Express.js
- PostgreSQL 15
- Docker
- Docker Compose
- pg
- dotenv
- JavaScript (CommonJS)

## Installation
1. Clone the repository.
2. Copy `.env.example` to `.env`.
3. Install dependencies:

```bash
npm ci
```

## Environment setup
The repository uses `.env.example` to configure Postgres and app settings. Copy it into `.env` before starting Docker.

Example `.env.example` values:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=flyrank
DATABASE_URL=postgresql://postgres:postgres@db:5432/flyrank
PORT=3000
```

> Note: Do not commit `.env` to source control. Use `.env.example` as the template.

## One-command Docker startup
Start the stack with:

```bash
docker compose up --build -d
```

To stop the stack:

```bash
docker compose down
```

## Project folder structure
- `app.js` — Docker-compatible entrypoint.
- `index.js` — Express application configuration, route registration, and error handling.
- `src/db/database.js` — PostgreSQL repository layer using `pg` and initialization logic.
- `src/routes/tasks.js` — Task CRUD route handlers with validation.
- `docker-compose.yml` — Docker Compose service definitions.
- `Dockerfile` — Node app container build instructions.
- `docker/init.sql` — PostgreSQL initialization and sample task seeding.
- `.env.example` — Environment variable template.
- `.gitignore` — Ignored files and folders.
- `.dockerignore` — Ignored files for Docker build context.

## PostgreSQL repository explanation
This project replaces the SQLite repository layer with PostgreSQL in `src/db/database.js`.
- Uses `pg` and environment-based `DATABASE_URL`.
- Creates the `tasks` table automatically.
- Inserts three sample tasks only when the table is empty.
- Keeps the task routes unchanged.

## API endpoint table
| Method | Endpoint | Body | Description | Expected Status |
| --- | --- | --- | --- | --- |
| GET | `/tasks` | none | List all tasks | `200` |
| GET | `/tasks/:id` | none | Get a task by ID | `200` / `404` |
| POST | `/tasks` | `{ "title": "text", "done": false }` | Create a new task | `201` / `400` |
| PUT | `/tasks/:id` | `{ "title": "text", "done": true }` | Update task fields | `200` / `400` / `404` |
| DELETE | `/tasks/:id` | none | Delete a task | `200` / `404` |

## Example curl requests
### GET /tasks
```bash
curl -i http://localhost:3000/tasks
```
Expected response:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  { "id": 1, "title": "Learn PostgreSQL integration", "done": false },
  { "id": 2, "title": "Build the Task API with SQL", "done": false },
  { "id": 3, "title": "Verify data persistence after restart", "done": false }
]
```

### GET /tasks/1
```bash
curl -i http://localhost:3000/tasks/1
```
Expected response:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "id": 1, "title": "Learn PostgreSQL integration", "done": false }
```

### POST /tasks
```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"New task","done":false}'
```
Expected response:
```http
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{ "id": 4, "title": "New task", "done": false }
```

### PUT /tasks/1
```bash
curl -i -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title":"Updated task","done":true}'
```
Expected response:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "id": 1, "title": "Updated task", "done": true }
```

### DELETE /tasks/1
```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```
Expected response:
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "message": "Task deleted successfully" }
```

## Database initialization and persistence
- `docker/init.sql` creates the `tasks` table if it does not exist.
- It inserts the three sample tasks only when they are missing.
- PostgreSQL data is persisted in the Docker volume `postgres_data`.
- Restarting containers does not delete persisted task data.

## Known limitations
- Docker runtime verification was not performed locally in this environment because Docker Desktop is not available here.
- A live database screenshot is not included for that reason.

## Troubleshooting
- If `docker compose up --build -d` fails, confirm Docker Desktop is installed and running.
- If the app cannot connect, confirm `.env` exists and `DATABASE_URL` is correct.
- If the database does not initialize, inspect the Postgres logs:

```bash
docker compose logs db --tail 50
```

- If the Node app fails, inspect the app logs:

```bash
docker compose logs app --tail 50
```

## Compliance note
This repository is prepared for FlyRank BE-04 submission. All Docker, PostgreSQL, environment, database, and API configuration is documented. Runtime verification is documented as not completed locally due environment limitations.
