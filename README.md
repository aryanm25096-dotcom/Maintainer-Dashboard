# Full-Stack Web App

A modern full-stack web application built with React, TypeScript, Node.js, Express, PostgreSQL, Prisma, and Supabase.

## ✨ Features

- ⚛️ **React 18** with TypeScript
- 🎨 **Tailwind CSS** for styling
- 🌙 **Dark theme** support with system preference detection
- 🔐 **GitHub OAuth** authentication via Supabase
- 🗄️ **PostgreSQL** database with Prisma ORM
- ☁️ **Supabase** integration for backend-as-a-service
- 🚀 **Express.js** backend with TypeScript
- 📱 **Responsive design** with mobile-first approach
- 🔒 **JWT authentication** with secure token handling
- 🛡️ **Rate limiting** and security middleware
- 🎯 **Protected routes** and role-based access

### 🏆 Maintainer Dashboard Features

- 📊 **Dashboard Overview** with comprehensive metrics and analytics
- 🔍 **PR Reviews** with sentiment analysis and filtering
- 🎯 **Issue Triage** tracking and community management
- 👥 **Mentorship Activities** monitoring and impact assessment
- 📈 **Community Impact Calculator** with scoring algorithms
- 🌐 **Shareable Profile** pages for public showcase
- 🔄 **GitHub API Integration** for real-time data synchronization
- 📊 **Advanced Analytics** with trends and insights

### 🧠 Advanced Sentiment Analysis Features

- 🤖 **AI-Powered Sentiment Analysis** with OpenAI integration
- 📊 **Sentiment Visualization** with interactive charts and graphs
- 🎭 **Personality Analysis** with maintainer trait assessment
- 📈 **Trend Analysis** with time-based sentiment tracking
- 🗺️ **Repository Heatmaps** showing sentiment by project
- 💡 **Smart Insights** with communication recommendations
- ⚠️ **Burnout Detection** with risk assessment
- 🔄 **Real-time Processing** with caching and rate limiting

### 🎯 Advanced Community Impact Calculator

- 📊 **Comprehensive Impact Metrics** with contributor retention and repository health analysis
- 🎯 **Impact Score Cards** with visual summaries and trend indicators
- 📈 **Contributor Retention Charts** showing return rates and growth patterns
- 🏥 **Repository Health Analysis** with before/after metrics comparison
- 👥 **Mentorship Success Timeline** tracking guidance activities and outcomes
- 🔮 **Predictive Analytics** with short-term, medium-term, and long-term impact predictions
- 💡 **AI-Powered Insights** with actionable recommendations for improvement
- 📤 **Export & Share** functionality with PDF/CSV export and social sharing
- 🎛️ **Advanced Filtering** by repository, date range, and contributor
- 📱 **Responsive Design** with mobile-friendly interface and dark theme support

### 📊 Interactive Analytics & Visualization

- 📈 **ActivityTimelineChart**: Stacked/area charts showing maintainer activities over time
- 🗓️ **MonthlyActivityHeatmap**: Calendar-style heatmap of daily activities and sentiment
- 📊 **RepositoryComparisonBar**: Compare metrics across multiple repositories
- 🔄 **ContributorFunnelChart**: Visual contributor journey from first contact to maintainer
- 🎯 **Interactive Drill-down**: Click for detailed views of repositories and contributors
- 📱 **Responsive Tooltips**: Rich tooltips with loading states and error handling
- 🎨 **Multiple Chart Types**: Area, line, bar, funnel, and pie chart visualizations
- 🔍 **Advanced Filtering**: Filter by time range, repository, contributor, and activity type

### 🌐 Shareable Profile & Export Features

- 📤 **ShareableProfileCard**: Comprehensive profile with social sharing
- 🔗 **Multiple Share Options**: Twitter, LinkedIn, email, and native sharing
- 📄 **Export Formats**: PDF, PNG, SVG export with customizable templates
- 📱 **QR Code Generation**: Generate QR codes for easy profile sharing
- 🏆 **Achievement System**: Display maintainer achievements and milestones
- 📊 **Activity Timeline**: Show recent activity with detailed breakdowns
- 🌟 **Repository Showcase**: Highlight top repositories with metrics
- 🔄 **Real-time Updates**: Live profile updates with social integration

