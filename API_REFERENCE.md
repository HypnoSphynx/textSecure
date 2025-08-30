# TextChat API Reference

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Response Format
All API responses follow a consistent format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { /* response data */ },
  "errors": [ /* validation errors */ ]
}
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

#### Request Body
```json
{
  "username": "string (required, unique, 3-20 characters)",
  "email": "string (required, valid email format)",
  "password": "string (required, minimum 6 characters)",
  "birthdate": "string (required, ISO date format YYYY-MM-DD)",
  "mobileNumber": "string (required, valid phone format)",
  "district": "string (required, 2-50 characters)"
}
```

#### Example Request
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "birthdate": "1990-01-01",
    "mobileNumber": "+1234567890",
    "district": "New York"
  }'
```

#### Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "birthdate": "1990-01-01T00:00:00.000Z",
      "mobileNumber": "+1234567890",
      "district": "New York",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
```json
// Validation Error
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "username": "Username is required",
    "email": "Invalid email format"
  }
}

// Username Already Exists
{
  "success": false,
  "message": "Username already exists"
}
```

---

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

#### Request Body
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

#### Example Request
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

#### Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "birthdate": "1990-01-01T00:00:00.000Z",
      "mobileNumber": "+1234567890",
      "district": "New York"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
```json
// Invalid Credentials
{
  "success": false,
  "message": "Invalid username or password"
}

// User Not Found
{
  "success": false,
  "message": "User not found"
}
```

---

### Get User Profile
**GET** `/auth/profile`

Get current user's profile information.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Example Request
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "birthdate": "1990-01-01T00:00:00.000Z",
      "mobileNumber": "+1234567890",
      "district": "New York",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Error Responses
```json
// Unauthorized
{
  "success": false,
  "message": "Access denied. No token provided."
}

// Invalid Token
{
  "success": false,
  "message": "Invalid token"
}
```

---

## 👥 User Management Endpoints

### Get All Users
**GET** `/users`

Get list of all users (excluding current user).

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
```
page: number (optional, default: 1)
limit: number (optional, default: 10)
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "birthdate": "1992-05-15T00:00:00.000Z",
        "district": "Los Angeles"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### Search Users
**GET** `/users/search`

Search users with filters.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
```
username: string (optional, partial match)
district: string (optional, exact match)
ageMin: number (optional, minimum age)
ageMax: number (optional, maximum age)
page: number (optional, default: 1)
limit: number (optional, default: 10)
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/users/search?district=New%20York&ageMin=18&ageMax=30" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "birthdate": "1992-05-15T00:00:00.000Z",
        "district": "New York",
        "age": 31
      }
    ],
    "filters": {
      "district": "New York",
      "ageMin": 18,
      "ageMax": 30
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalUsers": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 💬 Messaging Endpoints

### Send Message
**POST** `/messages/send`

Send a message to another user.

#### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request Body
```json
{
  "recipientId": "string (required, valid user ID)",
  "content": "string (required, 1-1000 characters)"
}
```

#### Example Request
```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "recipientId": "507f1f77bcf86cd799439012",
    "content": "Hello! How are you doing?"
  }'
```

#### Response
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": {
      "id": "507f1f77bcf86cd799439013",
      "sender": "507f1f77bcf86cd799439011",
      "recipient": "507f1f77bcf86cd799439012",
      "content": "Hello! How are you doing?",
      "isRead": false,
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

#### Error Responses
```json
// Recipient Not Found
{
  "success": false,
  "message": "Recipient not found"
}

// Cannot Send to Yourself
{
  "success": false,
  "message": "Cannot send message to yourself"
}

