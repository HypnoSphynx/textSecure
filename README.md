# TextChat - Secure Messaging Application

A full-stack secure messaging application with user authentication, AES encryption, and real-time messaging capabilities. Built with Node.js/Express backend and React frontend.

## 🚀 Features

### 🔐 Security Features
- **AES Encryption**: All sensitive user data (email, mobile number, district) encrypted using AES-256
- **Password Hashing**: Secure password storage using bcrypt with salt rounds
- **JWT Authentication**: Stateless authentication with configurable token expiration
- **Input Validation**: Comprehensive server-side validation and sanitization
- **CORS Protection**: Configured cross-origin resource sharing
- **Automatic Data Decryption**: Seamless encryption/decryption for sensitive data

### 💬 Messaging System
- **Real-time Messaging**: Instant message delivery between users
- **Conversation Management**: Organized chat threads and message history
- **Unread Message Tracking**: Visual indicators for unread messages
- **Message Search**: Find specific messages in conversations
- **Read Receipts**: Track message read status

### 👥 User Management
- **User Registration**: Complete registration with all required fields
- **User Discovery**: Advanced search with filters (district, age, etc.)
- **Profile Management**: Secure profile viewing and editing
- **Search History**: Track who searched for you and your search activities
- **User Analytics**: Search analytics and user interaction data

### 🎨 User Interface
- **Modern Design**: Beautiful responsive UI using Tailwind CSS
- **Mobile Responsive**: Optimized for all device sizes
- **Intuitive Navigation**: Clean and user-friendly interface
- **Real-time Updates**: Live updates for messages and notifications

## 🏗️ Architecture

### Backend Architecture
```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/              # Business logic handlers
│   ├── authController.js     # Authentication logic
│   ├── messageController.js  # Messaging operations
│   ├── searchHistoryController.js # Search tracking
│   └── ...
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/                  # MongoDB schemas
│   ├── User.js             # User data model
│   ├── Message.js          # Message data model
│   └── SearchHistory.js    # Search tracking model
├── routes/                  # API route definitions
│   ├── auth.js             # Authentication routes
│   ├── messages.js         # Messaging routes
│   └── ...
├── utils/
│   ├── keyManager.js       # Encryption key management
│   └── migrateUsers.js     # Database migration utilities
└── server.js               # Main server entry point
```

### Frontend Architecture
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MessageModal.jsx # Message display component
│   │   ├── UserProfileModal.jsx # User profile component
│   │   └── ErrorBoundary.jsx # Error handling component
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Login.jsx       # Authentication page
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Messages.jsx    # Messaging interface
│   │   └── ...
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Application entry point
└── public/                 # Static assets
```

## 🛠️ Technology Stack

### Backend
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** (v5.1.0) - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **crypto-js** - AES encryption library
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** (v19.1.1) - UI library with hooks
- **Vite** (v7.1.2) - Build tool and dev server
- **Tailwind CSS** (v4.1.11) - Utility-first CSS framework
- **React Router** (v7.8.0) - Client-side routing
- **Axios** (v1.6.0) - HTTP client
- **Lucide React** (v0.542.0) - Icon library

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd crypto_test
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create environment configuration:
```bash
# Create .env file in backend directory
touch .env
```

Add the following environment variables to `.env`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/textchat_app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ENCRYPTION_KEY=your-secret-key-32-chars-long!!
```

**Important Security Notes:**
- Change `JWT_SECRET` to a strong, unique secret key
- Ensure `ENCRYPTION_KEY` is exactly 32 characters long
- Use environment-specific MongoDB URIs for production

Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "birthdate": "1990-01-01",
  "mobileNumber": "+1234567890",
  "district": "New York"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### User Management Endpoints

#### Get All Users
```http
GET /api/users
Authorization: Bearer <jwt-token>
```

#### Search Users
```http
GET /api/users/search?district=New York&ageMin=18&ageMax=30
Authorization: Bearer <jwt-token>
```

### Messaging Endpoints

