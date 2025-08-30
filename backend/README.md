# TextChat Backend

A secure messaging application with user authentication and data encryption.

## Features

- User registration and login
- AES encryption for sensitive user data (email, mobile number, district)
- JWT authentication
- Password hashing with bcrypt
- MongoDB database integration
- Real-time messaging system
- Search history tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/textchat_app
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ENCRYPTION_KEY=your-secret-key-32-chars-long!!
```

3. Make sure MongoDB is running on your system

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Users

- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/search` - Search users with filters (requires authentication)

### Messaging

- `POST /api/messages/send` - Send a message (requires authentication)
- `GET /api/messages/conversations` - Get user conversations (requires authentication)
- `GET /api/messages/conversation/:userId` - Get conversation with specific user (requires authentication)
- `PATCH /api/messages/read/:messageId` - Mark message as read (requires authentication)

### Search History

- `POST /api/search-history/record` - Record a search (requires authentication)
- `GET /api/search-history/who-searched-for-me` - Get users who searched for you (requires authentication)
- `GET /api/search-history/my-searches` - Get your search history (requires authentication)
- `GET /api/search-history/analytics` - Get search analytics (requires authentication)

### Register Request Body
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "birthdate": "1990-01-01",
  "mobileNumber": "+1234567890",
  "district": "New York"
}
```

### Login Request Body
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

## Security Features

- All sensitive data (email, mobile number, district) is encrypted using AES algorithm
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Data is automatically decrypted when retrieved from database
