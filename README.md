# Box Logistics MVP

A modern logistics platform for temporary storage and delivery of self-packed boxes using distributed partner locations and integrated courier services.

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: FastAPI + PostgreSQL
- Database: PostgreSQL
- Authentication: JWT
- QR Code: react-html5-qrcode
- Realtime: WebSocket
- Deployment: Docker + Railway/Vercel

## Features

- Mobile-first PWA interface
- Box registration via QR code
- Real-time tracking of box status
- Role-based dashboards (User, Courier, Partner, Admin)
- Public API for partner integration
- Secure authentication system

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   npm install
   ```

3. Start development:
   ```bash
   # Development with Docker
   docker-compose up --build
   ```

4. Access the app:
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs
   - Admin Dashboard: http://localhost:3000/admin

## Project Structure

```
box-logistics-mvp/
├── backend/           # FastAPI backend
├── frontend/          # React frontend
├── docker/           # Docker configurations
├── scripts/          # Seed data and utilities
└── tests/           # Test files
```
