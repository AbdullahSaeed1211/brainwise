# BrainWise Application Architecture Overview

## System Architecture

BrainWise is a modern web application built with Next.js 14 using the App Router. The architecture follows a client-server model with a clear separation between client and server components.

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                     Next.js App                          │
│  ┌─────────────────┐      ┌──────────────────────────┐  │
│  │  Server         │      │  Client Components       │  │
│  │  Components     │──────►  - Health Tracker        │  │
│  │  - API Routes   │      │  - Games                 │  │
│  │  - Page Layouts │      │  - Data Visualization    │  │
│  │  - Data Fetching│      │  - User Preferences      │  │
│  └────────┬────────┘      └──────────────────────────┘  │
│           │                                              │
└───────────┼──────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────┐
│  External Services                                        │
│  ┌─────────────┐ ┌────────────┐ ┌─────────────────────┐  │
│  │ MongoDB     │ │ Google     │ │  ML Models          │  │
│  │ Database    │ │ Cloud      │ │  (TensorFlow.js)    │  │
│  └─────────────┘ └────────────┘ └─────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Rendering**: React Server Components + Client Components
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI Primitives
- **State Management**: React Context + Server Components + URL state with nuqs
- **Data Visualization**: Recharts
- **Animation**: Framer Motion
- **Form Management**: React Hook Form + Zod

### Backend
- **API**: Next.js Route Handlers
- **Authentication**: Mock auth (to be replaced with Clerk)
- **Database**: MongoDB (accessed via Mongoose ODM)
- **Storage**: Uploadcare for medical images and Hugging Face for ML models
- **Machine Learning**: TensorFlow.js (client-side inference)

### DevOps & Infrastructure
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics

## Core Application Modules

### 1. Authentication System

Currently using a mock authentication implementation in `lib/auth.mock.ts`, designed to be easily replaced with a production-ready solution like Clerk.

**Key Components**:
- `withAuth` HOC for protecting API routes
- `getCurrentUserId` utility for client components
- Standardized error response handling

### 2. Health Metrics Tracking

**Server Components**:
- API routes for CRUD operations on health metrics
- Data validation and analysis endpoints

**Client Components**:
- `HealthMetricTracker` for data entry and management
- Visualization components for displaying metric trends

### 3. Cognitive Training Games

**Server Components**:
- Game result tracking and analysis
- Cognitive domain mapping and progress calculation

**Client Components**:
- Game interfaces with interactive elements
- Progress tracking and visualization

### 4. Goal Management System

**Server Components**:
- API routes for CRUD operations on goals
- Goal categorization and progress tracking

**Client Components**:
- Goal creation interface
- Progress visualization
- Achievement celebrations

### 5. ML Models & Analysis

**Server Components**:
- API routes for generating model predictions
- Data preparation and transformation

**Client Components**:
- Model loading and inference
- Visualization of prediction results
- Recommendation display

## Data Flow

### 1. Health Metrics Data Flow

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  User inputs  │────►│  API routes   │────►│  MongoDB      │
│  health data  │     │  validate &   │     │  stores data  │
└───────────────┘     │  process data │     └───────┬───────┘
       ▲               └───────────────┘            │
       │                                            │
       │              ┌───────────────┐     ┌──────▼────────┐
       └──────────────┤  Fetch and    │◄────┤  Analysis     │
                      │  display data │     │  & Processing │
                      └───────────────┘     └───────────────┘
```

### 2. Cognitive Game Data Flow

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  User plays   │────►│  Client-side  │────►│  API routes   │
│  games        │     │  game logic   │     │  store results│
└───────────────┘     └───────────────┘     └───────┬───────┘
                                                    │
┌───────────────┐     ┌───────────────┐     ┌──────▼────────┐
│  Personalized │◄────┤  ML analysis  │◄────┤  MongoDB      │
│  suggestions  │     │  & insights   │     │  game results │
└───────────────┘     └───────────────┘     └───────────────┘
```

### ML Prediction Flow

```
┌─────────────┐     ┌────────────┐     ┌────────────────┐
│  User Input  │────▶│  Next.js   │────▶│ API Validation │
└─────────────┘     │  Frontend  │     └────────────────┘
                    └────────────┘              │
                          ▲                     ▼
                          │             ┌────────────────┐
┌─────────────┐           │             │ MongoDB Logging │
│   Results   │◀──────────┤             └────────────────┘
└─────────────┘           │                     │
                          │                     ▼
                    ┌────────────┐     ┌────────────────┐
                    │ API Routes │◀────│ ML Model API   │
                    └────────────┘     └────────────────┘
```

### Brain Scan Analysis Flow

