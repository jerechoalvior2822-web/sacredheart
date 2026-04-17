# Sacred Heart Parish - Render Deployment Guide (Individual Services)

## Overview
You will deploy **2 separate services** on Render:
1. **Backend** (Node.js API) 
2. **Frontend** (React/Vite Static Site)

---

## Step 1: Prepare Your GitHub Repository

```bash
# Make sure everything is committed
cd "c:\xampp\htdocs\sacred heart"
git status
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

If you don't have Git initialized:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/sacred-heart.git
git branch -M main
git push -u origin main
```

---

## Step 2: Create MySQL Database on Render

1. Go to **[render.com](https://render.com)** and sign in
2. Click **New +** → **MySQL**
3. Fill in:
   - **Database**: `sacred_heart_db`
   - **Username**: `sacred_heart_user` (or choose your own)
   - **Password**: (generate strong password - copy this!)
   - **Region**: Choose closest to you
   - **Plan**: Starter (free tier)

4. Click **Create Database**
5. **Wait 2-3 minutes** for it to initialize
6. Once ready, copy these from the connection details:
   - **Host**: `<your-db>.render.com`
   - **Port**: `3306`
   - **Database**: `sacred_heart_db`
   - **Username**: `sacred_heart_user`
   - **Password**: (what you created)

⚠️ **Save these credentials - you'll need them in Step 3**

---

## Step 3: Deploy Backend Service

### 3.1 Create Web Service

1. Go to **[render.com](https://render.com)** dashboard
2. Click **New +** → **Web Service**
3. Select **GitHub** (connect if needed)
4. Search and select your repository: `sacred-heart`
5. Click **Connect**

### 3.2 Configure Backend

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `sacred-heart-backend` |
| **Environment** | `Node` |
| **Region** | Same as database |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `node backend/server.js` |
| **Plan** | Free |

### 3.3 Add Environment Variables

Click **Add Environment Variable** and add these one by one:

```
NODE_ENV = production
PORT = 3001
DB_HOST = <your-db>.render.com (from Step 2)
DB_PORT = 3306
DB_NAME = sacred_heart_db
DB_USER = sacred_heart_user (from Step 2)
DB_PASSWORD = <password from Step 2>
FRONTEND_URL = https://sacred-heart-frontend.onrender.com (we'll get this from Step 4)
```

⚠️ **Don't add FRONTEND_URL yet** - we'll update it after deploying the frontend

### 3.4 Deploy

Click **Create Web Service**

Wait for deployment (5-10 minutes). You'll see:
- ✅ Build successful
- ✅ Service running

**Copy your backend URL** (looks like: `https://sacred-heart-backend.onrender.com`)

---

## Step 4: Deploy Frontend Service

### 4.1 Create Static Site

1. Go to **[render.com](https://render.com)** dashboard
2. Click **New +** → **Static Site**
3. Select your GitHub repository again
4. Click **Connect**

### 4.2 Configure Frontend

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `sacred-heart-frontend` |
| **Region** | Same as backend |
| **Branch** | `main` |
| **Build Command** | `npm run build` |
| **Publish Directory** | `dist` |
| **Plan** | Free |

### 4.3 Add Environment Variable

Click **Add Environment Variable**:

```
VITE_API_URL = https://sacred-heart-backend.onrender.com
```

(Use the backend URL from Step 3.4)

### 4.4 Deploy

Click **Create Static Site**

Wait for deployment (3-5 minutes).

**Copy your frontend URL** (looks like: `https://sacred-heart-frontend.onrender.com`)

---

## Step 5: Update Backend with Frontend URL

Now that you know the frontend URL, update the backend:

1. Go back to **Backend Service** in Render dashboard
2. Click **Settings** → **Environment**
3. Find `FRONTEND_URL` variable
4. Update it to your frontend URL: `https://sacred-heart-frontend.onrender.com`
5. Click **Save** (service will restart automatically)

---

## Step 6: Verification

### Test Backend API
```
https://sacred-heart-backend.onrender.com/api/health
```
(Or any endpoint to verify it's working)

### Visit Frontend
```
https://sacred-heart-frontend.onrender.com
```

Should load without errors. Try:
- ✅ Login page loads
- ✅ Try logging in
- ✅ Navigate to different pages
- ✅ Check browser console for errors

### If you see CORS errors:
- Wait 5 minutes for CORS changes to propagate
- Clear browser cache (Ctrl+Shift+Delete)
- Try in incognito window

---

## Troubleshooting

### Backend won't start
- Check logs: Backend service → Logs
- Look for database connection errors
- Verify DB credentials in environment variables
- Ensure DB_HOST includes full hostname with `.render.com`

### Frontend shows blank page
- Check console for errors (F12 → Console)
- Verify `VITE_API_URL` environment variable is set
- Wait for backend to fully deploy first

### Database connection failed
- Go to MySQL service → Info
- Verify host/port/credentials match exactly
- Wait for MySQL to be fully initialized (5 min after creation)

### Files not uploading
- Free tier uses ephemeral storage (files lost on restart)
- Solution: Upgrade to Paid plan with Persistent Disk
- Or: Use AWS S3/Cloudinary for image storage

---

## Your URLs

After deployment, save these:

| Service | URL |
|---------|-----|
| **Frontend** | `https://sacred-heart-frontend.onrender.com` |
| **Backend** | `https://sacred-heart-backend.onrender.com` |
| **Database** | `<hostname>.render.com` |

---

## Important Reminders

⚠️ **Free Tier Limits:**
- No persistent storage (files deleted on restart)
- Limited database size (500MB)
- May experience delays during off-peak usage
- Free instances may "spin down" after 15 min inactivity

✅ **For Production:**
- Upgrade to Paid plans for persistent storage
- Implement AWS S3 for file uploads
- Set up proper backups
- Monitor performance

---

## Quick Reference

| Step | What to Do | Time |
|------|-----------|------|
| 1 | Push code to GitHub | 5 min |
| 2 | Create MySQL database | 5 min |
| 3 | Deploy backend | 10 min |
| 4 | Deploy frontend | 5 min |
| 5 | Update backend FRONTEND_URL | 1 min |
| 6 | Test everything | 5 min |
| **Total** | | **~30 minutes** |

---

Need help? Check the logs in your Render dashboard for specific error messages.
