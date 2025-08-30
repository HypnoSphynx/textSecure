# TextChat Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you get the TextChat application running on your local machine quickly.

## 📋 Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or MongoDB Atlas) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## ⚡ Quick Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd crypto_test
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
# Or create manually:
```

Add to `.env`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/textchat_app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ENCRYPTION_KEY=your-secret-key-32-chars-long!!
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🎯 What You Can Do

### User Registration & Login
1. Visit http://localhost:5173
2. Click "Register" to create an account
3. Fill in your details (username, email, password, etc.)
4. Login with your credentials

### Messaging Features
1. After login, go to "Users" to find other users
2. Search for users by district or age
3. Click on a user to start a conversation
4. Send and receive messages

### Search History
1. View who searched for you in "Search History"
2. See your own search activity
3. Check search analytics

## 🔧 Development Commands

### Backend Commands
```bash
cd backend
npm run dev          # Start development server
npm start           # Start production server
npm run migrate     # Run database migrations
```

### Frontend Commands
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 📁 Project Structure

```
crypto_test/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json
└── README.md
```

## 🔐 Security Features

The application includes several security features:
- **AES Encryption**: Sensitive data (email, mobile, district) is encrypted
- **Password Hashing**: Passwords are hashed with bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

3. Create database:
```bash
mongo
use textchat_app
```

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/textchat_app
```

## 🧪 Testing the API

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "birthdate": "1990-01-01",
    "mobileNumber": "+1234567890",
    "district": "Test District"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Test API Health
```bash
curl http://localhost:3000/api/
```

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
```bash
# Check if .env file exists
ls -la backend/.env

# Verify environment variables
echo $MONGO_URI
```

## 📚 Next Steps

### Explore the Codebase
1. Check out the API routes in `backend/src/routes/`
2. Examine the React components in `frontend/src/components/`
3. Review the database models in `backend/src/models/`

### Add Features
1. Implement real-time messaging with WebSockets
2. Add file upload functionality
3. Create user profile editing
4. Add message encryption

### Deploy to Production
1. Follow the [Deployment Guide](DEPLOYMENT_GUIDE.md)
2. Set up CI/CD pipeline
3. Configure monitoring and logging

## 📖 Additional Resources

- [Main Documentation](README.md)
- [API Reference](API_REFERENCE.md)
- [Technical Documentation](TECHNICAL_DOCS.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)

## 🆘 Getting Help

If you encounter issues:

1. **Check the logs**:
   ```bash
   # Backend logs
   cd backend && npm run dev
   
   # Frontend logs
   cd frontend && npm run dev
   ```

2. **Verify environment setup**:
   ```bash
   node --version  # Should be v18+
   npm --version   # Should be 8+
   mongo --version # Should be 6.0+
   ```

3. **Create an issue** in the repository with:
   - Error message
   - Steps to reproduce
   - Environment details

## 🎉 You're Ready!

You now have a fully functional secure messaging application running locally. Start exploring the features and building upon the foundation!

---

**Happy Coding! 🚀**
