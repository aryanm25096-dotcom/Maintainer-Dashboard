# 🚀 Complete Setup Guide

Your maintainer dashboard is now fully functional with both frontend and backend! Here's how to get everything running.

## 📋 **Prerequisites**

- Node.js 18+ installed
- A GitHub account (for real data)
- Git (optional, for version control)

## 🔧 **Quick Start**

### **1. Install Dependencies**
```bash
# Install all dependencies (root, frontend, and backend)
npm run install:all
```

### **2. Set Up GitHub Integration (Optional)**
```bash
# Copy environment file
cp backend/.env.example backend/.env

# Edit backend/.env and add your GitHub token
# Get token from: https://github.com/settings/tokens
```

### **3. Start Both Servers**
```bash
# Start frontend and backend together
npm run dev
```

This will start:
- **Frontend**: http://localhost:3002
- **Backend**: http://localhost:5001

## 🎯 **What You Get**

### **Frontend (React + Figma Design)**
- ✅ Complete dashboard with your exact Figma design
- ✅ Interactive components with real functionality
- ✅ React Router for navigation
- ✅ State management with React Context
- ✅ Real-time data from backend API

### **Backend (Node.js + GitHub API)**
- ✅ Express server with CORS enabled
- ✅ Real GitHub API integration
- ✅ Sentiment analysis for PR reviews
- ✅ Smart caching to avoid rate limits
- ✅ Complete API endpoints for all dashboard data

## 🔑 **GitHub Setup (For Real Data)**

### **1. Get a GitHub Personal Access Token**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `user`, `read:org`
4. Copy the token

### **2. Configure Backend**
```bash
# Edit backend/.env
GITHUB_TOKEN=your_token_here
```

### **3. Test with Real Data**
```bash
# Test API with real GitHub data
curl "http://localhost:5001/api/dashboard?username=YOUR_GITHUB_USERNAME"
```

## 🎨 **Using the Dashboard**

### **Login Options**
1. **GitHub OAuth**: Click "Sign in with GitHub" (requires OAuth setup)
2. **Demo Mode**: Use username: `maintainer`, password: `password`

### **Dashboard Features**
- **Overview**: Real metrics, recent activity, top repositories
- **PR Reviews**: Sentiment analysis, personality insights, approve/reject actions
- **Issue Triage**: Status management, priority updates, filtering
- **Mentorship**: Contributor tracking, activity monitoring
- **Analytics**: Charts and trends with real data
- **Profile**: Shareable maintainer profile

## 🔄 **Development Workflow**

### **Frontend Development**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3002
```

### **Backend Development**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5001
```

### **API Testing**
```bash
# Health check
curl http://localhost:5001/api/health

# Dashboard data
curl "http://localhost:5001/api/dashboard?username=octocat"

# PR reviews with sentiment
curl "http://localhost:5001/api/reviews?username=octocat"
```

## 📊 **Data Sources**

### **With GitHub Token**
- Real user profile and repositories
- Actual PR reviews and issues
- Live contributor statistics
- Sentiment analysis of real comments

### **Without GitHub Token (Demo Mode)**
- Sample data from JSON files
- Mock sentiment analysis
- Simulated metrics and trends
- Full functionality for testing

## 🛠 **Customization**

### **Adding New API Endpoints**
1. Add route in `backend/server.js`
2. Update `frontend/src/services/api.ts`
3. Use in React components with `useApp()` context

### **Modifying Sentiment Analysis**
```javascript
// In backend/server.js
function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  // Customize analysis logic here
  return result;
}
```

### **Updating Caching**
```javascript
// Change cache duration (in minutes)
await setCachedData(cacheKey, data, 60); // 1 hour cache
```

## 🚀 **Production Deployment**

### **Frontend (Vercel/Netlify)**
1. Build: `npm run build`
2. Deploy `frontend/build` folder
3. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

### **Backend (Railway/Heroku)**
1. Set environment variables
2. Deploy `backend/` folder
3. Ensure GitHub token is configured

## 🔍 **Troubleshooting**

### **Port Conflicts**
```bash
# Kill existing processes
pkill -f "node server.js"
pkill -f "vite"

# Start on different ports
PORT=5002 npm run dev:backend
PORT=3003 npm run dev:frontend
```

### **GitHub API Errors**
- Check if token has correct permissions
- Verify token is not expired
- Check rate limits (API calls are cached)

### **CORS Issues**
- Ensure frontend URL is in backend CORS settings
- Check if both servers are running

## 📈 **Performance Features**

- **Smart Caching**: Reduces GitHub API calls
- **Error Handling**: Graceful fallbacks
- **Loading States**: Better user experience
- **Responsive Design**: Works on all devices

## 🎉 **Success!**

Your maintainer dashboard is now:
- ✅ Fully functional with real data
- ✅ Beautiful design preserved from Figma
- ✅ Interactive components working
- ✅ Backend API providing real GitHub data
- ✅ Sentiment analysis for insights
- ✅ Ready for production deployment

Enjoy your new maintainer dashboard! 🚀