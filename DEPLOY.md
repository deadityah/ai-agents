# ResearchPilot — Phase 1 Deployment Guide

This guide covers deploying the backend to **Render** and the frontend to **Vercel** to verify live connectivity and CORS.

---

## 1. Push to GitHub

Ensure your working directory is committed and pushed:
```bash
git add .
git commit -m "Phase 1: backend skeleton, CORS config, and frontend live budget connection"
git push origin master
```

---

## 2. Deploy Backend to Render

1. Log into [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `researchpilot-backend` (or your choice)
   - **Region**: Oregon or closest to you
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
4. Under **Advanced**:
   - **Health Check Path**: `/health`
5. Under **Environment Variables**:
   - `PYTHON_VERSION`: `3.11.9`
   - `APP_ENV`: `production`
   - `ALLOWED_ORIGINS`: `http://localhost:3000` (you will add your Vercel URL in Step 4)
6. Click **Create Web Service**. Wait for build & deploy to complete.
7. Test the health check endpoint:
   ```bash
   curl -i https://<RENDER_SERVICE_NAME>.onrender.com/health
   # Must return HTTP 200 and {"status":"ok"}
   ```

---

## 3. Deploy Frontend to Vercel

1. Log into [Vercel Dashboard](https://vercel.com/) and click **Add New...** → **Project**.
2. Import the GitHub repository.
3. In project setup:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click edit and select `frontend`
4. Under **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://<RENDER_SERVICE_NAME>.onrender.com` (no trailing slash)
5. Click **Deploy**. Vercel will run `npm run build` and deploy.

---

## 4. Update CORS on Render

1. Copy your live Vercel production URL (e.g. `https://researchpilot.vercel.app`, no trailing slash).
2. Go back to Render → your Web Service → **Environment**.
3. Update `ALLOWED_ORIGINS` to include your Vercel URL:
   ```
   http://localhost:3000,https://<YOUR-PROJECT>.vercel.app
   ```
4. Save changes. Render will automatically redeploy with the new origins.

---

## 5. Live CORS Verification

Run these two test commands (replace with your real URLs):

```bash
# 1. Preflight OPTIONS test
curl -i -X OPTIONS https://<RENDER_SERVICE_NAME>.onrender.com/api/budget \
  -H "Origin: https://<YOUR-PROJECT>.vercel.app" \
  -H "Access-Control-Request-Method: GET"

# 2. GET request test
curl -i https://<RENDER_SERVICE_NAME>.onrender.com/api/budget \
  -H "Origin: https://<YOUR-PROJECT>.vercel.app"
```

**Check:**
Both responses must return HTTP 200 and include:
```http
access-control-allow-origin: https://<YOUR-PROJECT>.vercel.app
```

Then visit your live Vercel website in the browser:
- The header **BudgetPill** will show the backend's numbers (`14/80`) instead of the mock default (`12/80`).
- Hovering over the pill shows the local reset time in your local timezone.
