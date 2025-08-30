# TextChat Technical Documentation

## 🏗️ System Architecture

### Overview
TextChat is a full-stack secure messaging application built with a microservices-inspired architecture. The system consists of:

1. **Backend API Server** (Node.js/Express)
2. **Frontend Client** (React/Vite)
3. **Database Layer** (MongoDB with Mongoose ODM)
4. **Security Layer** (AES encryption, JWT, bcrypt)

### Architecture Diagram
```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   React Client  │ ◄──────────────► │  Express Server │
│   (Frontend)    │                  │   (Backend)     │
└─────────────────┘                  └─────────────────┘
                                              │
                                              │ MongoDB
                                              ▼
                                    ┌─────────────────┐
                                    │   MongoDB DB    │
                                    │   (Database)    │
                                    └─────────────────┘
```

## 🔐 Security Architecture

### Encryption Strategy
The application implements a multi-layered security approach:

#### 1. Data Encryption (AES-256)
- **Purpose**: Protect sensitive user data at rest
- **Algorithm**: AES-256-CBC
- **Scope**: Email, mobile number, district
- **Implementation**: Using crypto-js library

```javascript
// Encryption utility
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, process.env.ENCRYPTION_KEY).toString();
};

// Decryption utility
const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
```

#### 2. Password Security
- **Algorithm**: bcrypt with 12 salt rounds
- **Storage**: Hashed passwords only
- **Verification**: Secure comparison using bcrypt.compare()

#### 3. Authentication (JWT)
- **Token Type**: JSON Web Tokens
- **Expiration**: 24 hours (configurable)
- **Payload**: User ID and username
- **Storage**: LocalStorage (frontend)

### Security Best Practices Implemented

1. **Input Validation**: All user inputs are validated server-side
2. **SQL Injection Prevention**: Using Mongoose ODM with parameterized queries
3. **XSS Protection**: Input sanitization and output encoding
4. **CORS Configuration**: Proper cross-origin resource sharing setup
5. **Environment Variables**: Sensitive data stored in environment variables
6. **Error Handling**: Secure error messages without exposing system details

## 📊 Database Design

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (encrypted, required),
  password: String (hashed, required),
  birthdate: Date (required),
  mobileNumber: String (encrypted, required),
  district: String (encrypted, required),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

#### Messages Collection
```javascript
{
  _id: ObjectId,
  sender: ObjectId (ref: 'User', required),
  recipient: ObjectId (ref: 'User', required),
  content: String (required),
  isRead: Boolean (default: false),
  createdAt: Date (default: Date.now)
}
```

#### SearchHistory Collection
```javascript
{
  _id: ObjectId,
  searcher: ObjectId (ref: 'User', required),
  searchedUser: ObjectId (ref: 'User', required),
  searchDate: Date (default: Date.now)
}
```

### Indexes
```javascript
// Users collection indexes
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 })

// Messages collection indexes
db.messages.createIndex({ "sender": 1, "recipient": 1 })
db.messages.createIndex({ "createdAt": -1 })

// SearchHistory collection indexes
db.searchHistory.createIndex({ "searcher": 1, "searchedUser": 1 })
db.searchHistory.createIndex({ "searchDate": -1 })
```

## 🔄 Data Flow

### User Registration Flow
1. **Frontend**: User submits registration form
2. **Validation**: Client-side validation
3. **API Call**: POST /api/auth/register
4. **Backend Validation**: Server-side validation
5. **Data Processing**: 
   - Encrypt sensitive fields (email, mobile, district)
   - Hash password with bcrypt
6. **Database**: Save user document
7. **Response**: Return JWT token and user data

### Messaging Flow
1. **Message Creation**: User composes message
2. **API Call**: POST /api/messages/send
3. **Authentication**: Verify JWT token
4. **Validation**: Validate message content and recipient
5. **Database**: Save message document
6. **Response**: Return message confirmation

### Search Flow
1. **Search Request**: User searches for other users
2. **API Call**: GET /api/users/search with filters
3. **Authentication**: Verify JWT token
4. **Database Query**: Find matching users
5. **Data Processing**: Decrypt sensitive fields for display
6. **Search Recording**: Record search in SearchHistory
7. **Response**: Return filtered user list

## 🛠️ Development Guidelines

### Code Organization

