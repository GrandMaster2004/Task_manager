# TaskFlow - Task Management Application

A modern, responsive task management application built with React and Node.js. TaskFlow helps you organize, track, and manage your tasks efficiently with a beautiful, intuitive interface.

![TaskFlow Screenshot](https://via.placeholder.com/800x400/6366f1/ffffff?text=TaskFlow+Dashboard)

## ✨ Features

### 🎯 Core Functionality
- **Task Management**: Create, read, update, and delete tasks
- **Priority Levels**: Organize tasks by Low, Medium, and High priority
- **Task Completion**: Mark tasks as completed with visual feedback
- **Due Dates**: Set and track task deadlines
- **Real-time Statistics**: View completion rates and task analytics

### 🔐 Authentication
- **User Registration**: Create new accounts with email validation
- **Secure Login**: JWT-based authentication
- **Profile Management**: View user information
- **Session Management**: Automatic token handling and logout

### 📱 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, purple-themed interface with smooth animations
- **Mobile-First**: Optimized for mobile devices with touch-friendly controls
- **Dark/Light Theme**: Beautiful gradient backgrounds and card layouts

### 📊 Dashboard Features
- **Task Overview**: Visual statistics and completion tracking
- **Filter System**: Filter tasks by priority, date, or completion status
- **Progress Tracking**: Visual progress bars and completion percentages
- **Recent Activity**: Track your latest task activities

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for backend)

### Backend Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd taskflow-backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   Create a `.env` file in the backend root:
   \`\`\`env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   \`\`\`

4. **Start the backend server**
   \`\`\`bash
   npm start
   \`\`\`
   Backend will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory**
   \`\`\`bash
   cd taskflow-frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   Create a `.env` file in the frontend root:
   \`\`\`env
   REACT_APP_API_URL=http://localhost:4000/api
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm start
   \`\`\`
   Frontend will run on `http://localhost:3000`

## 📁 Project Structure

### Backend Structure
\`\`\`
taskflow-backend/
├── controllers/
│   ├── taskController.js      # Task CRUD operations
│   └── userController.js      # User authentication & profile
├── models/
│   ├── taskModel.js          # Task schema
│   └── userModel.js          # User schema
├── routes/
│   ├── taskRouter.js         # Task routes
│   └── userRoute.js          # User routes
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── config/
│   └── db.js                 # Database connection
├── .env                      # Environment variables
├── server.js                 # Main server file
└── package.json
\`\`\`

### Frontend Structure
\`\`\`
taskflow-frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx     # Main dashboard component
│   │   ├── TaskModal.jsx     # Task creation/editing modal
│   │   ├── Login.jsx         # Login component
│   │   ├── Register.jsx      # Registration component
│   │   └── ApiDebug.jsx      # Development debugging tool
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context
│   ├── services/
│   │   └── api.js            # API service layer
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles
├── public/
├── package.json
└── README.md
\`\`\`

## 🔧 API Endpoints

### Authentication Endpoints
\`\`\`
POST /api/user/register    # Register new user
POST /api/user/login       # User login
GET  /api/user/me          # Get current user (protected)
PUT  /api/user/profile     # Update user profile (protected)
PUT  /api/user/password    # Change password (protected)
\`\`\`

### Task Endpoints
\`\`\`
GET    /api/tasks/gp       # Get all user tasks (protected)
POST   /api/tasks/gp       # Create new task (protected)
GET    /api/tasks/:id/gp   # Get single task (protected)
POST   /api/tasks/:id/gp   # Update task (protected)
DELETE /api/tasks/:id/gp   # Delete task (protected)
\`\`\`

## 🎨 UI Components

### Dashboard Features
- **Sidebar Navigation**: Collapsible sidebar with productivity tracking
- **Task Statistics**: Real-time analytics and completion rates
- **Filter System**: Filter tasks by priority, date, or status
- **Task Cards**: Interactive task cards with priority indicators
- **Mobile FAB**: Floating action button for quick task creation

### Task Management
- **Task Modal**: Full-featured modal for creating and editing tasks
- **Priority System**: Visual priority indicators (Low/Medium/High)
- **Due Date Tracking**: Calendar integration for deadline management
- **Completion Toggle**: One-click task completion

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layout for tablet screens
- **Desktop Experience**: Full-featured desktop interface
- **Touch-Friendly**: Large touch targets and gestures

## 🛠️ Development

### Available Scripts

#### Frontend
\`\`\`bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run ESLint
\`\`\`

#### Backend
\`\`\`bash
npm start          # Start server
npm run dev        # Start with nodemon
npm test           # Run tests
\`\`\`

### Environment Variables

#### Backend (.env)
\`\`\`env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
\`\`\`

#### Frontend (.env)
\`\`\`env
REACT_APP_API_URL=http://localhost:4000/api
\`\`\`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured CORS for secure API access
- **Error Handling**: Comprehensive error handling and logging

## 📱 Mobile Features

- **Responsive Layout**: Adapts to all screen sizes
- **Touch Gestures**: Swipe and tap interactions
- **Mobile Navigation**: Hamburger menu and bottom navigation
- **Offline Support**: Basic offline functionality (future enhancement)

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy using Git or platform-specific CLI

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

#### Backend Connection Issues
\`\`\`bash
# Check if backend is running
curl http://localhost:4000/

# Check MongoDB connection
# Ensure MongoDB is running on your system
\`\`\`

#### Frontend API Issues
\`\`\`bash
# Check API URL in .env file
# Verify CORS settings in backend
# Check browser console for detailed errors
\`\`\`

#### Authentication Issues
\`\`\`bash
# Clear localStorage: localStorage.clear()
# Check JWT_SECRET in backend .env
# Verify token expiration settings
\`\`\`

### Debug Mode
Enable debug mode by setting `NODE_ENV=development` to see:
- API request/response logs
- Debug components in UI
- Detailed error messages

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

## 🎯 Roadmap

### Upcoming Features
- [ ] Task categories and tags
- [ ] Team collaboration
- [ ] File attachments
- [ ] Calendar integration
- [ ] Push notifications
- [ ] Offline support
- [ ] Dark mode toggle
- [ ] Task templates
- [ ] Advanced filtering
- [ ] Export functionality

---

**Built with ❤️ using React, Node.js, and MongoDB**
