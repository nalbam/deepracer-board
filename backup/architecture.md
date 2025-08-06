# DeepRacer Board Architecture

DeepRacer Board is a web application for managing AWS DeepRacer leagues, racers, and lap times. It provides a leaderboard system for DeepRacer competitions and includes a timer functionality for tracking lap times.

## Overview

The application is built using a modern web architecture with:

- **Frontend**: React-based single-page application (SPA)
- **Backend**: AWS Amplify with serverless functions
- **Database**: Amazon DynamoDB
- **Authentication**: Amazon Cognito
- **Hosting**: AWS Amplify Hosting (S3 and CloudFront)
- **Storage**: Amazon S3 for storing league logos

## System Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │─────▶│  API Gateway    │─────▶│  Lambda         │
│                 │      │                 │      │  Functions      │
└─────────────────┘      └─────────────────┘      └────────┬────────┘
                                                           │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │                 │
                                                  │  DynamoDB       │
                                                  │                 │
                                                  └─────────────────┘
                                                           ▲
                                                           │
┌─────────────────┐      ┌─────────────────┐      ┌───────┴─────────┐
│                 │      │                 │      │                 │
│  S3 Storage     │◀────▶│  Cognito        │─────▶│  Lambda         │
│  (Logos)        │      │  Authentication │      │  Functions      │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Frontend Architecture

The frontend is built with React and organized into the following structure:

### Pages

- **Leaderboard**: Displays racers and their lap times for a specific league
- **Manage**: Entry point for managing leagues and racers
- **ManageLeague**: Interface for creating and updating leagues
- **ManageRacer**: Interface for adding and updating racers
- **Timer**: Standalone timer functionality for tracking lap times

### Components

- **LeagueAll**: Displays all available leagues (uses `/items/all` API endpoint)
- **LeagueList**: Lists user's leagues (uses `/items` API endpoint)
- **LeagueItem**: Renders a single league with its logo, title, and code
- **LeagueForm**: Provides form for creating and editing leagues
- **LeagueHeader**: Simple header displaying league logo and title
- **LeagueLogo**: Displays league logo with animation effects
- **RacerList**: Lists racers with their lap times (auto-refreshes every 5 seconds)
- **RacerItem**: Renders a single racer with their rank, name, and lap time (top 3 display trophy icon)
- **RacerForm**: Provides form for creating, editing, and deleting racers
- **Popup**: Displays notifications for new records or new challengers
- **Pollen**: Visual effect component for celebrations (colorful particle animations)
- **Scroll**: Handles scrolling to specific racers in the list
- **Logo**: Displays logo and title as a popup
- **QRCode**: Displays QR code encoding league page URL

### State Management

- Uses React Context API for state management
- `AppContext` and `AppProvider` handle application state

## Backend Architecture

The backend is built using AWS Amplify with the following components:

### API Gateway

Two REST APIs are configured:
- **leagues**: Manages league data
  - GET `/items`: Retrieves user's leagues list
  - GET `/items/all`: Retrieves all leagues list
  - GET `/items/object/:league`: Retrieves specific league information
  - PUT `/items`: Creates or updates a league
  - POST `/items`: Creates or updates a league
  - DELETE `/items/object/:league`: Deletes a league
- **racers**: Manages racer data
  - GET `/items/:league`: Retrieves racers list for a specific league
  - GET `/items/object/:league/:email`: Retrieves specific racer information
  - PUT `/items`: Creates or updates a racer
  - POST `/items`: Creates, updates, or deletes a racer (using forceDelete parameter)
  - DELETE `/items/object/:league/:email`: Deletes a racer

### Lambda Functions

Two Lambda functions handle the business logic:
- **leagues**: CRUD operations for leagues
- **racers**: CRUD operations for racers and lap times (includes best time preservation logic)

### DynamoDB Tables

Two main tables store the application data:
- **deepracer-board-leagues**: Stores league information
  - Partition key: `league` (league code)
  - Attributes: `title`, `logo`, `dateOpen`, `dateClose`, `dateTZ`, `registered`, `modified`, `userId`

- **deepracer-board-racers**: Stores racer information
  - Partition key: `league` (league code)
  - Sort key: `email` (racer email)
  - Attributes: `racerName`, `laptime`, `registered`, `modified`, `userId`

### Storage

- **leagues**: S3 bucket for storing league-related data
- **logos**: S3 bucket for storing league logos
- **racers**: S3 bucket for storing racer-related data

### Authentication

- Uses Amazon Cognito for user authentication
- Supports user sign-up, sign-in, and access control

## Key Features

### League Management

- Create and update leagues
- Set league details (title, logo, dates)
- View all leagues
- Unique identification through league code
- League logo URL setting and preview

### Racer Management

- Add racers to leagues
- Update racer lap times
- Automatically track best lap times (preserves existing best time when updating with slower time)
- Racer deletion functionality
- Unique identification through email

### Leaderboard

- Display racers sorted by lap time
- Real-time updates every 5 seconds
- Visual effects for new records or new challengers
- Trophy icon for top 3 racers
- Auto-scroll functionality to show all participants

### Timer

- Precise lap time tracking (millisecond precision)
- Record, save, and manage lap times
- Visual indicators for time limits (yellow and red warnings)
- Keyboard shortcuts for timer controls
- Best lap time and last lap time display
- Lap time cancellation and rejection functionality
- Sound effects for new records

## Data Flow

1. Users interact with the React frontend
2. API calls are made to the API Gateway endpoints
3. Lambda functions process the requests
   - Leagues function: Create, retrieve, update, delete leagues
   - Racers function: Create, retrieve, update, delete racers and manage lap times
4. Data is stored in or retrieved from DynamoDB
   - Leagues table: Stores league information
   - Racers table: Stores racer information and lap times
5. Results are returned to the frontend
6. Frontend updates the UI accordingly
   - Visual effects for new records or new challengers
   - Racers sorted by lap time

## Visual Effects and User Experience

- **Pollen Component**: Colorful particle animation effects for celebrations
- **Popup Component**: Notifications for new records or new challengers
- **Logo Component**: Popup effect highlighting league logo and title
- **Sound Effects**: Audio feedback for new records
- **Auto-scroll**: Automatic scrolling to specific racers to draw attention
- **QR Code**: QR code for easy access to league pages

## Deployment

The application is deployed using AWS Amplify, which provides:
- CI/CD pipeline
- Hosting on S3 with CloudFront distribution
- Backend provisioning and deployment

## External Links

- Production site: https://dracer.io/
- Alternative URL: https://deepracerboard.com/
- Timer functionality: https://dracer.io/timer
- Related project: https://github.com/nalbam/deepracer-timer
