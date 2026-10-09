<div align="center">
🗂️ Intelligent File Deduplication & Storage Optimization System
Find duplicates. Save space. Manage files intelligently.
A full-stack file management application that uses SHA-256 content hashing to detect duplicate files, analyze storage usage, and support secure file operations.
<br>
<img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
<br>
<img src="https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?style=flat-square" alt="SQLAlchemy">
<img src="https://img.shields.io/badge/Alembic-Migrations-6BA81E?style=flat-square" alt="Alembic">
<img src="https://img.shields.io/badge/Celery-Background_Tasks-37814A?style=flat-square&logo=celery&logoColor=white" alt="Celery">
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis">
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white" alt="Postman">
</div>
---
📌 Overview
The Intelligent File Deduplication & Storage Optimization System helps users manage files and identify duplicate content. Rather than relying only on filenames, it uses SHA-256 hashes to compare file content. This allows files with different names to be recognized as duplicates when their content matches.
✨ Features
Feature	Description
📤 File Management	Upload, list, view metadata, download, and delete files.
🔍 Duplicate Detection	Compare file content using SHA-256 hashes.
🧩 Duplicate Groups	Group matching files and identify originals and duplicates.
📊 Storage Analytics	View storage totals, duplicate storage, and potential savings.
⚙️ Background Processing	Process file hashes asynchronously with Celery and Redis.
🔐 Authentication	Protect supported endpoints with JWT authentication.
🛡️ Safe Deletion	Apply protected-file checks and record deletion activity.
🧾 History & Audit	Review deletion history and audit log records.
🔎 Search & Filtering	Find files using supported search and filter options.
📘 API Documentation	Explore endpoints through Swagger/OpenAPI and Postman.
🧰 Technology Stack
Layer	Technologies
Backend	Python 3.14, FastAPI, Pydantic
Database & ORM	MySQL 8.0, SQLAlchemy, Alembic
Background Jobs	Celery, Redis
Authentication	JWT
Frontend	React, TypeScript, Vite, Material UI
API & Development Tools	Axios, React Router, Postman, Swagger/OpenAPI
Containers & Utilities	Docker, Docker Compose, VS Code, MySQL Workbench
🏛️ Architecture
```text
┌────────────────────────────────────┐
│           React Frontend           │
│      TypeScript · Material UI      │
└──────────────────┬─────────────────┘
                   │ REST API
                   ▼
┌────────────────────────────────────┐
│           FastAPI Backend          │
│    Auth · Files · Deduplication    │
└──────────────┬───────────────┬─────┘
               │               │
               ▼               ▼
┌─────────────────────┐  ┌─────────────────────┐
│      MySQL 8.0      │  │    Celery Worker    │
│   Metadata & Logs   │  │  SHA-256 Hashing    │
└─────────────────────┘  └──────────┬──────────┘
                                    │
                                    ▼
                           ┌─────────────────────┐
                           │        Redis        │
                           │     Task Broker     │
                           └─────────────────────┘
```
🔄 How It Works
Upload: A user uploads a file through the application.
Store: The backend stores the file and its database record.
Hash: A background task calculates its SHA-256 hash.
Compare: The system compares the hash with previously processed files.
Group: Matching content can be organized into duplicate groups.
Analyze: Storage analytics calculate duplicate usage and potential savings.
Manage: Users can review, download, and delete files according to the application's rules.
> **Important:** Review duplicate groups and keep suitable backups before deleting files.
📁 Project Structure
```text
intelligent-file-deduplication-system/
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── storage/
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```
The exact folders and filenames may differ by project version.
⚙️ Setup Guide
1. Prerequisites
Python 3.14
Node.js and npm
MySQL 8.0
Docker Desktop (for Redis or container services)
Git
2. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd intelligent-file-deduplication-system
```
Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual repository URL.
3. Create the Database
Run in MySQL Workbench:
```sql
CREATE DATABASE file_deduplication_db;
```
4. Configure the Backend
Run these commands in PowerShell:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```
Create `backend/.env` using `.env.example` as a template. Example values:
```env
APP_NAME=Intelligent File Deduplication & Storage Optimization System
APP_VERSION=1.0.0
DEBUG=true
DATABASE_URL=mysql+pymysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/file_deduplication_db
JWT_SECRET_KEY=replace_with_a_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FILE_STORAGE_PATH=storage
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```
Adjust variable names and values to match your project's configuration. Never commit `.env` or real credentials.
5. Run Database Migrations
From the backend directory:
```powershell
alembic upgrade head
```
6. Start Redis
If Redis is not already running and Docker Desktop is available:
```powershell
docker run -d --name dedup-redis -p 6379:6379 redis:7-alpine
```
If the container already exists, start it:
```powershell
docker start dedup-redis
```
Check Redis:
```powershell
docker exec dedup-redis redis-cli ping
```
Expected output:
```text
PONG
```
7. Start the Celery Worker
Open a second terminal:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
celery -A app.celery_app.celery:celery_app worker --loglevel=info --pool=solo
```
Keep this terminal running.
8. Start the FastAPI Backend
Open another terminal:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```
Service	URL
API	`http://127.0.0.1:8000`
Swagger UI	`http://127.0.0.1:8000/docs`
9. Start the Frontend
Open another terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite, commonly `http://localhost:5173`.
> If your repository uses Docker Compose for these services, follow its configuration and environment requirements to avoid starting duplicate services.
🧪 Postman Testing
Use Swagger to confirm the exact endpoint paths and request schemas:
Swagger UI: `http://127.0.0.1:8000/docs`
Recommended test sequence:
🔐 Register and log in.
🎟️ Save the JWT access token.
📤 Upload a file.
📋 List files and inspect metadata.
🔁 Upload the same content with a different filename.
🔍 Check duplicate status and duplicate groups.
📊 Review storage statistics.
⬇️ Download a file.
🛡️ Test protected-file deletion.
🧾 Review deletion history and audit logs.
Confirm endpoint names and request schemas against the live Swagger documentation. Routes may vary by project version.
🔒 Security & Backup Notes
🔑 Use a strong, randomly generated JWT secret.
🚫 Never commit `.env` files, credentials, access tokens, or private data.
🧑‍💻 Validate uploaded files and enforce ownership checks on the backend.
🛡️ Enforce protected-file rules in backend logic, not only in the UI.
💾 Back up the MySQL database and the backend `storage/` directory.
🌐 Use HTTPS and production-grade configuration when deploying.
🛣️ Future Improvements
[ ] Add automated backend unit and integration tests.
[ ] Improve large-file and concurrent-upload performance.
[ ] Add configurable retention and recovery policies.
[ ] Expand storage and deduplication reports.
[ ] Add production deployment and monitoring configuration.
🤝 Contributing
Fork the repository.
Create a feature branch.
Commit your changes.
Open a pull request with a clear description.
👨‍💻 Author
Prabu Ram
📄 License
Add a `LICENSE` file before claiming a specific open-source license.
---
<div align="center">
⭐ If you find this project useful, consider giving it a star!
Built with 🐍 Python · ⚛️ React · 🐬 MySQL · 🚀 Redis
</div>
