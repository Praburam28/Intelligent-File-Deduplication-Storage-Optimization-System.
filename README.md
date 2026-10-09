<div align="center">
🗂️ Intelligent File Deduplication & Storage Optimization System
🚀 Find duplicates. Save space. Manage files intelligently.
A full-stack file management platform that uses SHA-256 content hashing to identify duplicate files, track storage usage, estimate potential savings, and support secure file operations.
![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?style=flat-square)
![Alembic](https://img.shields.io/badge/Alembic-Migrations-6BA81E?style=flat-square)
![Celery](https://img.shields.io/badge/Celery-Background_Tasks-37814A?style=flat-square&logo=celery&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Task_Broker-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?style=flat-square&logo=docker&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-API_Testing-FF6C37?style=flat-square&logo=postman&logoColor=white)
</div>
---
📌 Overview
The Intelligent File Deduplication & Storage Optimization System is a full-stack application designed to make file storage easier to manage. It compares file content using SHA-256 hashes instead of relying only on filenames, allowing identical files to be identified even when their names differ.
The platform combines file management, duplicate grouping, storage analytics, background processing, and deletion history in one interface.
✨ Key Features
Feature	Description
📤 File Upload & Download	Upload, browse, view metadata, and download stored files.
🔍 Content-Based Deduplication	Identify identical content using SHA-256 hashes, independent of filenames.
🧩 Duplicate Groups	Group matching files and identify an original file and its duplicates.
📊 Storage Analytics	View file/storage totals, duplicate storage, and potential storage savings.
⚙️ Asynchronous Processing	Use Celery and Redis for background hash processing.
🛡️ Safe File Deletion	Respect protected-file rules and record deletion activity.
🧾 Deletion History	Review deletion records and associated file information.
🔎 Search & Filtering	Find files using available search and filtering controls.
🔐 JWT Authentication	Protect authenticated API operations.
📘 API Documentation	Explore endpoints through Swagger/OpenAPI and Postman.
🗃️ Database Migrations	Manage schema changes with Alembic.
🧱 Technology Stack
Backend
🐍 Python 3.14
⚡ FastAPI
🗃️ SQLAlchemy
🔄 Alembic
📦 Pydantic
🔐 JWT Authentication
🧵 Celery
🚀 Redis
Frontend
⚛️ React
🔷 TypeScript
⚡ Vite
🎨 Material UI
🌐 Axios
🧭 React Router
📈 Analytics visualizations
Database & Tools
🐬 MySQL 8.0
🐳 Docker & Docker Compose
🧪 Postman
📘 Swagger / OpenAPI
💻 VS Code
🗄️ MySQL Workbench
🏛️ High-Level Architecture
```text
                 ┌───────────────────────────────┐
                 │        React Frontend         │
                 │   TypeScript • Material UI    │
                 └───────────────┬───────────────┘
                                 │ HTTP / REST
                                 ▼
                 ┌───────────────────────────────┐
                 │        FastAPI Backend        │
                 │ Auth • Files • Duplicate APIs │
                 └───────┬───────────────┬───────┘
                         │               │
                         ▼               ▼
              ┌────────────────┐  ┌────────────────┐
              │   MySQL 8.0    │  │  Celery Worker │
              │ Metadata & Logs│  │ SHA-256 Hashing│
              └────────────────┘  └────────┬───────┘
                                           │
                                           ▼
                                  ┌────────────────┐
                                  │     Redis      │
                                  │ Task Broker    │
                                  └────────────────┘
```
🔁 How Deduplication Works
📤 A user uploads a file.
💾 The application stores the file and creates its database record.
⚙️ A background task calculates the file's SHA-256 hash.
🔍 The system compares the hash with previously processed hashes.
🧩 Files with matching hashes can be grouped as duplicates.
📊 The application updates duplicate and storage analytics.
🛡️ Users can review files and use the supported deletion workflow.
> **Note:** Matching hashes are used as the content-matching signal. Review files and maintain appropriate backups before deleting data.
📂 Project Structure
```text
intelligent-file-deduplication-system/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── ...
│   ├── alembic/
│   ├── storage/
│   ├── .env.example
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```
> Folder names may differ slightly by project version. Keep local secrets in `.env` files and never commit them.
⚙️ Getting Started
1. Prerequisites
Python 3.14
Node.js and npm
MySQL 8.0
Docker Desktop (for Redis or container setup)
Git
2. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd intelligent-file-deduplication-system
```
Replace `<YOUR_GITHUB_REPOSITORY_URL>` with your actual repository URL.
3. Configure MySQL
Create the database in MySQL Workbench:
```sql
CREATE DATABASE file_deduplication_db;
```
Use your own MySQL username and password in the backend configuration.
4. Configure the Backend
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```
Install dependencies using the project's dependency file. If `requirements.txt` exists:
```powershell
pip install -r requirements.txt
```
Create `backend/.env` using `.env.example` as a template. Example values (adjust to match your actual configuration):
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
Update names and values to match your project's configuration. Never commit `.env` or production secrets.
5. Run Database Migrations
From the backend directory with the virtual environment active:
```powershell
alembic upgrade head
```
6. Start Redis
If Redis is not running and Docker Desktop is available:
```powershell
docker run -d --name dedup-redis -p 6379:6379 redis:7-alpine
```
If the container already exists, start it:
```powershell
docker start dedup-redis
```
Verify Redis:
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
Keep the worker terminal running for asynchronous processing.
8. Start FastAPI
Open another terminal:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```
API base URL: `http://127.0.0.1:8000`
Swagger UI: `http://127.0.0.1:8000/docs`
9. Start the Frontend
Open another terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite (commonly `http://localhost:5173`).
> If your repository includes a Docker Compose workflow, follow its service configuration and environment requirements rather than starting duplicate services.
🧪 API Testing with Postman
Swagger: `http://127.0.0.1:8000/docs`
Suggested testing sequence:
🔐 Register and log in.
🎟️ Save the JWT access token.
📤 Upload a file.
📋 List files and inspect metadata.
📄 Upload the same content under a different filename.
🔍 Check duplicate detection and duplicate groups.
📊 Review storage statistics.
⬇️ Test file download.
🛡️ Test protected-file deletion rules.
🧾 Review deletion history and audit logs.
Check endpoint names and request schemas against the live Swagger documentation. Routes may vary by project version.
🔒 Security Notes
🔑 Use a strong, randomly generated JWT secret.
🚫 Never commit `.env`, passwords, access tokens, or private data.
🧑‍💻 Validate uploaded file types, sizes, and ownership.
🛡️ Enforce protected-file checks on the backend, not only in the UI.
🧾 Keep deletion and audit records for traceability.
💾 Back up the MySQL database and uploaded storage files together.
🌐 Use HTTPS and production-grade settings when deploying.
🗺️ Future Improvements
[ ] Add automated backend unit and integration tests.
[ ] Add configurable retention and recovery policies.
[ ] Improve large-file and concurrent-upload performance.
[ ] Add more detailed storage and deduplication reports.
[ ] Add production deployment and monitoring configuration.
🤝 Contributing
Contributions and suggestions are welcome.
Fork the repository.
Create a feature branch.
Commit your changes.
Open a pull request with a clear description.
👨‍💻 Author
Prabu Ram
Project: Intelligent File Deduplication & Storage Optimization System
📄 License
Add a `LICENSE` file before describing this project as open source under a particular license.
---
<div align="center">
⭐ If you find this project useful, consider giving it a star!
Built with 🐍 Python, ⚛️ React, 🐬 MySQL, and 🚀 Redis
</div>