// Empty Content
{
  "success": false,
  "message": "Message content is required"
}
```

---

### Get Conversations
**GET** `/messages/conversations`

Get all conversations for the current user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
```
page: number (optional, default: 1)
limit: number (optional, default: 10)
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/messages/conversations?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Conversations retrieved successfully",
  "data": {
    "conversations": [
      {
        "userId": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "lastMessage": {
          "id": "507f1f77bcf86cd799439013",
          "content": "Hello! How are you doing?",
          "isRead": false,
          "createdAt": "2024-01-01T12:00:00.000Z"
        },
        "unreadCount": 2
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalConversations": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### Get Conversation with User
**GET** `/messages/conversation/:userId`

Get all messages in a conversation with a specific user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Path Parameters
```
userId: string (required, valid user ID)
```

#### Query Parameters
```
page: number (optional, default: 1)
limit: number (optional, default: 50)
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/messages/conversation/507f1f77bcf86cd799439012?page=1&limit=50" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Conversation retrieved successfully",
  "data": {
    "conversation": {
      "userId": "507f1f77bcf86cd799439012",
      "username": "jane_doe",
      "messages": [
        {
          "id": "507f1f77bcf86cd799439013",
          "sender": "507f1f77bcf86cd799439011",
          "recipient": "507f1f77bcf86cd799439012",
          "content": "Hello! How are you doing?",
          "isRead": true,
          "createdAt": "2024-01-01T12:00:00.000Z"
        },
        {
          "id": "507f1f77bcf86cd799439014",
          "sender": "507f1f77bcf86cd799439012",
          "recipient": "507f1f77bcf86cd799439011",
          "content": "I'm doing great, thanks!",
          "isRead": false,
          "createdAt": "2024-01-01T12:05:00.000Z"
        }
      ]
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalMessages": 2,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### Error Responses
```json
// User Not Found
{
  "success": false,
  "message": "User not found"
}

// No Conversation
{
  "success": false,
  "message": "No conversation found with this user"
}
```

---

### Mark Message as Read
**PATCH** `/messages/read/:messageId`

Mark a specific message as read.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Path Parameters
```
messageId: string (required, valid message ID)
```

#### Example Request
```bash
curl -X PATCH http://localhost:3000/api/messages/read/507f1f77bcf86cd799439013 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Message marked as read",
  "data": {
    "message": {
      "id": "507f1f77bcf86cd799439013",
      "isRead": true,
      "updatedAt": "2024-01-01T12:10:00.000Z"
    }
  }
}
```

#### Error Responses
```json
// Message Not Found
{
  "success": false,
  "message": "Message not found"
}

// Unauthorized
{
  "success": false,
  "message": "You can only mark your own messages as read"
}
```

---

## 🔍 Search History Endpoints

### Record Search
**POST** `/search-history/record`

Record a search action when a user views another user's profile.

#### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

#### Request Body
```json
{
  "searchedUserId": "string (required, valid user ID)"
}
```

#### Example Request
```bash
curl -X POST http://localhost:3000/api/search-history/record \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "searchedUserId": "507f1f77bcf86cd799439012"
  }'
```

#### Response
```json
{
  "success": true,
  "message": "Search recorded successfully",
  "data": {
    "searchRecord": {
      "id": "507f1f77bcf86cd799439015",
      "searcher": "507f1f77bcf86cd799439011",
      "searchedUser": "507f1f77bcf86cd799439012",
      "searchDate": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

#### Error Responses
```json
// User Not Found
{
  "success": false,
  "message": "Searched user not found"
}

// Cannot Search Yourself
{
  "success": false,
  "message": "Cannot record search for yourself"
}
```

---

### Get Who Searched for Me
**GET** `/search-history/who-searched-for-me`

Get list of users who have searched for the current user.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
```
page: number (optional, default: 1)
limit: number (optional, default: 10)
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/search-history/who-searched-for-me?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Search history retrieved successfully",
  "data": {
    "searchers": [
      {
        "id": "507f1f77bcf86cd799439012",
        "username": "jane_doe",
        "searchDate": "2024-01-01T12:00:00.000Z",
        "searchCount": 3
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalSearchers": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### Get My Search History
**GET** `/search-history/my-searches`

Get current user's search history.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
```
page: number (optional, default: 1)
limit: number (optional, default: 10)
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/search-history/my-searches?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Search history retrieved successfully",
  "data": {
    "searches": [
      {
        "id": "507f1f77bcf86cd799439015",
        "searchedUser": {
          "id": "507f1f77bcf86cd799439012",
          "username": "jane_doe",
          "district": "Los Angeles"
        },
        "searchDate": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalSearches": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### Get Search Analytics
**GET** `/search-history/analytics`

Get analytics about search activities.

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Query Parameters
```
period: string (optional, "day", "week", "month", "year", default: "month")
```

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/search-history/analytics?period=month" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "analytics": {
      "totalSearches": 45,
      "uniqueUsersSearched": 23,
      "totalSearchesOnMe": 12,
      "uniqueUsersSearchedMe": 8,
      "mostSearchedDistrict": "New York",
      "searchTrends": [
        {
          "date": "2024-01-01",
          "searches": 5,
          "searchesOnMe": 2
        },
        {
          "date": "2024-01-02",
          "searches": 3,
          "searchesOnMe": 1
        }
      ]
    }
  }
}
```

---

## 🔑 Key Management Endpoints

### Get Encryption Keys
**GET** `/keys`

Get encryption keys for client-side operations (if needed).

#### Headers
```
Authorization: Bearer <jwt-token>
```

#### Example Request
```bash
curl -X GET http://localhost:3000/api/keys \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Response
```json
{
  "success": true,
  "message": "Keys retrieved successfully",
  "data": {
    "publicKey": "base64-encoded-public-key",
    "algorithm": "RSA-2048"
  }
}
```

---

## 📊 Health Check Endpoint

### API Health Check
**GET** `/`

Check if the API is running.

#### Example Request
```bash
curl -X GET http://localhost:3000/api/
```

#### Response
```json
{
  "message": "TextChat API is running!",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 🚨 Error Codes

### HTTP Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request (Validation Error)
- **401** - Unauthorized (Invalid/Missing Token)
- **403** - Forbidden (Insufficient Permissions)
- **404** - Not Found
- **409** - Conflict (Resource Already Exists)
- **422** - Unprocessable Entity
- **500** - Internal Server Error

### Common Error Messages
- `"Validation Error"` - Request data validation failed
- `"Invalid token"` - JWT token is invalid or expired
- `"Access denied"` - Missing or invalid authentication
- `"User not found"` - Requested user does not exist
- `"Resource not found"` - Requested resource does not exist
- `"Internal server error"` - Unexpected server error

---

## 📝 Rate Limiting

The API implements rate limiting to prevent abuse:
- **Authentication endpoints**: 5 requests per minute per IP
- **General endpoints**: 100 requests per minute per user
- **Search endpoints**: 20 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 🔒 Security Notes

1. **HTTPS Required**: All production requests must use HTTPS
2. **Token Expiration**: JWT tokens expire after 24 hours
3. **Sensitive Data**: Email, mobile number, and district are encrypted
4. **Input Validation**: All inputs are validated and sanitized
5. **CORS**: Configured for specific origins in production

---

This API reference provides comprehensive documentation for all TextChat API endpoints. For additional support, refer to the main README.md file or create an issue in the repository.
