# DeepRacer Board Architecture

DeepRacer Board is a web application for managing AWS DeepRacer leagues, racers, and lap times. It provides a leaderboard system for DeepRacer competitions and includes a timer functionality for tracking lap times.

## Overview

The application is built using a modern web architecture with:

- **Frontend**: React-based single-page application
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

- **LeagueAll**: Displays all available leagues
- **LeagueItem**: Renders a single league with its logo, title, and code
- **LeagueList**: Lists leagues with their details
- **LeagueLogo**: Displays a league's logo
- **RacerList**: Lists racers with their lap times
- **RacerItem**: Renders a single racer with their rank, name, and lap time
- **Popup**: Displays notifications for new records or new challengers
- **Pollen**: Visual effect component for celebrations
- **Scroll**: Handles scrolling to specific racers in the list

### State Management

- Uses React Context API for state management
- `AppContext` and `AppProvider` handle application state

## Backend Architecture

The backend is built using AWS Amplify with the following components:

### API Gateway

Two REST APIs are configured:
- **leagues**: Manages league data
- **racers**: Manages racer data

### Lambda Functions

Two Lambda functions handle the business logic:
- **leagues**: CRUD operations for leagues
- **racers**: CRUD operations for racers and lap times

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

### Racer Management

- Add racers to leagues
- Update racer lap times
- Automatically track best lap times

### Leaderboard

- Display racers sorted by lap time
- Real-time updates
- Visual effects for new records or new challengers

### Timer

- Precise lap time tracking
- Record, save, and manage lap times
- Visual indicators for time limits
- Keyboard shortcuts for timer controls

## Data Flow

1. Users interact with the React frontend
2. API calls are made to the API Gateway endpoints
3. Lambda functions process the requests
4. Data is stored in or retrieved from DynamoDB
5. Results are returned to the frontend
6. Frontend updates the UI accordingly

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