### 📤 Shareable Profile & Export Features

- 🌐 **Public Profile Pages**: SEO-optimized public profiles with unique URLs
- 📱 **QR Code Generation**: Mobile-friendly QR codes for easy sharing
- 📄 **PDF Export**: High-quality PDF export of dashboard and profile pages
- 📊 **CSV Export**: Comprehensive CSV export of activity and impact metrics
- 🔗 **Social Sharing**: Twitter, LinkedIn, GitHub, email, and native sharing
- 🏷️ **Open Graph Meta Tags**: Rich previews when shared on social media
- 🎯 **SEO Optimization**: Structured data and meta tags for search engines
- 📱 **Mobile Responsive**: Optimized for all device sizes and screen readers
- ♿ **Accessibility**: WCAG compliant with keyboard navigation support

### 🧪 Testing & Quality Assurance

- 🔍 **Comprehensive Testing**: Automated test suite for all dashboard features
- 📊 **Performance Monitoring**: Real-time performance metrics and optimization
- ♿ **Accessibility Testing**: Automated accessibility compliance checking
- 📱 **Mobile Testing**: Responsive design testing across all device sizes
- 🐛 **Error Handling**: Comprehensive error boundaries and graceful failure handling
- 🎯 **User Experience**: Tooltips, loading states, and success notifications
- 📈 **Analytics**: Performance tracking and user behavior analysis
- 🔧 **Debug Tools**: Built-in testing dashboard for development and QA

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup.sh
```

### Option 2: Manual Setup

1. **Install dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**
```bash
# Copy environment files
cp client/env.example client/.env
cp server/env.example server/.env
```

3. **Configure your environment:**
   - Update `client/.env` with your Supabase credentials
   - Update `server/.env` with your database and JWT secret
   - Set up PostgreSQL database (see Database Setup below)

4. **Set up the database:**
```bash
npm run db:generate
npm run db:push
```

5. **Start development servers:**
```bash
npm run dev
```

## 🗄️ Database Setup

### Option 1: Docker (Recommended for development)

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres
```

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb fullstack_app`
3. Update `DATABASE_URL` in `server/.env`

## 🔧 Environment Configuration

### Client Environment (`client/.env`)
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:5000/api
```

### Server Environment (`server/.env`)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fullstack_app"
JWT_SECRET="your-super-secret-jwt-key-here"
SUPABASE_URL="your_supabase_project_url"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Static assets
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   ├── prisma/            # Database schema and migrations
│   └── package.json
├── shared/                # Shared types and utilities
├── docker-compose.yml      # Docker services
└── package.json           # Root package.json
```

## 📜 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install all dependencies
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

### Client Scripts
- `npm run dev:client` - Start React development server
- `npm run build:client` - Build React app for production

### Server Scripts
- `npm run dev:server` - Start Express server in development mode
- `npm run build:server` - Build Express server for production
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 🔐 Authentication Flow

1. User clicks "Sign in with GitHub"
2. Redirected to Supabase OAuth flow
3. GitHub authentication
4. Supabase creates/updates user
5. JWT token generated and stored
6. User redirected to dashboard

## 🎨 Theming

The app supports both light and dark themes with:
- System preference detection
- Manual theme toggle
- Persistent theme selection
- Smooth transitions between themes

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `npm run build:client`
2. Deploy the `client/build` directory

### Backend (Railway/Heroku)
1. Build the server: `npm run build:server`
2. Set environment variables
3. Deploy with `npm start`

### Database
- Use a managed PostgreSQL service (Supabase, Railway, etc.)
- Update `DATABASE_URL` in production environment

## 🛠️ Development

### Adding New Features
1. Create components in `client/src/components/`
2. Add API routes in `server/src/routes/`
3. Update database schema in `server/prisma/schema.prisma`
4. Run `npm run db:push` to apply changes

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling

## 📚 Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- React Router
- Supabase Client
- Lucide React (icons)

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Supabase integration

### Development
- Concurrently (run multiple processes)
- Nodemon (auto-restart)
- TypeScript compiler
- ESLint & Prettier

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
