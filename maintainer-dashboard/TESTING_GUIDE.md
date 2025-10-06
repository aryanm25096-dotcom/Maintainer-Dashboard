# 🧪 Testing Guide - Figma Frontend Connected to Backend

Your maintainer dashboard is now fully connected with real data! Here's how to test all the functionality.

## 🚀 **Quick Start Testing**

### **1. Start Both Servers**
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should show: Server running on port 5001

# Terminal 2 - Frontend  
cd frontend
npm run dev
# Should show: Local: http://localhost:3002
```

### **2. Access the Dashboard**
- Open http://localhost:3002
- Login with: username: `maintainer`, password: `password`
- Or click "Sign in with GitHub" for demo mode

## ✅ **Test All Features**

### **🔐 Authentication Testing**
- [ ] **Demo Login**: Use credentials `maintainer` / `password`
- [ ] **GitHub OAuth**: Click "Sign in with GitHub" (demo mode)
- [ ] **Logout**: Click logout button
- [ ] **Session Persistence**: Refresh page, should stay logged in

### **📊 Dashboard Overview Testing**
- [ ] **Real Metrics**: Numbers should load from backend API
- [ ] **Refresh Data**: Click "Sync Data" button
- [ ] **Export JSON**: Click "JSON" button, file should download
- [ ] **Export CSV**: Click "CSV" button, file should download
- [ ] **Export PDF**: Click "PDF" button, should show message
- [ ] **Share Profile**: Click "Share Profile", link should copy to clipboard
- [ ] **Recent Activity**: Should show real activity data
- [ ] **Top Repositories**: Should show repository statistics

### **🔍 PR Reviews Testing**
- [ ] **Sentiment Charts**: Pie chart should show real sentiment data
- [ ] **Personality Radar**: Should show personality insights
- [ ] **Trend Charts**: Line chart should show trends over time
- [ ] **PR List**: Should show real pull requests
- [ ] **Approve/Reject**: Click buttons to update PR status
- [ ] **Time Range Filter**: Change dropdown, charts should update
- [ ] **Loading States**: Should show spinners while loading

### **📋 Issue Triage Testing**
- [ ] **Search Issues**: Type in search box, issues should filter
- [ ] **Priority Filter**: Select priority, issues should filter
- [ ] **Status Filter**: Select status, issues should filter
- [ ] **Repository Filter**: Select repo, issues should filter
- [ ] **Export Issues**: Click JSON/CSV buttons, files should download
- [ ] **Share Issues**: Click share button, link should copy
- [ ] **Update Priority**: Change priority dropdown
- [ ] **Close Issues**: Click close button
- [ ] **Charts**: Issue type pie chart should show real data
- [ ] **Efficiency Chart**: Line chart should show trends

### **👥 Profile Page Testing**
- [ ] **Profile Data**: Should show real GitHub profile info
- [ ] **Avatar**: Should display user avatar
- [ ] **Statistics**: Should show real follower/following counts
- [ ] **Repositories**: Should list top repositories
- [ ] **Export Profile**: JSON/CSV export should work
- [ ] **Share Profile**: Share button should copy link
- [ ] **Repository Links**: External link buttons should work

### **📈 Analytics Testing**
- [ ] **Charts Load**: All charts should display data
- [ ] **Real Data**: Charts should show actual metrics
- [ ] **Responsive**: Charts should resize with window
- [ ] **Interactive**: Hover over charts for tooltips

## 🔧 **Backend API Testing**

### **Test API Endpoints Directly**
```bash
# Health check
curl http://localhost:5001/api/health

# Dashboard data (with GitHub token)
curl "http://localhost:5001/api/dashboard?username=octocat"

# Reviews data
curl "http://localhost:5001/api/reviews?username=octocat"

# Issues data
curl "http://localhost:5001/api/issues?username=octocat"

