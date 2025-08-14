# Railway Deployment Guide for Better Bible App

This guide will walk you through deploying your Better Bible App to Railway, including setting up environment variables, databases, and optimizing for production.

## 🚀 Quick Deploy to Railway

### 1. Connect Your Repository

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your Better Bible App repository
5. Railway will automatically detect it's a Next.js app

### 2. Set Up Environment Variables

In your Railway project dashboard, go to the "Variables" tab and add these environment variables:

```env
# Google Gemini AI API Key
GEMINI_API_KEY=AIzaSyBX4Q3dZXzdHIoHDSHX6i5Qhp8jS01wUds

# Runware AI API Key
RUNWARE_API_KEY=Bpu5CScHECsobs0n7gJwnGLacwWOnHZv

# Runware AI Configuration
RUNWARE_MODEL=runware:101@1
RUNWARE_API_URL=https://api.runware.com/v1/inference

# Railway-specific variables
NODE_ENV=production
PORT=3000
```

### 3. Add Database Service (Recommended)

For production, you'll want to replace the in-memory cache with a real database:

1. In your Railway project, click "New Service"
2. Choose "Database" → "PostgreSQL" (or "MongoDB" if you prefer)
3. Railway will automatically add the database connection variables
4. The database will be automatically connected to your app

## 🗄️ Database Integration

### Option 1: PostgreSQL (Recommended)

Railway provides PostgreSQL with automatic connection management. Update your app to use it:

```bash
npm install @railway/postgres
```

### Option 2: MongoDB

If you prefer MongoDB:

```bash
npm install mongodb
```

### Option 3: Redis (For Caching)

For high-performance caching:

```bash
npm install redis
```

## 🔧 Railway-Specific Optimizations

### 1. Health Checks

Railway automatically monitors your app using the health check endpoint. The `railway.json` file is already configured for this.

### 2. Auto-Scaling

Railway can automatically scale your app based on traffic. Enable this in your service settings.

### 3. Custom Domains

Railway provides free custom domains. Set this up in your service settings.

## 📊 Monitoring & Logs

### View Logs

- **Real-time logs**: View in Railway dashboard
- **Historical logs**: Access via Railway CLI

### Performance Monitoring

Railway provides built-in monitoring for:
- Response times
- Error rates
- Resource usage
- Request volume

## 🔒 Security Best Practices

### 1. Environment Variables

- ✅ Use Railway's built-in variable management
- ✅ Never commit API keys to your repository
- ✅ Use different keys for development/staging/production

### 2. API Rate Limiting

Consider adding rate limiting for production:

```bash
npm install express-rate-limit
```

### 3. Content Moderation

For production use, consider adding content moderation:

```bash
npm install @azure/ai-content-safety
```

## 🚀 Production Deployment Checklist

- [ ] Environment variables configured in Railway
- [ ] Database service added and connected
- [ ] API keys are valid and have sufficient quotas
- [ ] Health checks are passing
- [ ] Custom domain configured (optional)
- [ ] Auto-scaling enabled (optional)
- [ ] Monitoring alerts configured

## 🔄 Continuous Deployment

Railway automatically deploys when you push to your main branch. You can also:

1. **Manual deployments**: Trigger from Railway dashboard
2. **Preview deployments**: Create preview environments for PRs
3. **Rollback**: Quickly revert to previous deployments

## 📱 Railway CLI (Optional)

Install Railway CLI for advanced management:

```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Railway dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Environment Variable Issues**
   - Verify variables are set in Railway dashboard
   - Check variable names match your code
   - Ensure no typos in API keys

3. **Database Connection Issues**
   - Verify database service is running
   - Check connection variables are correct
   - Ensure database is accessible from your app

4. **API Rate Limits**
   - Monitor API usage in Railway logs
   - Implement caching to reduce API calls
   - Consider upgrading API plans if needed

### Getting Help

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **GitHub Issues**: Create an issue in your repository

## 🎯 Next Steps After Deployment

1. **Test all features** with your production API keys
2. **Monitor performance** and error rates
3. **Set up alerts** for critical issues
4. **Configure backup strategies** for your database
5. **Plan scaling strategies** as your user base grows

## 💰 Cost Optimization

Railway pricing is based on usage:

- **Free tier**: Available for development
- **Pay-as-you-go**: Only pay for what you use
- **Auto-scaling**: Automatically scale down during low traffic
- **Database**: Separate pricing for database services

Monitor your usage in the Railway dashboard to optimize costs.

---

Your Better Bible App is now ready for production deployment on Railway! 🎉