#### Send Message
```http
POST /api/messages/send
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "recipientId": "user_id_here",
  "content": "Hello, how are you?"
}
```

#### Get Conversations
```http
GET /api/messages/conversations
Authorization: Bearer <jwt-token>
```

#### Get Conversation with User
```http
GET /api/messages/conversation/:userId
Authorization: Bearer <jwt-token>
```

#### Mark Message as Read
```http
PATCH /api/messages/read/:messageId
Authorization: Bearer <jwt-token>
```

### Search History Endpoints

#### Record Search
```http
POST /api/search-history/record
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "searchedUserId": "user_id_here"
}
```

#### Get Who Searched for Me
```http
GET /api/search-history/who-searched-for-me
Authorization: Bearer <jwt-token>
```

#### Get My Search History
```http
GET /api/search-history/my-searches
Authorization: Bearer <jwt-token>
```

#### Get Search Analytics
```http
GET /api/search-history/analytics
Authorization: Bearer <jwt-token>
```

## 🔐 Security Implementation

### Data Encryption
The application uses AES-256 encryption for sensitive user data:

```javascript
// Encryption example
const encryptedData = CryptoJS.AES.encrypt(
  sensitiveData, 
  process.env.ENCRYPTION_KEY
).toString();

// Decryption example
const decryptedData = CryptoJS.AES.decrypt(
  encryptedData, 
  process.env.ENCRYPTION_KEY
).toString(CryptoJS.enc.Utf8);
```

### Password Security
Passwords are hashed using bcrypt with salt rounds:

```javascript
// Password hashing
const hashedPassword = await bcrypt.hash(password, 12);

// Password verification
const isValid = await bcrypt.compare(password, hashedPassword);
```

### JWT Authentication
JWT tokens are used for stateless authentication:

```javascript
// Token generation
const token = jwt.sign(
  { userId: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

## 🗄️ Database Schema

### User Model
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, encrypted: true },
  password: { type: String, required: true, hashed: true },
  birthdate: { type: Date, required: true },
  mobileNumber: { type: String, required: true, encrypted: true },
  district: { type: String, required: true, encrypted: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Message Model
```javascript
{
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### SearchHistory Model
```javascript
{
  searcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  searchedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  searchDate: { type: Date, default: Date.now }
}
```

## 🧪 Development

### Available Scripts

#### Backend Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run migrate  # Run database migrations
```

#### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Development Guidelines

1. **Code Style**: Follow ESLint configuration for consistent code style
2. **Error Handling**: Implement proper error handling and logging
3. **Security**: Always validate and sanitize user inputs
4. **Testing**: Write tests for critical functionality
5. **Documentation**: Update documentation for new features

### Environment Variables

#### Backend (.env)
```env
PORT=3000                                    # Server port
MONGO_URI=mongodb://localhost:27017/textchat_app  # MongoDB connection string
JWT_SECRET=your-super-secret-jwt-key        # JWT signing secret
ENCRYPTION_KEY=your-secret-key-32-chars-long!!    # AES encryption key
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api      # Backend API URL
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Use production-specific environment variables
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **SSL/TLS**: Enable HTTPS for production
4. **Rate Limiting**: Implement API rate limiting
5. **Monitoring**: Add application monitoring and logging
6. **Backup**: Regular database backups
7. **Security**: Regular security updates and audits

### Docker Deployment (Optional)

Create `Dockerfile` for backend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Create `Dockerfile` for frontend:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation for new features
- Ensure all tests pass before submitting
- Provide clear commit messages

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

1. Check the existing documentation
2. Review the API endpoints
3. Check the console for error messages
4. Create an issue with detailed information

## 🔄 Version History

- **v1.0.0** - Initial release with basic messaging functionality
- **v1.1.0** - Added search history tracking
- **v1.2.0** - Enhanced security with AES encryption
- **v1.3.0** - Improved UI/UX with Tailwind CSS

---

**Note**: This is a secure messaging application. Always follow security best practices when deploying to production environments.
