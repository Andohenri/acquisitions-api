# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js/Express REST API for acquisitions management built with modern JavaScript (ES modules). The project uses a PostgreSQL database with Drizzle ORM and follows a clean architecture pattern with separated concerns.

### Tech Stack
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Zod schemas
- **Logging**: Winston
- **Code Quality**: ESLint + Prettier

## Common Commands

### Development
```bash
# Start development server with file watching
npm run dev

# Start production server
npm run start

# Database operations
npm run db:generate    # Generate migrations from schema changes
npm run db:migrate     # Apply migrations to database
npm run db:studio      # Open Drizzle Studio for database management
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## Architecture

### Directory Structure
```
src/
├── app.js              # Express app configuration with middleware
├── index.js            # Entry point (loads env and starts server)
├── server.js           # Server startup and port binding
├── config/
│   ├── database.js     # Neon PostgreSQL connection setup
│   └── logger.js       # Winston logging configuration
├── models/             # Drizzle schema definitions
├── routes/             # Express route definitions
├── controllers/        # Route handlers and business logic
├── services/           # Business logic and data operations
├── middlewares/        # Custom Express middlewares
├── utils/              # Utility functions (JWT, cookies, formatting)
└── validations/        # Zod validation schemas
```

### Key Patterns

- **Path Aliases**: Uses Node.js subpath imports (`#config/*`, `#services/*`, etc.) defined in package.json
- **Layered Architecture**: Routes → Controllers → Services → Models
- **Error Handling**: Centralized error handling with Winston logging
- **Validation**: Zod schemas for request validation with custom error formatting
- **Authentication**: JWT tokens stored in HTTP-only cookies

### Database Integration

The project uses Drizzle ORM with Neon PostgreSQL:
- Schema files in `src/models/` define table structures
- Database connection configured in `src/config/database.js`
- Migrations managed via `drizzle-kit` commands
- Current schema includes only `users` table with authentication fields

### Current Features

- User registration (`POST /api/auth/sign-up`)
- Basic authentication infrastructure
- Health check endpoint (`/health`)
- Request logging with Morgan + Winston
- Security middlewares (Helmet, CORS)

## Environment Setup

Copy `.env.example` to `.env` and configure:
```
PORT=3000
HOST=localhost
NODE_ENV=development
LOG_LEVEL=info
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

## Development Notes

### Code Style
- Uses ESLint with strict rules (2-space indentation, single quotes, semicolons required)
- Prettier for consistent formatting
- Prefer arrow functions and const/let over var
- Unix line endings enforced

### Database Workflow
1. Modify schema files in `src/models/`
2. Run `npm run db:generate` to create migrations
3. Run `npm run db:migrate` to apply changes
4. Use `npm run db:studio` to inspect database

### Authentication Flow
- Passwords hashed with bcrypt (10 rounds)
- JWTs signed with configurable secret and expiration
- Tokens stored in secure HTTP-only cookies
- Cookie settings adapt to production/development environment

### Logging
- Winston configured for file and console output
- Error logs written to `logs/error.log`
- All logs written to `logs/combined.log`  
- Console output only in non-production environments
- Morgan integration for HTTP request logging