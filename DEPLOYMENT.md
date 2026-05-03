# Deployment Guide

## Railway Deployment (Backend)

### Step 1: Prepare Your Backend

Ensure your server has:
- `server.js` as entry point
- `package.json` with start script
- `.env` with production values
- MongoDB URI (use MongoDB Atlas)

### Step 2: Create Railway Project

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project
4. Select your repository

### Step 3: Configure Environment Variables

In Railway dashboard, add:
```
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret_key
NODE_ENV=production
```

Note: This repository includes a sample env file at `server/.env.example` and a root `Procfile` to help Railway detect and run the backend. Set `MONGODB_URI` and `JWT_SECRET` in Railway's Environment variables before deploying.

### Step 4: Deploy

Railway will automatically detect Node.js and deploy. Your backend will be available at:
```
https://your-project-name.up.railway.app
```

## Vercel/Netlify Deployment (Frontend)

### Step 1: Build for Production

```bash
cd client
npm run build
```

This creates a `dist` folder with optimized build.

### Step 2: Deploy to Vercel

```bash
npm install -g vercel
vercel
```

During setup, set environment variable:
```
VITE_API_URL=https://your-railway-backend-url/api
```

### Step 3: Deploy to Netlify

1. Push `dist` folder to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL`

## MongoDB Atlas Setup

### Create Free Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account
3. Create free cluster
4. Create database user
5. Whitelist IP addresses
6. Get connection string

Example connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS
- [ ] Set up MongoDB backups
- [ ] Configure CORS for your domain
- [ ] Update API URL in frontend
- [ ] Test all features in production
- [ ] Monitor logs and errors
- [ ] Set up email notifications (optional)

## Troubleshooting

### 404 on Frontend Routes
- Clear Netlify cache
- Ensure `public` folder redirects to index.html
- Check routing configuration

### Backend Connection Issues
- Verify MongoDB connection string
- Check IP whitelist on MongoDB Atlas
- Ensure environment variables are set

### CORS Issues
- Update backend CORS settings for production domain
- Check API URL in frontend .env

## Performance Optimization

### Backend
- Enable gzip compression
- Use production MongoDB indexes
- Implement caching (Redis)
- Monitor database performance

### Frontend
- Use lazy loading for routes
- Optimize images
- Enable code splitting
- Use CDN for static assets

---

Your application is now ready for production! 🚀

## Single-repo deployment (Railway / Heroku style)

You can deploy the frontend and backend together from this repository. The server will serve the built frontend when `NODE_ENV=production`.

1. Ensure the following environment variables are set in the Railway project settings:
```
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret_key
NODE_ENV=production
PORT=5000
```

2. Railway will run `npm install` and then `npm start`. This repository includes a `heroku-postbuild` script that builds the client during deploy, so the server will serve the built client automatically.

3. Confirm the service URL and set `VITE_API_URL` in any separate frontend deployment to point to `https://<your-railway-app>.up.railway.app/api` if you deploy the frontend separately.

Notes:
- Static serving is enabled in `server/server.js` when `NODE_ENV=production`.
- The root `Procfile` contains `web: npm start` to help platform detect the web process.
