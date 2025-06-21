# Form-AI Backend

This is the backend service for [Form-AI](https://github.com/nalin-programmer/Form-AI), a dynamic, AI-powered form platform.  
It is built with [NestJS](https://nestjs.com/), uses MongoDB for storage, Redis for caching, and MinIO for file storage.

---

## Features

- RESTful API for forms and responses
- File upload and download via MinIO
- Swagger API documentation (`/api/docs`)
- CORS enabled for local frontend development
- Dockerized Redis and MinIO support

---

## Getting Started

### 1. **Clone the repository**

```bash
git clone <this-repo-url>
cd Form-AI-Backend
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Environment Variables**

Create a `.env` file in the root directory and set the following (example):

```
MONGODB_URI=mongodb://localhost:27017/form-ai
PORT=3000

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

---

## Running Services

### **Redis (Docker)**

```bash
docker pull redis
docker run -d --name redis -p 6379:6379 redis
```

### **MinIO (Docker Compose)**

```bash
minio-docker-compose -f docker
```
> Make sure you have a `docker-compose.yml` for MinIO or use your own setup.

---

## Running the Backend

```bash
npm run start:dev
```

The API will be available at:  
`http://localhost:3000/api`

Swagger docs:  
`http://localhost:3000/api/docs`

---

## Frontend

The frontend for this project is available at:  
[https://github.com/nalin-programmer/Form-AI](https://github.com/nalin-programmer/Form-AI)

---

## License

MIT