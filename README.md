# Redis Intro

A small Node.js and Express project demonstrating Redis patterns, including cached JSON and hash data, expiring OTPs, Redis lists, and publish/subscribe. It also includes a Bull-style email queue example.

## Requirements

- Node.js and npm
- Docker Desktop (for the included Redis and MongoDB services)

## Setup

1. Start the services:

   ```sh
   docker compose up -d
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the project root:

   ```dotenv
   REDIS_URL=redis://localhost:6379
   MONGODB_URL=mongodb://localhost:27017/redis-intro
   ```

   The server requires `REDIS_URL` at startup. `MONGODB_URL` is used if the MongoDB connection helper is called.

4. Start the server:

   ```sh
   npm start
   ```

The API listens on `http://localhost:3000`.

## Endpoints

All request bodies should be JSON.

| Route | Methods | Purpose |
|---|---|---|
| `/` | `GET` | Basic hello response |
| `/health` | `GET` | Basic health response |
| `/redis` | `GET` | Reads the Redis key `test` |
| `/mongodb` | `GET` | Returns a static MongoDB message |
| `/site-banner/:id` | `GET`, `POST`, `DELETE` | Store, retrieve, or delete a banner in Redis |
| `/site-banner/:id/exists` | `GET` | Check whether a banner exists |
| `/user-profile/:id` | `GET`, `POST`, `DELETE` | Store, retrieve, or delete a JSON user profile |
| `/user-profile/:id/exists` | `GET` | Check whether the JSON profile exists |
| `/user-profile/:id/hset` | `GET`, `POST`, `DELETE` | Store, retrieve, or delete user fields as a Redis hash |
| `/user-profile/:id/hset/exists` | `GET` | Check whether the hash contains a `name` field |
| `/otp-ttl` | `POST` | Create an OTP with a five-minute expiration |
| `/otp-ttl/verify` | `POST` | Verify an OTP |
| `/otp-ttl/:phone/ttl` | `GET` | Read the remaining OTP TTL in seconds |
| `/email-queue` | `POST` | Add an email job to a Redis list |
| `/email-queue/process-one` | `GET` | Remove and return one email job from the list |
| `/bull-mq` | `POST` | Add an email job to the queue example |
| `/pub-sub` | `POST` | Publish an email message |

Example requests:

```sh
curl -X POST http://localhost:3000/user-profile/123 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"phone\":\"555-0100\"}"

curl http://localhost:3000/user-profile/123

curl -X POST http://localhost:3000/otp-ttl \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"555-0100\"}"
```

## Project layout

- `src/config/` — Redis and MongoDB connection helpers
- `src/site-banner/` — Redis-backed banner records
- `src/user-profile/` — JSON-string and hash storage examples
- `src/otp-ttl/` — OTP storage, verification, and expiration
- `src/email-queue/` — Redis-list email queue
- `src/bull-mq/` — queue-based email job example
- `src/pub-sub/` — Redis publisher and subscriber example

Stop the local services with `docker compose down`. The named Docker volumes preserve Redis and MongoDB data; remove them with `docker compose down -v` if you want to delete that data.
