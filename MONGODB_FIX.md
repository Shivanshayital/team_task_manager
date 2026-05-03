# MongoDB Connection Troubleshooting

## Current Issue
The error `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net` indicates MongoDB Atlas cannot be reached.

## Step 1: Verify Environment Variables in Railway

Go to your Railway project → **Variables** and ensure you have:

```
MONGODB_URI=mongodb+srv://shivanshnayitall_db_user:Shivansh%400987@cluster0.vfe9xn2.mongodb.net/taskmanager
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
PORT=8080
```

**Note:** Railway is using PORT=8080, not 5000.

## Step 2: Check MongoDB Atlas Configuration

### 2.1 Network Access
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your project → **Network Access**
3. Click **Add IP Address**
4. Add: `0.0.0.0/0` (Allow Access from Anywhere)
5. Save

### 2.2 Database User
1. Go to **Database Access**
2. Ensure user `shivanshnayitall_db_user` exists
3. Verify password is correct
4. User should have **Read and write** permissions

### 2.3 Cluster Status
1. Go to **Clusters**
2. Ensure cluster `cluster0` is **running**
3. Note the exact cluster name

## Step 3: Test Connection String

Your current URI format should be:
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

Replace with your actual values:
- **username**: `shivanshnayitall_db_user`
- **password**: `Shivansh@0987` (URL encoded as `Shivansh%400987`)
- **cluster**: `cluster0.vfe9xn2` (check exact name in Atlas)
- **database**: `taskmanager`

## Step 4: Alternative Connection String Format

If SRV records don't work, try the standard format:

```
mongodb://shivanshnayitall_db_user:Shivansh%400987@cluster0-shard-00-00.vfe9xn2.mongodb.net:27017,cluster0-shard-00-01.vfe9xn2.mongodb.net:27017,cluster0-shard-00-02.vfe9xn2.mongodb.net:27017/taskmanager?ssl=true&replicaSet=atlas-abc123-shard-0&authSource=admin&retryWrites=true&w=majority
```

## Step 5: Redeploy in Railway

After fixing the MongoDB configuration:

1. Go to Railway project
2. Click **Deployments**
3. Click **Redeploy** on the latest deployment

## Quick Test

You can test the connection locally first:

```bash
# In your server directory
MONGODB_URI="your_connection_string_here" node -e "
import mongoose from 'mongoose';
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected successfully');
  process.exit(0);
} catch (err) {
  console.log('❌ Connection failed:', err.message);
  process.exit(1);
}
"
```

## Expected Result

Once MongoDB connects, you should see:
```
Server running on port 8080
Environment: production
MongoDB connected successfully
```

Then your app will be fully deployed! 🚀