#### Backend Structure
```
src/
├── controllers/     # Business logic
├── middleware/      # Custom middleware
├── models/         # Database schemas
├── routes/         # API route definitions
├── utils/          # Utility functions
└── server.js       # Application entry point
```

#### Frontend Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── App.jsx        # Main application component
```

### Coding Standards

#### JavaScript/Node.js
- Use ES6+ features (arrow functions, destructuring, etc.)
- Implement proper error handling with try-catch blocks
- Use async/await for asynchronous operations
- Follow RESTful API design principles
- Implement input validation for all endpoints

#### React
- Use functional components with hooks
- Implement proper state management
- Use PropTypes or TypeScript for type checking
- Follow React best practices for performance
- Implement error boundaries for error handling

### Error Handling Strategy

#### Backend Error Handling
```javascript
// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.errors
    });
  }
  
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});
```

#### Frontend Error Handling
```javascript
// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## 🔧 Configuration Management

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/textchat_app

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ENCRYPTION_KEY=your-secret-key-32-chars-long!!

# Optional: Logging
LOG_LEVEL=info
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Optional: Feature flags
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=true
```

### Configuration Validation
```javascript
// Validate required environment variables
const requiredEnvVars = [
  'PORT',
  'MONGO_URI',
  'JWT_SECRET',
  'ENCRYPTION_KEY'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

## 📈 Performance Considerations

### Database Optimization
1. **Indexing**: Proper indexes on frequently queried fields
2. **Query Optimization**: Use projection to limit returned fields
3. **Connection Pooling**: Configure MongoDB connection pool
4. **Aggregation**: Use MongoDB aggregation for complex queries

### Frontend Optimization
1. **Code Splitting**: Implement React.lazy() for route-based splitting
2. **Memoization**: Use React.memo() and useMemo() for expensive operations
3. **Bundle Optimization**: Configure Vite for optimal bundle size
4. **Caching**: Implement proper caching strategies

### API Optimization
1. **Pagination**: Implement pagination for large datasets
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Caching**: Implement Redis caching for frequently accessed data
4. **Compression**: Enable gzip compression for responses

## 🧪 Testing Strategy

### Backend Testing
```javascript
// Example test structure
describe('User Authentication', () => {
  test('should register a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      birthdate: '1990-01-01',
      mobileNumber: '+1234567890',
      district: 'Test District'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });
});
```

### Frontend Testing
```javascript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';

test('should handle login form submission', () => {
  const mockOnLogin = jest.fn();
  
  render(<Login onLogin={mockOnLogin} />);
  
  fireEvent.change(screen.getByLabelText(/username/i), {
    target: { value: 'testuser' }
  });
  
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  expect(mockOnLogin).toHaveBeenCalled();
});
```

## 🔄 Deployment Pipeline

### Development Workflow
1. **Local Development**: Use nodemon for backend, Vite for frontend
2. **Code Review**: Pull request review process
3. **Testing**: Automated tests on CI/CD pipeline
4. **Staging**: Deploy to staging environment
5. **Production**: Deploy to production environment

### CI/CD Configuration
```yaml
# Example GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploy to production server"
```

## 📊 Monitoring and Logging

### Application Monitoring
1. **Health Checks**: Implement /health endpoint
2. **Performance Metrics**: Monitor response times and throughput
3. **Error Tracking**: Implement error logging and alerting
4. **User Analytics**: Track user behavior and usage patterns

### Logging Strategy
```javascript
// Structured logging
const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  error: (message, error = {}, meta = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
};
```

## 🔒 Security Checklist

### Pre-deployment Security Review
- [ ] All environment variables are properly configured
- [ ] JWT secret is strong and unique
- [ ] Encryption key is exactly 32 characters
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive information
- [ ] HTTPS is enabled for production
- [ ] Rate limiting is implemented
- [ ] Database connection is secure
- [ ] Dependencies are up to date

### Ongoing Security Maintenance
- [ ] Regular dependency updates
- [ ] Security audit of dependencies
- [ ] Monitor for security vulnerabilities
- [ ] Regular backup of database
- [ ] Review and rotate secrets periodically
- [ ] Monitor access logs
- [ ] Implement intrusion detection

---

This technical documentation provides a comprehensive overview of the TextChat application architecture, security implementation, and development guidelines. For specific implementation details, refer to the source code and API documentation.
