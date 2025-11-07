# Reve Backend Challenge

This repository contains the backend service for "Reve," an event management and RSVP platform. The project is built with Node.js, Express, and PostgreSQL, following a modular, service-oriented architecture.

---

##  Features

* **User Management**: Create, list, and get user details.
* **Event Management**: Create, read, update, and delete events.
* **RSVP System**: Allows users to RSVP to events, with a many-to-many relationship.
* **Creator-Only Deletion**: Events can only be deleted by the user who created them.
* **Business Logic**: Triggers a notification (console log) when an event reaches exactly 10 RSVPs.
* **Dynamic Queries**: Filter events by `upcoming`, `limit`, and `offset`.
* **Relational Data**: Get event details including a live `rsvpCount` and a full `userList` of attendees.
* **Validation**: All create/update endpoints include request body validation.
* **Error Handling**: A global error handler provides consistent and graceful error responses.

---

##  Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma (for type-safe database access and migrations)
* **Validation**: Joi (for request body schema validation)
* **Environment**: `dotenv` (for managing environment variables)
* **Development**: `nodemon` (for live server reloading)

---

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/en/) (v18 or later)
* [PostgreSQL](https://www.postgresql.org/download/)
* A tool to manage your database, such as [pgAdmin](https://www.pgadmin.org/)
* [Git](https://git-scm.com/downloads)

---

##  Local Setup and Installation

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/reve-backend.git
cd reve-backend
```

### 2. Install Dependencies

Install all the required npm packages.

```bash
npm install
```

### 3. Set Up the Database

You must create a new PostgreSQL database for this project.

1. Open `pgAdmin` (or your preferred SQL client) and connect to your PostgreSQL server.
2. Right-click on **Databases** -> **Create** -> **Database...**
3. Enter the name `reve_db` and click **Save**.

### 4. Configure Environment Variables

Create a `.env` file in the root of the project folder. Copy the contents of the example file below and **update the `DATABASE_URL`** with your own PostgreSQL credentials.

**File: `.env`**

```env
# Example PostgreSQL connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/reve_db"

# Server port
PORT=8000
```

> **Note**: If your password contains special characters (like `@`), they must be URL-encoded.

### 5. Run Database Migration

This command will read the `schema.prisma` file and create all the necessary tables (`User`, `Event`, `Rsvp`) in your `reve_db`.

```bash
npx prisma migrate dev
```

### 6. Run the Server

You are now ready to start the application.

```bash
npm run dev
```

The server will start on `http://localhost:8000`. You will see the message: `Server is running on http://localhost:8000`.

---

##  API Endpoints

All endpoints are prefixed with `/api`.

### Users

* **`POST /users`**
  * Creates a new user.
  * Body: `{ "name": "string", "email": "string" }`

* **`GET /users`**
  * Lists all users.

* **`GET /users/:id`**
  * Gets details of a single user by ID.

### Events

* **`POST /events`**
  * Creates a new event.
  * Body: `{ "title": "string", "description": "string", "date": "ISO_DATE_STRING", "createdBy": "integer (userId)" }`

* **`GET /events`**
  * Lists all events.
  * Query Params (Optional):
    * `upcoming=true`: Filters for events with a date in the future.
    * `limit=10`: Limits to 10 results.
    * `offset=5`: Skips the first 5 results.

* **`GET /events/:id`**
  * Gets event details, including `rsvpCount` and the list of `users` who RSVPd.

* **`PATCH /events/:id`**
  * Updates event details.
  * Body (Partial): `{ "title": "string" }`

* **`DELETE /events/:id`**
  * Deletes an event.
  * **Requires Body**: `{ "userId": "integer (creator's userId)" }` to verify ownership.

### RSVPs

* **`POST /events/:id/rsvp`**
  * RSVPs a user to an event. Triggers notification logic at 10 RSVPs.
  * Body: `{ "userId": "integer" }`

* **`DELETE /events/:id/rsvp`**
  * Removes a user's RSVP from an event.
  * Body: `{ "userId": "integer" }`

* **`GET /events/:id/rsvps`**
  * Lists all users who RSVPd for a specific event.

### Notifications

* **`POST /notifications/test`**
  * Manually triggers a sample notification log for testing.

---

## 🧪 Testing with Postman

A Postman collection named `Reve.postman_collection.json` is included in the root of this repository.

You can import this file directly into Postman to have all 12 API endpoints (and their required bodies) pre-configured for easy testing.

## Example cURL Commands

You can also test all routes using cURL from your terminal.

## Users

### 1. Create User (Alice)

```bash
curl -X POST http://localhost:8000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Alice (Creator)\", \"email\":\"alice@example.com\"}"
```

### 2. Create User (Bob)

```bash
curl -X POST http://localhost:8000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Bob (Attendee)\", \"email\":\"bob@example.com\"}"
```

### 3. List All Users

```bash
curl http://localhost:8000/api/users
```

### 4. Get Single User (Alice)

```bash
curl http://localhost:8000/api/users/1
```

### 5. Create User (Validation Fail)

```bash
curl -X POST http://localhost:8000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Test\", \"email\":\"not-an-email\"}"
```

---

## Events

### 6. Create Event

```bash
curl -X POST http://localhost:8000/api/events -H "Content-Type: application/json" -d "{\"title\":\"Tech Conference 2025\", \"description\":\"The biggest tech conf of the year.\", \"date\":\"2025-12-01T10:00:00.000Z\", \"createdBy\":1}"
```

### 7. List Events (with Query Params)

```bash
curl "http://localhost:8000/api/events?upcoming=true"
```

### 8. Get Event Details (with RSVP Count)

```bash
curl http://localhost:8000/api/events/1
```

### 9. Update Event

```bash
curl -X PATCH http://localhost:8000/api/events/1 -H "Content-Type: application/json" -d "{\"title\":\"UPDATED: Tech Conference 2025\"}"
```

---

## RSVPs

### 10. RSVP to Event (Bob RSVPs)

```bash
curl -X POST http://localhost:8000/api/events/1/rsvp -H "Content-Type: application/json" -d "{\"userId\":2}"
```

### 11. List Users for Event

```bash
curl http://localhost:8000/api/events/1/rsvps
```

### 12. Remove RSVP

```bash
curl -X DELETE http://localhost:8000/api/events/1/rsvp -H "Content-Type: application/json" -d "{\"userId\":2}"
```

---

## Delete Logic & Notifications

### 13. Delete Event (Fail - Wrong User)

```bash
curl -X DELETE http://localhost:8000/api/events/1 -H "Content-Type: application/json" -d "{\"userId\":2}"
```

### 14. Delete Event (Success - Creator)

```bash
curl -X DELETE http://localhost:8000/api/events/1 -H "Content-Type: application/json" -d "{\"userId\":1}"
```

### 15. Test Notification

```bash
curl -X POST http://localhost:8000/api/notifications/test
```

---

## Additional Query Examples

### List Events with Limit

```bash
curl "http://localhost:8000/api/events?limit=10"
```

### List Events with Offset

```bash
curl "http://localhost:8000/api/events?offset=5"
```

### List Events with Multiple Params

```bash
curl "http://localhost:8000/api/events?upcoming=true&limit=10&offset=0"
```