# Run locally (development and production)

Development (recommended): run backend and frontend in separate terminals.

1. Install dependencies:
```bash
cd server
npm install

cd ../client
npm install
```

2. Start backend (dev):
```bash
cd server
npm run dev
```

3. Start frontend (Vite):
```bash
cd client
npm run dev
```

Production-like (serve built frontend from Express):

1. Build the client:
```bash
cd client
npm run build
```

2. Start the server in production mode:
```powershell
$env:NODE_ENV = 'production'
node server/server.js
```

The server will serve the frontend build from `client/dist` and API routes under `/api`.

Environment variables:
- `MONGODB_URI` (required)
- `JWT_SECRET` (required)
- `PORT` (optional, default 5000)
