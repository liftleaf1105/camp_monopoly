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

- Optional Google Sheets backup config. The backup sync overwrites the latest
  game snapshot into the configured spreadsheet in the background after
  successful game-state updates.
```bash
BACKUP_ENABLED=true
BACKUP_SHEET_ID=1YaqCaYkRtzvCZ2jQHa8tYWq-kdW6wwV6TJJX5cVJVS0
GOOGLE_CLIENT_EMAIL=<service-account-email>
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
BACKUP_DEBOUNCE_MS=1000
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

Run one backup sync manually:
```bash
cd backend
yarn backup:sync
```
## Deployment
### Local
```bash
yarn build-frontend
yarn start
```

### Docker
#### Build and Push
```bash
bash scripts/build_and_push.sh
```

#### Run
```bash
# Simple
docker-compose up -d
# Pull and Run
bash scripts/run.sh
```

#### Init
```bash
bash scripts/initdb.sh
```
