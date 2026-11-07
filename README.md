# Load Profile Manager
1. `docker compose up -d`   (starts Postgres)
2. `npm install`
3. `npm run db:push`        (creates tables)
4. `npm run dev`            -> http://localhost:3000 (website) and /app (the tool)
Add a client, open it, click "Add month", pick year/month and upload the .xlsx (several files allowed).
