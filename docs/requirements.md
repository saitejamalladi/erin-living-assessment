# Scheduler Service - Requirements & Architecture

## 1. Project Overview

The goal of this project is to build a scalable, resilient backend service designed to schedule and deliver recurring notifications (starting with Birthdays) to users based on their local timezone. The system is designed to separate the "User Profile" from the "Notification Logic," allowing for easy extension to other event types (e.g., Anniversaries) in the future.

## 2. Technical Stack

* **Language:** TypeScript
* **Framework:** NestJS (Modular Architecture)
* **Database:** MongoDB (via Mongoose)
* **Queue/Messaging:** BullMQ (Redis-based)
* **Scheduler:** Node-Cron
* **Logging:** `nestjs-pino` (JSON structural logging)
* **Runtime/Infrastructure:** Docker & Docker Compose
* **Testing:** Jest (Unit Testing / TDD)

## 3. Functional Requirements

### 3.1 User Management (API)

The system exposes a RESTful API to manage User profiles.

* **Create User (`POST /user`):**
* **Input:**
* `firstName` (String)
* `lastName` (String)
* `dateOfEvent` (Date: YYYY-MM-DD) *<-- Renamed from dob*
* `location` (String: IANA Timezone, e.g., "Australia/Melbourne")
* `notificationType` (String: Enum `['BIRTHDAY']` - *Only 'BIRTHDAY' supported for MVP*)


* **Logic:**
* Creates the User profile document.
* Creates a corresponding document in the `Notifications` collection.
* Calculates and stores the `nextRunAt` (9:00 AM local time converted to UTC).




* **Update User (`PUT /user/:id`):**
* **Input:** `firstName`, `lastName`, `location`.
* **Immutability Constraint:** `dateOfEvent` and `notificationType` **cannot** be updated.
* If a user wishes to change the date or event type, they must delete the profile and create a new one.


* **Logic:**
* Updates `firstName`, `lastName`, or `location`.
* **Trigger:** If `location` changes, the system must recalculate the `nextRunAt` for the existing notification based on the immutable `dateOfEvent`.




* **Delete User (`DELETE /user/:id`):**
* Hard delete the User.
* **Cascade:** Must delete all associated documents in the `Notifications` collection to prevent orphaned jobs.



### 3.2 Notification Lifecycle

* **Trigger:** Notifications trigger when `Notification.nextRunAt <= UTC NOW`.
* **Message Format:** "Hey, {firstName} {lastName} it's your {notificationType}".
* **Delivery:** HTTP POST to an external RequestBin.
* **Recurrence:** After a successful send, the `nextRunAt` must be updated to 9:00 AM local time of the following year.

### 3.3 Reliability & Recovery

* **Downtime Recovery:** The Producer query (`nextRunAt <= NOW`) ensures that if the service sleeps for 24 hours, it processes all missed events immediately upon waking.
* **Idempotency:** A state-machine approach (`SCHEDULED` vs `PROCESSING`) prevents duplicate messages during concurrent cron execution.

## 4. System Architecture

The solution uses a **Producer-Consumer** pattern with **Data Normalization**.

### 4.1 Schema Design (Normalization)

To satisfy the "Extensibility" requirement, we separate identity from scheduling.

* **User Collection:** Stores strictly profile data and the invariant event date (`dateOfEvent`).
* **Notification Collection:** Stores scheduling logic (`nextRunAt`) and status.

### 4.2 The Producer (Scheduler Cron)

* **Frequency:** Runs every 15 minutes.
* **Responsibility:**
1. Query `Notifications` collection for `status: 'SCHEDULED'` AND `nextRunAt <= NOW`.
2. **Atomic Lock:** Update status to `PROCESSING` to claim the job.
3. Push job payload to BullMQ.



### 4.3 The Queue (BullMQ)

* **Rate Limiting:** configured to prevent overwhelming the external RequestBin API (e.g., max 10 jobs per second).
* **Retries:** Automatic retry with exponential backoff for transient errors.

### 4.4 The Consumer (Worker Processor)

* **Responsibility:**
1. Fetch User details (for name/timezone).
2. Send HTTP Request.
3. **On Success:**
* Update `nextRunAt` to next year.
* Update `status` back to `SCHEDULED`.
* Log `audit.lastDeliveredAt`.


4. **On Failure:**
* Log `audit.lastError` and `audit.retryCount`.
* Throw error to let BullMQ handle retry backoff.





### 4.5 Infrastructure & Security

* **Docker Compose:**
* Must define services for `redis` and `mongo`.
* **Authentication:** Must initialize Redis and MongoDB with a `root` username and password.
* **Environment Variables:** The application must consume these same credentials via `.env` file to connect securely.



## 5. Data Model

### 5.1 User Collection

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | Unique ID |
| `firstName` | String |  |
| `lastName` | String |  |
| `location` | String | IANA Timezone (e.g., "Australia/Melbourne") |
| `dateOfEvent` | Date | The date of the recurring event (Birthday/Anniversary) |
| `timestamps` | Date | `createdAt`, `updatedAt` |

### 5.2 Notification Collection

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | Unique ID |
| `userId` | Ref | Link to User |
| `type` | Enum | `'BIRTHDAY'` (MVP) |
| `status` | Enum | `'SCHEDULED'`, `'PROCESSING'`, `'FAILED'` |
| `nextRunAt` | Date | UTC timestamp of next execution |
| `audit` | Object | `{ lastDeliveredAt, failureReason, retryCount }` |

## 6. Assumptions

* **Timezone:** Invalid IANA timezones in the input will be rejected by the API validation pipe.
* **Network:** Redis and MongoDB are available within the Docker network via the service names defined in `docker-compose.yml`.

## 7. Future Enhancements

* **Anniversary Messages:** System supports this by allowing the API to accept `notificationType: 'ANNIVERSARY'`.
* **Leap Year Handling:** Current logic adds 1 year (365 days). Future domain logic needed for Feb 29th handling.