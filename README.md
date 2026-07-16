# 2026_camp

This is the website of game "Monopoly" in NTUEE camp for freshman!

2022: By rayray2002, jerry1249756 and hackhaha1\
2023: By lin-1214\
2024: By trix0831\
2026: By kosu516, liftleaf1105, and ozone0107

## Development
### Install packages
```bash
yarn install-all
```

### Env Config
- Create `backend/.env` (git-ignored) with your MongoDB connection string:
```bash
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/?appName=<app>
```

- Before any commits, add `backend/.env` into `.gitignore` to avoid pushing your own MongoDB connection string up to the origin and keep real credentials only in `backend/.env`.

### Frontend
```bash
cd frontend
yarn start
```

### Backend
```bash
cd backend
yarn initdata
yarn server
```
## Deployment
### Local
```bash
yarn build-frontend
yarn start
```

### Docker
#### Build and Run
```bash
docker compose up -d --build
```

Compose builds the web image locally; no application image is pushed to or
pulled from Docker Hub.

#### Init
```bash
bash scripts/initdb.sh
```
