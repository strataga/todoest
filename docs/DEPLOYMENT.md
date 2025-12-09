# Railway Deployment Guide

## Overview

This guide covers deploying the Todo application to Railway with two services:

- **API** (`apps/api`) - Express.js backend
- **Web** (`apps/web`) - React frontend

## Prerequisites

1. [Railway account](https://railway.app)
2. [Railway CLI](https://docs.railway.app/develop/cli) installed
3. GitHub repository with this code

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

#### Step 1: Create a New Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account and select this repository

#### Step 2: Deploy the API

1. In your Railway project, click **"New Service"**
2. Select **"GitHub Repo"** and choose this repo
3. Configure the service:
   - **Root Directory**: `apps/api`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `node dist/index.js`
4. Add environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3001` (Railway will override with `$PORT`)
5. Deploy and note the generated URL (e.g., `https://todo-api-xxx.railway.app`)

#### Step 3: Deploy the Web App

1. Click **"New Service"** again
2. Select **"GitHub Repo"** and choose this repo
3. Configure the service:
   - **Root Directory**: `apps/web`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `npx serve dist -s -l $PORT`
4. Add environment variables:
   - `VITE_API_URL`: Your API URL from Step 2 (e.g., `https://todo-api-xxx.railway.app/api`)
5. Deploy

#### Step 4: Configure CORS

1. Go back to your API service
2. Add environment variable:
   - `FRONTEND_URL`: Your web app URL (e.g., `https://todo-web-xxx.railway.app`)
3. Redeploy the API service

### Option 2: Deploy via CLI

```bash
# Login to Railway
railway login

# Create new project
railway init

# Link to existing project (if already created)
railway link

# Deploy API
cd apps/api
railway up

# Deploy Web (from project root)
cd ../web
railway up
```

## Environment Variables

### API Service (`apps/api`)

| Variable       | Description                       | Example                            |
| -------------- | --------------------------------- | ---------------------------------- |
| `NODE_ENV`     | Environment mode                  | `production`                       |
| `PORT`         | Server port (auto-set by Railway) | `3001`                             |
| `FRONTEND_URL` | Frontend URL for CORS             | `https://todo-web-xxx.railway.app` |

### Web Service (`apps/web`)

| Variable       | Description     | Example                                |
| -------------- | --------------- | -------------------------------------- |
| `VITE_API_URL` | Backend API URL | `https://todo-api-xxx.railway.app/api` |

## Using Nixpacks (Recommended)

Railway uses Nixpacks by default. Create these files for each service:

### `apps/api/nixpacks.toml`

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "pnpm"]

[phases.install]
cmds = ["pnpm install"]

[phases.build]
cmds = ["pnpm build"]

[start]
cmd = "node dist/index.js"
```

### `apps/web/nixpacks.toml`

```toml
[phases.setup]
nixPkgs = ["nodejs_20", "pnpm"]

[phases.install]
cmds = ["pnpm install", "npm install -g serve"]

[phases.build]
cmds = ["pnpm build"]

[start]
cmd = "serve dist -s -l $PORT"
```

## Troubleshooting

### CORS Errors

If you see CORS errors:

1. Verify `FRONTEND_URL` is set correctly on the API service
2. Make sure there's no trailing slash on the URL
3. Redeploy the API after changing environment variables

### Build Failures

1. Check that `pnpm-lock.yaml` is committed to the repo
2. Verify the root directory is set correctly for each service
3. Check Railway build logs for specific errors

### API Connection Issues

1. Verify `VITE_API_URL` includes `/api` at the end
2. Check that the API service is running (health check: `GET /health`)
3. Ensure the API URL uses HTTPS

## Monitoring

- View logs: Railway Dashboard → Service → Logs
- Check deployments: Railway Dashboard → Service → Deployments
- Monitor resources: Railway Dashboard → Service → Metrics

## Custom Domains

1. Go to your service in Railway Dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update `FRONTEND_URL` / `VITE_API_URL` accordingly
