# Erin Living Assessment - Event Notification Scheduler

A scalable, event-driven birthday notification system built with NestJS, MongoDB, and Redis. This application automatically schedules and sends birthday notifications for users based on their timezone and date of birth.

## 🚀 Features

- **User Management**: Create, update, and delete user profiles with timezone support
- **Automatic Scheduling**: Birthday notifications scheduled based on user's local time
- **Queue-Based Processing**: Asynchronous job processing with BullMQ and Redis
- **Timezone Aware**: Handles different timezones correctly using Luxon
- **RESTful API**: Complete REST API with validation and error handling
- **Web Interface**: Simple HTML form for user creation
- **Comprehensive Testing**: 40+ unit tests with 70%+ coverage
- **Docker Ready**: Full containerization with Docker Compose
- **API Documentation**: Swagger/OpenAPI documentation

## 🏗️ Architecture

The system follows an event-driven producer-consumer architecture:
![alt text](docs/images/architecture.png)

- **Scheduler (Producer)**: Runs every 15 minutes to find due notifications and queue jobs
- **Worker (Consumer)**: Processes queued jobs to send HTTP notifications
- **API**: REST endpoints for user and notification management
- **Database**: MongoDB for user profiles and notification schedules
- **Queue**: Redis/BullMQ for job queuing and processing

## � System Flows

### User Onboarding Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant API as User Controller
    participant Service as User Service
    participant UserRepo as User Collection
    participant NotifRepo as Notification Collection

    Client->>API: POST /user <br/>{ name, dateOfEvent, timezone, type }
    API->>Service: createUser(dto)
    
    Note right of Service: <b>Step 1: Save Profile</b>
    Service->>UserRepo: create({ profileData })
    UserRepo-->>Service: userDoc
    
    Note right of Service: <b>Step 2: Calculate Schedule</b><br/>Convert 9AM local time to UTC<br/>based on user's timezone.
    Service->>Service: calculateNextRunAt(dateOfEvent, timezone)
    
    Note right of Service: <b>Step 3: Save Schedule</b>
    Service->>NotifRepo: create({ userId, nextRunAt, status: 'SCHEDULED' })
    
    Service-->>API: Success
    API-->>Client: 201 Created

```

### Scheduler (Producer) Flow

```mermaid
sequenceDiagram
    autonumber
    participant Cron as Node-Cron
    participant Prod as Producer Service
    participant DB as MongoDB
    participant Queue as BullMQ (Redis)

    Note over Cron: Triggered every 15 mins

    Cron->>Prod: handleCron()
    
    Note right of Prod: <b>Recovery Query:</b><br/>Finds tasks where time <= NOW.<br/>Catches up even if service was down 24h.
    Prod->>DB: find({ <br/>status: 'SCHEDULED', <br/>nextRunAt: { $lte: new Date() } <br/>})
    DB-->>Prod: Returns [Notif A, Notif B]
    
    loop For Each Notification
        Note right of Prod: <b>Atomic Lock:</b><br/>Prevents double-processing.
        Prod->>DB: updateOne(<br/>{ _id: A, status: 'SCHEDULED' },<br/>{ $set: { status: 'PROCESSING' } }<br/>)
        
        alt Lock Successful
            Prod->>Queue: addJob('notification-job', { notifId, userId })
        else Lock Failed
            Prod->>Prod: Skip (Another worker took it)
        end
    end

```

### Worker (Consumer) Flow

```mermaid
sequenceDiagram
    autonumber
    participant Queue as BullMQ
    participant Worker as Consumer Service
    participant DB as MongoDB
    participant Ext as RequestBin (API)

    Queue->>Worker: Process Job { notifId, userId }
    
    Worker->>DB: findUser(userId)
    DB-->>Worker: { firstName, lastName }
    
    alt User Exists
        Worker->>Ext: POST https://requestbin.com
        
        alt External API Success
            Note right of Worker: <b>Recurrence Logic:</b><br/>Add 1 year to nextRunAt.<br/>Release lock.
            Worker->>DB: updateOne({ <br/>nextRunAt: +1 Year, <br/>status: 'SCHEDULED' <br/>})
            Worker->>Queue: Job Completed
        else External API Failed
            Worker->>Queue: Throw Error (Triggers Retry)
            Note right of Queue: BullMQ retries 
        end
        
    else User Not Found (Deleted)
        Worker->>Queue: Job Discarded
    end
```

*For more details and interactive diagrams, refer to the [Technical Design Document](docs/tech-design.md).*

## �🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | NestJS |
| Language | TypeScript |
| Database | MongoDB |
| Queue | Redis/BullMQ |
| Date/Time | Luxon |
| Validation | class-validator |
| Logging | Pino |
| Testing | Jest |
| Container | Docker |

## 📋 Prerequisites

- Node.js 22+ and npm
- Docker and Docker Compose
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd erin-living-assessment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Infrastructure

```bash
# Start MongoDB and Redis
docker-compose up -d mongo redis
```

### 4. Configure Environment

Copy the environment template and adjust settings:

```bash
cp .env.example .env
# Edit .env with your database credentials and webhook URL
```

### 5. Run the Application

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### 6. Access the Application

- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health


## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🐳 Docker Deployment

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB free RAM
- Ports 3000, 27017, 6379, 6380 available

### Environment Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd erin-living-assessment
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start infrastructure services**:
   ```bash
   # Start MongoDB and Redis
   docker-compose up -d mongo redis
   ```

### Development Deployment

```bash
# Start all services in development mode
npm run docker:dev

# Or manually:
docker-compose up

# View application logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Database Schema

The application uses MongoDB with the following collections:
- `users`: User profiles with timezone information
- `notifications`: Scheduled notification jobs

## 📚 API Documentation

Complete API documentation is available via Swagger at `/api` when the application is running.

Key endpoints:
- `POST /user` - Create user
- `PUT /user/:id` - Update user
- `DELETE /user/:id` - Delete user
- `POST /scheduler/trigger` - Manually trigger scheduler
- `GET /health` - Health check

