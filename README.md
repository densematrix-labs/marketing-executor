# Marketing Executor

AI-powered marketing content generator for tech founders. Stop planning, start launching.

## Features

- **Twitter/X Posts** - Generate 5 tweets from different angles
- **LinkedIn Post** - Professional announcement post
- **Reddit Template** - Post body + best subreddit recommendations
- **Product Hunt** - Tagline, description, and maker's first comment
- **Email Templates** - Cold outreach, partnership, and press templates
- **Launch Checklist** - Step-by-step launch tasks

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI
- **AI**: LLM Proxy (Claude)
- **i18n**: 7 languages (EN, ZH, JA, DE, FR, KO, ES)

## Development

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Deployment

```bash
# Create .env from example
cp .env.example .env
# Edit .env with your LLM_PROXY_KEY

# Deploy with Docker
docker compose up -d --build
```

## Ports

- Frontend: 30192
- Backend: 30193

## License

MIT
