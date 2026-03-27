# SwarIT

SwarIT is a real-time AI assistant platform powered by LiveKit, a Next.js frontend, a Node.js API backend, and a Python agent worker.

It combines:
- Real-time voice/video communication using LiveKit
- AI assistant orchestration in Python
- Data/API services in Express + MongoDB
- A modern web interface built with Next.js

## Architecture

```text
Frontend (Next.js)
	|
	| HTTP
	v
Frontend_backend (Node.js + Express + MongoDB)
	|
	| LiveKit room + events
	v
Backend (Python LiveKit Agent)
	|
	| Realtime media + LLM tools
	v
LiveKit Server (Docker)
```

## Prerequisites

- Node.js 18+
- pnpm 9+
- Python 3.10+
- Docker
- MongoDB connection string

## Quick Start

### 1. Start LiveKit (Docker)

```bash
docker run -p 7880:7880 -e LIVEKIT_KEYS="API4v8FGffQDLrQ: Blf455qdcFnEXHxbN3TkzSSTQSVNGJeVm96nJO9ovsr" livekit/livekit-server:latest
```

### 2. Start Frontend

```bash
cd Frontend
pnpm install
pnpm run dev
```

### 3. Start Node Backend API

```bash
cd Frontend_backend
npm install
node server.js
```

### 4. Start Python Agent Worker

```powershell
cd Backend
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
python agent.py dev
```

## Environment Variables

### Frontend_backend (.env)

```env
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
```

### Backend (.env)

```env
LIVEKIT_URL=<your-livekit-url>
LIVEKIT_API_KEY=<your-livekit-api-key>
LIVEKIT_API_SECRET=<your-livekit-api-secret>
```

## Project Structure

```text
SwarIT/
|- Frontend/           # Next.js UI
|- Frontend_backend/   # Express API + MongoDB routes
|- Backend/            # Python LiveKit AI agent
|- Dashboard/
|- Dashboard_backend/
|- ML/
```

## Run Order

Start services in this order for the smoothest experience:
1. LiveKit Docker container
2. Frontend (Next.js)
3. Frontend_backend (Node API)
4. Backend (Python agent)

## Notes

- Folder name is `Frontend_backend` (lowercase `b`).
- Use separate terminals for each running service.
- If port `7880` is already in use, stop the conflicting process or change the mapping.