# Profile data
curl "http://localhost:5001/api/profile/octocat"
```

### **Test with Real GitHub Data**
1. Get a GitHub Personal Access Token
2. Add to `backend/.env`:
   ```env
   GITHUB_TOKEN=your_token_here
   ```
3. Restart backend server
4. Test with real GitHub username

## 🎨 **Design Preservation Testing**

### **Visual Design**
- [ ] **Colors**: All colors match Figma design
- [ ] **Typography**: Fonts and sizes match design
- [ ] **Spacing**: Layout and spacing preserved
- [ ] **Components**: All UI components look identical
- [ ] **Responsive**: Design works on different screen sizes
- [ ] **Dark Mode**: Theme switching works (if implemented)

### **Interactive States**
- [ ] **Hover Effects**: Buttons and cards have hover states
- [ ] **Loading States**: Spinners match design theme
- [ ] **Error States**: Error messages styled correctly
- [ ] **Success States**: Success toasts styled correctly

## 🐛 **Error Handling Testing**

### **Network Errors**
- [ ] **Backend Down**: Stop backend, frontend should show error
- [ ] **API Errors**: Backend should return proper error messages
- [ ] **Timeout**: Long requests should timeout gracefully
- [ ] **Invalid Data**: Malformed API responses should be handled

### **User Input Errors**
- [ ] **Invalid Login**: Wrong credentials should show error
- [ ] **Empty Fields**: Required fields should validate
- [ ] **Invalid URLs**: Bad links should be handled
- [ ] **File Upload**: Invalid files should be rejected

## 📱 **Responsive Testing**

### **Desktop (1920x1080)**
- [ ] **Full Layout**: All components visible
- [ ] **Charts**: Charts display properly
- [ ] **Tables**: Tables show all columns
- [ ] **Navigation**: Sidebar fully visible

### **Tablet (768x1024)**
- [ ] **Responsive Grid**: Grid adapts to screen size
- [ ] **Charts**: Charts resize appropriately
- [ ] **Navigation**: Sidebar collapses if needed
- [ ] **Touch**: Touch interactions work

### **Mobile (375x667)**
- [ ] **Mobile Layout**: Layout adapts to mobile
- [ ] **Charts**: Charts are readable on mobile
- [ ] **Navigation**: Mobile navigation works
- [ ] **Touch**: All buttons are touch-friendly

## 🚀 **Performance Testing**

### **Loading Performance**
- [ ] **Initial Load**: Page loads in < 3 seconds
- [ ] **Data Loading**: API calls complete in < 2 seconds
- [ ] **Chart Rendering**: Charts render smoothly
- [ ] **Navigation**: Page transitions are fast

### **Memory Usage**
- [ ] **No Memory Leaks**: Memory usage stays stable
- [ ] **Chart Performance**: Multiple charts don't slow down
- [ ] **Data Caching**: Repeated requests use cache

## 🔄 **Data Flow Testing**

### **Real-time Updates**
- [ ] **Data Refresh**: Clicking refresh updates data
- [ ] **State Management**: State updates correctly
- [ ] **Cache Invalidation**: Old data is cleared
- [ ] **Error Recovery**: Errors don't break the app

### **User Interactions**
- [ ] **Button Clicks**: All buttons respond
- [ ] **Form Submissions**: Forms submit correctly
- [ ] **Filter Changes**: Filters update data
- [ ] **Search**: Search works in real-time

## 📊 **Data Accuracy Testing**

### **API Data**
- [ ] **Correct Numbers**: Metrics show real values
- [ ] **Data Format**: Data is properly formatted
- [ ] **Date Handling**: Dates display correctly
- [ ] **Null Values**: Missing data is handled

### **Export Data**
- [ ] **CSV Format**: CSV files are properly formatted
- [ ] **JSON Format**: JSON files are valid
- [ ] **Data Completeness**: Exports include all data
- [ ] **File Names**: Files have descriptive names

## 🎯 **Success Criteria**

Your dashboard is working correctly if:
- ✅ All pages load with real data
- ✅ All interactive features work
- ✅ Export functionality works
- ✅ Search and filtering work
- ✅ Design matches Figma exactly
- ✅ No console errors
- ✅ Responsive design works
- ✅ Performance is good

## 🐛 **Common Issues & Solutions**

### **Backend Not Starting**
```bash
# Check if port is in use
lsof -i :5001
# Kill process if needed
pkill -f "node server.js"
```

### **Frontend Not Loading**
```bash
# Check if port is in use
lsof -i :3002
# Try different port
PORT=3003 npm run dev
```

### **API Errors**
- Check backend logs for errors
- Verify GitHub token is valid
- Check network connectivity
- Clear browser cache

### **Data Not Loading**
- Check browser console for errors
- Verify API endpoints are working
- Check if backend is running
- Try refreshing the page

## 🎉 **Testing Complete!**

If all tests pass, your maintainer dashboard is fully functional with:
- Real GitHub data integration
- Interactive components
- Export functionality
- Search and filtering
- Exact Figma design preservation
- Production-ready performance

Your dashboard is ready for real maintainers to use! 🚀