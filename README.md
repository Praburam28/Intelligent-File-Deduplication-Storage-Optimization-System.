
<div align="center">

# 🗂️ Intelligent File Deduplication & Storage Optimization System

### 🚀 Find Duplicates. Save Space. Manage Files Intelligently.

A full-stack file management system that uses **SHA-256 hashing** to detect duplicate files, analyze storage usage, and manage files securely.

![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?style=flat-square)
![Alembic](https://img.shields.io/badge/Alembic-Migrations-6BA81E?style=flat-square)
![Celery](https://img.shields.io/badge/Celery-Background_Tasks-37814A?style=flat-square&logo=celery)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman)

</div>

---

## 📌 Overview

The **Intelligent File Deduplication & Storage Optimization System** identifies files containing identical data, even when their filenames differ. It provides file management, duplicate grouping, storage analytics, asynchronous hash processing, and deletion tracking through a modern web interface.

## ✨ Features

| Feature | Description |
|---|---|
| 📤 File Management | Upload, view, download, search, and delete files. |
| 🔍 Duplicate Detection | Identify matching content using SHA-256 hashes. |
| 🧩 Duplicate Groups | Organize matching files and identify originals and duplicates. |
| 📊 Storage Analytics | View storage usage, duplicate storage, and potential savings. |
| ⚙️ Background Processing | Process file hashes using Celery and Redis. |
| 🔐 Authentication | Secure supported API endpoints with JWT authentication. |
| 🛡️ Safe Deletion | Enforce protected-file rules and track deletions. |
| 🧾 History & Audit | Review deletion history and audit logs. |
| 📁 File Metadata | View file size, type, hash status, and upload details. |
| 📘 API Documentation | Explore endpoints using Swagger/OpenAPI and Postman. |

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| Backend | Python 3.14, FastAPI, Pydantic |
| Database | MySQL 8.0 |
| ORM & Migrations | SQLAlchemy, Alembic |
| Background Tasks | Celery, Redis |
| Authentication | JWT |
| Frontend | React, TypeScript, Vite |
| UI Components | Material UI |
| API Integration | Axios, REST APIs |
| Testing | Postman, Swagger/OpenAPI |
| DevOps | Docker, Docker Compose |
| Development Tools | VS Code, MySQL Workbench |

## 🏗️ System Architecture

```text
                 ┌─────────────────────────┐
                 │     React Frontend      │
                 │ TypeScript + Material UI│
                 └────────────┬────────────┘
                              │
                         REST API
                              │
                              ▼
                 ┌─────────────────────────┐
                 │     FastAPI Backend     │
                 │ Auth and File Services  │
                 └─────────┬───────────────┘
                           │
                 ┌─────────┴──────────┐
                 ▼                    ▼
        ┌─────────────────┐  ┌─────────────────┐
        │     MySQL       │  │  Celery Worker  │
        │ Metadata & Logs │  │ SHA-256 Hashing │
        └─────────────────┘  └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │      Redis      │
                             │   Task Broker   │
                             └─────────────────┘
```

## 🔄 How It Works

1. **Upload:** The user uploads a file through the frontend.
2. **Storage:** The backend stores the file and its database record.
3. **Hashing:** Celery processes file hashing asynchronously.
4. **Comparison:** The SHA-256 hash is compared with existing hashes.
5. **Grouping:** Matching files are organized into duplicate groups.
6. **Analytics:** The system calculates storage usage and potential savings.
7. **Management:** Users can review, download, and delete files according to the application's security rules.

## 📂 Project Structure

```text
intelligent-file-deduplication-system/
│
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── storage/
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

*The exact files and folders may vary depending on your project version.*

## ⚙️ Installation & Setup

### 1. Prerequisites

Install the following:

- Python 3.14
- Node.js and npm
- MySQL 8.0
- Docker Desktop
- Git

### 2. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd intelligent-file-deduplication-system
```

Replace the placeholder with your actual GitHub repository URL.

### 3. Create the MySQL Database

Run in MySQL Workbench:

```sql
CREATE DATABASE file_deduplication_db;
```

### 4. Set Up the Backend

Open PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory using `.env.example` as your template.

Example configuration:

```env
APP_NAME=Intelligent File Deduplication & Storage Optimization System
APP_VERSION=1.0.0
DEBUG=true
DATABASE_URL=mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/file_deduplication_db
JWT_SECRET_KEY=replace_with_a_secure_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FILE_STORAGE_PATH=storage
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

Adjust these settings to match your actual backend configuration. Never commit real passwords or secrets.

### 5. Apply Database Migrations

From the backend directory:

```powershell
alembic upgrade head
```

### 6. Start Redis

If Redis is not already running, start it with Docker:

```powershell
docker run -d --name dedup-redis -p 6379:6379 redis:7-alpine
```

Check the connection:

```powershell
docker exec dedup-redis redis-cli ping
```

Expected output:

```text
PONG
```

### 7. Start the Celery Worker

Open a separate terminal:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
celery -A app.celery_app.celery:celery_app worker --loglevel=info --pool=solo
```

Keep the worker running.

### 8. Start the FastAPI Backend

Open another terminal:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

API URL: `http://127.0.0.1:8000`

Swagger documentation: `http://127.0.0.1:8000/docs`

### 9. Start the Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, commonly `http://localhost:5173`.

> If your project uses Docker Compose to start these services, follow the existing Compose configuration instead of starting duplicate services.

## 🧪 API Testing with Postman

Use Swagger to check the actual API routes and request formats.

**Swagger URL:** `http://127.0.0.1:8000/docs`

Recommended testing sequence:

1. 🔐 Register and log in.
2. 🎟️ Obtain a JWT access token.
3. 📤 Upload a file.
4. 📋 List files and view metadata.
5. 🔁 Upload identical content using a different filename.
6. 🔍 Check duplicate detection and duplicate groups.
7. 📊 View storage statistics.
8. ⬇️ Download a file.
9. 🛡️ Test protected-file deletion.
10. 🧾 Check deletion history and audit logs.

## 🔒 Security & Backup

- 🔑 Use a strong JWT secret.
- 🚫 Never commit `.env` files or credentials.
- 🛡️ Validate file uploads and enforce ownership checks on the backend.
- 🔐 Enforce protected-file rules in backend code.
- 💾 Back up the MySQL database and the `backend/storage/` directory.
- 🌐 Use HTTPS and secure production settings when deploying.

## 🚀 Future Improvements

- [ ] Expand automated unit and integration tests.
- [ ] Improve large-file processing performance.
- [ ] Add configurable file retention and recovery.
- [ ] Expand storage analytics and reporting.
- [ ] Add production deployment and monitoring.

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request describing your improvements.

## 👨‍💻 Author

**Prabu Ram**


## 📄 License

Add a `LICENSE` file to the repository before specifying an open-source license.

---

<div align="center">

### ⭐ If you find this project useful, consider giving it a star!

**Built with Python · React · FastAPI · MySQL · Redis**

</div>
