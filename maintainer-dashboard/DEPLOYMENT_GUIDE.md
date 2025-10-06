# 🚀 Deployment Guide - Complete Maintainer Dashboard

Your maintainer dashboard is now complete with advanced features! Here's how to deploy and run it.

## 🎯 **What's Included**

### **Advanced Features Added**
- ✅ **Sentiment Analysis**: Personality insights, trends, and heatmaps
- ✅ **Community Impact Calculator**: Contributor tracking and retention metrics
- ✅ **Enhanced Export**: JSON, CSV, and PDF export capabilities
- ✅ **Social Sharing**: Profile sharing with QR codes
- ✅ **Comprehensive Error Handling**: Robust error management
- ✅ **Responsive Design**: Works on all devices
- ✅ **Real-time Data**: Live GitHub API integration

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
# Install all dependencies
npm run install:all

# Or install individually
cd frontend && npm install
cd ../backend && npm install
```

### **2. Set Up Environment Variables**
```bash
# Copy environment files
cp backend/.env.example backend/.env

# Edit backend/.env with your GitHub token
GITHUB_TOKEN=your_github_token_here
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3002
```

### **3. Start the Application**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Port 3002
npm run dev:backend   # Port 5001
```

### **4. Access the Dashboard**
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:5001
- **Login**: username: `maintainer`, password: `password`

## 🔧 **Production Deployment**

### **Frontend Deployment (Vercel/Netlify)**

#### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-backend-url.com/api
```

#### **Netlify Deployment**
```bash
# Build frontend
cd frontend
npm run build

# Deploy dist folder to Netlify
# Set environment variables in Netlify dashboard
VITE_API_URL=https://your-backend-url.com/api
```

### **Backend Deployment (Railway/Heroku/DigitalOcean)**

#### **Railway Deployment**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up

# Set environment variables
railway variables set GITHUB_TOKEN=your_token
railway variables set NODE_ENV=production
railway variables set FRONTEND_URL=https://your-frontend-url.com
```

#### **Heroku Deployment**
```bash
# Install Heroku CLI
# Create Procfile in backend/
echo "web: node server.js" > backend/Procfile

# Deploy
cd backend
heroku create your-app-name
heroku config:set GITHUB_TOKEN=your_token
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.com
git push heroku main
```

### **Docker Deployment**

#### **Frontend Dockerfile**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### **Backend Dockerfile**
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

#### **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:5001/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - NODE_ENV=production
      - FRONTEND_URL=http://localhost:3000
    volumes:
      - ./backend/data:/app/data
```

## 🔐 **GitHub OAuth Setup**

### **1. Create GitHub OAuth App**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Maintainer Dashboard
   - **Homepage URL**: https://your-frontend-url.com
   - **Authorization callback URL**: https://your-backend-url.com/auth/github/callback

### **2. Get OAuth Credentials**
- Copy **Client ID** and **Client Secret**
- Add to your environment variables:
  ```env
  GITHUB_CLIENT_ID=your_client_id
  GITHUB_CLIENT_SECRET=your_client_secret
  ```

### **3. Update Frontend OAuth URL**
```javascript
// In frontend/src/pages/Login.tsx
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=${process.env.VITE_FRONTEND_URL}/auth/callback&scope=user:email,repo`;
```

## 📊 **Environment Variables**

### **Frontend (.env)**
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_AUTH_URL=https://your-backend-url.com/auth
VITE_FRONTEND_URL=https://your-frontend-url.com
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### **Backend (.env)**
```env
PORT=5001
NODE_ENV=production
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FRONTEND_URL=https://your-frontend-url.com
```

## 🧪 **Testing**

### **1. Local Testing**
```bash
# Test backend API
curl http://localhost:5001/api/health

# Test frontend
open http://localhost:3002

# Test with real GitHub data
curl "http://localhost:5001/api/dashboard?username=octocat"
```

### **2. Production Testing**
```bash
# Test API endpoints
curl https://your-backend-url.com/api/health
curl "https://your-backend-url.com/api/dashboard?username=octocat"

# Test frontend
open https://your-frontend-url.com
```

### **3. Feature Testing Checklist**
- [ ] **Authentication**: Login/logout works
- [ ] **Dashboard**: Real data loads
- [ ] **Sentiment Analysis**: Charts and insights display
- [ ] **Community Impact**: Metrics calculate correctly
- [ ] **Export**: JSON/CSV downloads work
- [ ] **Sharing**: Profile links work
- [ ] **Responsive**: Mobile/tablet/desktop layouts
- [ ] **Error Handling**: Graceful error messages

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Backend Won't Start**
```bash
# Check if port is in use
lsof -i :5001

# Kill process if needed
pkill -f "node server.js"

# Check environment variables
echo $GITHUB_TOKEN
```

#### **Frontend Build Fails**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

#### **API Calls Fail**
```bash
# Check CORS settings
# Verify API_URL in frontend
# Check GitHub token permissions
```

#### **GitHub API Rate Limits**
```bash
# Check rate limit status
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit

# Use caching (already implemented)
# Consider upgrading GitHub plan
```

### **Performance Optimization**

#### **Frontend**
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize bundle size

#### **Backend**
- Enable Redis caching
- Use database instead of JSON files
- Implement API rate limiting
- Add monitoring and logging

## 📈 **Monitoring & Analytics**

### **Health Checks**
```bash
# Backend health
curl https://your-backend-url.com/api/health

# Frontend health
curl https://your-frontend-url.com
```

### **Logging**
```javascript
// Backend logging
console.log('Server started on port', PORT);
console.log('GitHub API connected');

// Frontend logging
console.log('Dashboard loaded');
console.log('User authenticated');
```

### **Error Tracking**
- Add Sentry for error tracking
- Use LogRocket for user sessions
- Monitor API response times
- Track user engagement

## 🎉 **Success Criteria**

Your deployment is successful when:
- ✅ **Frontend loads** at your domain
- ✅ **Backend API responds** to health checks
- ✅ **GitHub OAuth** works for login
- ✅ **Real data** loads in all components
- ✅ **Export features** work correctly
- ✅ **Sharing** generates valid links
- ✅ **Mobile responsive** design works
- ✅ **Error handling** shows user-friendly messages

## 🚀 **Next Steps**

### **Immediate**
1. Deploy to production
2. Set up monitoring
3. Test all features
4. Share with users

### **Future Enhancements**
1. Add real-time notifications
2. Implement advanced analytics
3. Add team collaboration features
4. Integrate with more platforms
5. Add mobile app

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section
2. Review environment variables
3. Check GitHub API rate limits
4. Verify network connectivity
5. Check browser console for errors

Your maintainer dashboard is now production-ready with advanced features! 🎉