```
┌─────────────┐     ┌────────────┐     ┌────────────────┐
│  User       │────▶│  Upload to │────▶│ CDN URL        │
│  Image      │     │ Uploadcare │     │ Generated      │
└─────────────┘     └────────────┘     └────────────────┘
                                                │
                                                ▼
┌─────────────┐     ┌────────────┐     ┌────────────────┐
│  Analysis   │◀────│ API Routes │◀────│ Send URL to    │
│  Results    │     │            │     │ Server API     │
└─────────────┘     └────────────┘     └────────────────┘
                          ▲                     │
                          │                     ▼
                    ┌────────────┐     ┌────────────────┐
                    │ Results    │◀────│ Hugging Face   │
                    │ Processing │     │ Model API      │
                    └────────────┘     └────────────────┘
```

## Directory Structure

```
brain-ai/
├── app/
│   ├── api/                 # API Route Handlers
│   │   ├── goals/
│   │   ├── health-metrics/
│   │   ├── progress/
│   │   └── ...
│   ├── (auth)/              # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── dashboard/
│   ├── games/               # Cognitive games
│   ├── health-tracker/
│   ├── goals/
│   └── ...
├── components/              # Shared components
│   ├── ui/                  # UI primitives from Shadcn
│   ├── charts/              # Data visualization
│   ├── games/               # Game components
│   ├── health-tracker/      # Health tracking components
│   ├── layout/              # Layout components
│   └── ...
├── lib/                     # Utility functions and shared logic
│   ├── auth.mock.ts         # Mock authentication (to be replaced)
│   ├── db.ts                # Database utilities
│   ├── utils.ts             # Helper functions
│   └── ...
├── types/                   # TypeScript type definitions
├── public/                  # Static assets
├── docs/                    # Documentation
└── ...
```

## Key Interfaces

### Health Metrics

```typescript
interface IHealthMetric {
  _id?: string;
  userId: string;
  type: MetricType;
  value: number;
  unit: string;
  timestamp: Date;
  notes?: string;
}

type MetricType = 
  | "blood-pressure" 
  | "heart-rate" 
  | "blood-sugar" 
  | "cholesterol" 
  | "weight" 
  | "sleep" 
  | "steps" 
  | "hydration" 
  | "stress";
```

### User Goals

```typescript
interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  targetDate: Date;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Game Results

```typescript
interface GameResult {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  duration: number;
  difficulty: string;
  cognitiveDomainsEngaged: CognitiveDomain[];
  completedAt: Date;
}

type CognitiveDomain = 
  | "memory" 
  | "attention" 
  | "processing-speed" 
  | "executive-function" 
  | "language";
```

## Authentication Flow

The current mock authentication flow is:

1. API routes are wrapped with the `withAuth` HOC
2. The HOC injects a mock user ID ("user-123456")
3. The handler receives the user ID and processes the request accordingly

The planned production authentication flow will be:

1. User authenticates through Clerk sign-in/sign-up pages
2. Clerk middleware validates authenticated requests
3. API routes extract the real user ID from the session
4. Protected routes verify authentication status

## Performance Optimizations

1. **Server Components**: Used for data fetching and rendering of static/dynamic content
2. **Client Components**: Limited to interactive UI elements that require client-side state
3. **Streaming**: Implemented with suspense boundaries for improved user experience
4. **Image Optimization**: Next.js Image component with proper sizing and formats
5. **Route Handlers**: Used for API endpoints with efficient data processing

## Machine Learning Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  ML Models      │     │  Google Cloud   │     │  Client-side    │
│  trained offline│────►│  Storage        │────►│  inference      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Personalized   │◄────┤  Results stored │◄────┤  Prediction     │
│  user experience│     │  in MongoDB     │     │  generation     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

ML models will be:
1. Trained offline
2. Converted to TensorFlow.js format
3. Stored in Google Cloud Storage
4. Loaded and executed on the client side
5. Results stored in MongoDB for persistence

## Development and Deployment Workflow

1. **Local Development**: Next.js development server with hot reloading
2. **Testing**: Jest for unit tests, Cypress for E2E testing
3. **CI/CD**: GitHub Actions for automated testing and deployment
4. **Deployment**: Vercel for hosting with preview deployments

## Future Architectural Considerations

1. **Microservices**: Consider splitting into microservices as the application grows
2. **Real-time Features**: Integrate WebSockets for real-time collaboration
3. **Edge Computing**: Utilize edge functions for performance-critical operations
4. **Internationalization**: Implement i18n framework for multiple languages
5. **Offline Support**: Add service workers for offline functionality

## Security Considerations

1. **Authentication**: Secure user authentication through Clerk
2. **Data Protection**: All data scoped to user ID
3. **API Security**: Rate limiting and proper error handling
4. **Input Validation**: Server-side validation with Zod schemas
5. **CORS Policies**: Properly configured for API routes
6. **Health Data Privacy**: HIPAA-informed practices for handling sensitive data 