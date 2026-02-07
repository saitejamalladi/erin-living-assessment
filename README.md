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

- **Scheduler (Producer)**: Runs every 15 minutes to find due notifications and queue jobs
- **Worker (Consumer)**: Processes queued jobs to send HTTP notifications
- **API**: REST endpoints for user and notification management
- **Database**: MongoDB for user profiles and notification schedules
- **Queue**: Redis/BullMQ for job queuing and processing

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | NestJS | 10.x |
| Language | TypeScript | 5.x |
| Database | MongoDB | 7.x |
| Queue | Redis/BullMQ | 5.x |
| Date/Time | Luxon | 3.x |
| Validation | class-validator | 0.14.x |
| Logging | Pino | 8.x |
| Testing | Jest | 29.x |
| Container | Docker | 24.x |

## 📋 Prerequisites

- Node.js 18+ and npm
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

Copy the `.env` file and adjust settings if needed:

```bash
cp .env.example .env  # if exists, otherwise use provided .env
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

## 📖 API Usage

### Create a User

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "location": "America/New_York",
    "dateOfEvent": "1990-01-01"
  }'
```

### Update a User

```bash
curl -X PUT http://localhost:3000/user/{userId} \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe"
  }'
```

### Delete a User

```bash
curl -X DELETE http://localhost:3000/user/{userId}
```

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

### Development

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Production

```bash
# Build and run
docker-compose -f docker-compose.yml up --build
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Application port |
| `MONGO_URI` | `mongodb://localhost:27017/erin-living` | MongoDB connection string |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6380` | Redis port (6380 for local dev, 6379 in Docker) |
| `REDIS_PASSWORD` | `password` | Redis password |

### Database Configuration

The application uses MongoDB with the following collections:
- `users`: User profiles with timezone information
- `notifications`: Scheduled notification jobs

## 📊 Monitoring

### Health Checks

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "database": "connected"
}
```

### Logs

The application uses structured JSON logging with Pino. In development:
```bash
npm run start:dev  # Logs to console
```

In production, logs are JSON formatted for log aggregation tools.

## 🔍 Troubleshooting

### Common Issues

#### Redis Connection Failed
**Error**: `ECONNREFUSED` when connecting to Redis

**Solution**:
- Ensure Redis is running: `docker-compose up -d redis`
- Check Redis port in `.env` (6380 for local, 6379 in Docker)
- Verify Redis password matches

#### MongoDB Connection Failed
**Error**: Database connection timeout

**Solution**:
- Start MongoDB: `docker-compose up -d mongo`
- Check connection string in `.env`
- Ensure MongoDB is healthy: `docker-compose ps`

#### Port Already in Use
**Error**: `EADDRINUSE` on port 3000

**Solution**:
- Kill existing process: `lsof -ti:3000 | xargs kill -9`
- Change port in `.env`: `PORT=3001`

#### Static Files Not Serving
**Error**: HTML form not loading at root URL

**Solution**:
- Ensure `public/index.html` exists
- Check ServeStaticModule configuration in `app.module.ts`
- Restart the application

### Debug Mode

Enable debug logging:
```bash
DEBUG=* npm run start:dev
```

## 📚 API Documentation

Complete API documentation is available via Swagger at `/api` when the application is running.

Key endpoints:
- `POST /user` - Create user
- `PUT /user/:id` - Update user
- `DELETE /user/:id` - Delete user
- `POST /scheduler/trigger` - Manually trigger scheduler
- `GET /health` - Health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Date handling by [Luxon](https://moment.github.io/luxon/)
- Queue management by [BullMQ](https://docs.bullmq.io/)
- Testing with [Jest](https://jestjs.io/)
