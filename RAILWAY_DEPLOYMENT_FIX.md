# Railway Deployment Guide

## Fixed Issues
- ✅ Corrected `railway.json` typo (enviromentVariables → environmentVariables)
- ✅ Added proper build command in Procfile
- ✅ Created `.railwayrc.json` for Railway-specific configuration
- ✅ Created `.env.example` for environment documentation
- ✅ Updated package.json build and postinstall scripts

## Deployment Steps

### 1. Push Changes to GitHub
```powershell
git add .
git commit -m "Fix Railway deployment configuration"
git push origin main
```

### 2. Go to Railway Dashboard
1. Visit [Railway.app](https://railway.app)
2. Go to your project
3. Click the service/deployment that's failing

### 3. Set Environment Variables in Railway
In your Railway project, go to **Variables** and add:

```
MONGODB_URI=mongodb+srv://shivanshnayitall_db_user:Shivansh%400987@cluster0.vfe9xn2.mongodb.net/taskmanager
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
PORT=5000
```

### 4. Trigger Redeploy
1. Click **Deployments** tab
2. Find your failed deployment
3. Click the three dots (...) → **Redeploy**
   
OR go to **Settings** → **Redeploy on Push** to auto-deploy on git push

### 5. Monitor Build
- Watch the build logs in Railway dashboard
- Check for any errors in the build output
- Once successful, your app will start automatically

## Troubleshooting

### Build Fails
- Check that both `client/` and `server/` have `package.json`
- Ensure `npm run build` works locally:
  ```powershell
  npm run build
  npm start
  ```

### Application Won't Start
- Verify `MONGODB_URI` is correct and MongoDB Atlas IP whitelist includes Railway's IPs
- Check `JWT_SECRET` is set
- Review server logs in Railway dashboard

### Routes Not Working
- Make sure `NODE_ENV=production` is set
- Frontend should be at `/`
- API routes should be at `/api/*`

## Quick Commands

```powershell
# Test locally
npm install
npm run build
npm start

# Check if server can connect to MongoDB
# Visit http://localhost:5000/api/health
```

## Support
If deployment still fails:
1. Check Railway build logs for specific errors
2. Ensure all environment variables are set
3. Verify MongoDB connection string and IP whitelist
4. Test the build locally first with `npm run build && npm start`
