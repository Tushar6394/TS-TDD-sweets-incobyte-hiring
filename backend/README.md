# CandyCraft: Sweet Shop Management System

A full-stack Node.js + TypeScript + MongoDB + JWT backend API with comprehensive Test-Driven Development (TDD) following best practices in clean architecture.

## Tech Stack

- **Backend**: Node.js + Express.js + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Testing**: Jest + Supertest (integration tests)
- **Code Quality**: ESLint + Prettier
- **Role-Based Access Control**: Admin & Customer roles

## Project Structure

```
src/
├── app.ts                          # Express app setup
├── server.ts                       # Server entry point
├── config/
│   └── db.ts                      # MongoDB connection
├── middleware/
│   ├── authMiddleware.ts          # JWT authentication & role-based auth
│   └── errorHandler.ts            # Global error handling
├── models/
│   ├── User.ts                    # User schema with bcrypt integration
│   └── Sweet.ts                   # Sweet product schema
├── routes/
│   ├── authRoutes.ts              # Auth endpoints
│   └── sweetRoutes.ts             # Sweet management endpoints
├── controllers/
│   ├── authController.ts          # Auth request handlers
│   └── sweetController.ts         # Sweet management handlers
├── services/
│   ├── authService.ts             # Auth business logic
│   └── sweetService.ts            # Sweet management logic
└── tests/
    ├── auth.test.ts               # Auth endpoint tests
    └── sweets.test.ts             # Sweet management tests
```

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure MongoDB**:
   - Ensure MongoDB is running locally or update `MONGODB_URI` in `.env`
   - Current default: `mongodb://localhost:27017/candycraft`

3. **Set environment variables** (`.env` file):
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/candycraft
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

## Scripts

```bash
# Development server
npm run dev

# Build TypeScript
npm run build

# Production server
npm start

# Run tests (watch mode)
npm test

# Run tests with coverage
npm run test:ci

# Lint code
npm run lint

# Format code
npm run format
```

## API Endpoints

### Authentication

**Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"  // optional, defaults to "customer"
}

Response (201):
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Get Profile** (Protected)
```
GET /api/auth/profile
Authorization: Bearer {token}

Response (200):
{
  "user": {
    "id": "...",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Sweets Management

**Create Sweet** (Admin Only)
```
POST /api/sweets
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "chocolate",
  "price": 2.50,
  "quantity": 100,
  "description": "Delicious milk chocolate"
}

Response (201):
{
  "_id": "...",
  "name": "Chocolate Bar",
  "category": "chocolate",
  "price": 2.50,
  "quantity": 100,
  "description": "Delicious milk chocolate",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Get All Sweets** (Paginated)
```
GET /api/sweets?page=1&limit=10

Response (200):
{
  "sweets": [...],
  "total": 50,
  "pages": 5
}
```

**Search Sweets**
```
GET /api/sweets/search?q=Chocolate&priceMin=1&priceMax=5

Response (200):
{
  "sweets": [...],
  "count": 3
}
```

**Get Sweet by ID**
```
GET /api/sweets/:id

Response (200):
{
  "_id": "...",
  "name": "Chocolate Bar",
  ...
}
```

**Update Sweet** (Admin Only)
```
PUT /api/sweets/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "price": 3.00,
  "quantity": 150
}

Response (200): Updated sweet object
```

**Delete Sweet** (Admin Only)
```
DELETE /api/sweets/:id
Authorization: Bearer {admin_token}

Response (200):
{
  "message": "Sweet deleted successfully",
  "sweet": {...}
}
```

**Purchase Sweet** (Authenticated Users)
```
POST /api/sweets/:id/purchase
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 5
}

Response (200):
{
  "message": "Purchase successful",
  "sweet": {
    ...
    "quantity": 95
  }
}
```

**Restock Sweet** (Admin Only)
```
POST /api/sweets/:id/restock
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "quantity": 50
}

Response (200):
{
  "message": "Restock successful",
  "sweet": {
    ...
    "quantity": 150
  }
}
```

## Testing

The project includes comprehensive test suites demonstrating TDD principles:

- **Authentication Tests** (`auth.test.ts`):
  - User registration with default/custom roles
  - Login with valid/invalid credentials
  - JWT token validation
  - Profile access with/without authentication
  - Password hashing verification

- **Sweet Management Tests** (`sweets.test.ts`):
  - CRUD operations (Create, Read, Update, Delete)
  - Role-based access control (admin vs customer)
  - Pagination and search functionality
  - Inventory management (purchase & restock)
  - Input validation and error handling
  - Edge cases (negative prices, insufficient inventory, etc.)

**Run Tests**:
```bash
# Watch mode
npm test

# Coverage report
npm run test:ci
```

## Key Features

### 1. Authentication & Authorization
- JWT-based authentication with configurable expiration
- bcrypt password hashing with configurable rounds
- Role-based access control (admin & customer)
- Protected routes requiring valid JWT tokens

### 2. Sweet Management
- Full CRUD operations for sweet products
- Categorized sweets (chocolate, candy, gum, lollipop, marshmallow, taffy, other)
- Pagination for large datasets
- Text search by name and category
- Price range filtering

### 3. Inventory Management
- Purchase functionality with stock deduction
- Restock functionality for admins
- Insufficient inventory validation
- Stock level tracking

### 4. Clean Architecture
- Separation of concerns (models, controllers, services)
- Reusable middleware for auth and error handling
- Async error handling wrapper
- Global error handler for consistent API responses

### 5. TDD Best Practices
- Red → Green → Refactor workflow demonstrated
- Comprehensive test coverage for all endpoints
- Integration tests using Supertest
- Test data setup and teardown

## Security Features

- Password hashing with bcrypt (no plain-text passwords)
- JWT token validation on protected routes
- Role-based access control enforcement
- Input validation at API boundaries
- MongoDB injection prevention via Mongoose
- CORS middleware for cross-origin requests

## Next Steps for Enhancement

1. **Frontend**: React + TypeScript + Vite + Tailwind CSS
2. **Database**: Add indexes for frequently queried fields
3. **Caching**: Implement Redis for frequently accessed sweets
4. **Logging**: Add structured logging for debugging
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Swagger/OpenAPI**: Auto-generate API documentation
7. **CI/CD**: Set up GitHub Actions for automated testing and deployment
8. **Email Verification**: Add email confirmation for registration
9. **Password Reset**: Implement password recovery flow
10. **Audit Logging**: Track user actions for compliance

## Notes

- This project requires MongoDB to be installed and running
- The project uses ES modules (`"type": "module"` in package.json)
- All TypeScript files are compiled to JavaScript in the `dist` directory
- Tests connect to MongoDB during execution, ensure DB is accessible

## License

MIT
