# Task API

A simple REST API built with **Node.js** and **Express.js** that performs full CRUD (Create, Read, Update, Delete) operations on tasks. The API also includes interactive documentation using **Swagger UI**.

---

## Features

- Get all tasks
- Create a new task
- Update an existing task
- Delete a task
- Input validation
- Swagger UI documentation

---

## Tech Stack

- Node.js
- Express.js
- Swagger UI Express

---

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the project directory:

```bash
cd week-2/todo-api
```

Install dependencies:

```bash
npm install
```

---

## Run the Application

```bash
node server.js
```

The server will start on:

```
http://localhost:3000
```

---

## Swagger Documentation

Open the following URL in your browser:

```
http://localhost:3000/docs
```

Swagger UI allows you to test all API endpoints directly from your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Retrieve all tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/{id}` | Update an existing task |
| DELETE | `/tasks/{id}` | Delete a task |

---

## Sample Request

### Create Task

**POST** `/tasks`

```json
{
  "title": "Learn Express"
}
```

### Sample Response

```json
{
  "id": 1,
  "title": "Learn Express",
  "done": false
}
```

---

## Project Structure

```text
todo-api/
├── node_modules/
├── server.js
├── openapi.json
├── package.json
├── package-lock.json
└── README.md
```

---

## HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |

---

## Author

**Aniket Deo**
