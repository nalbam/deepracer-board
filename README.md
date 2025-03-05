# DeepRacer Board

[![GitHub release](https://img.shields.io/github/release/nalbam/deepracer-board.svg)](https://github.com/nalbam/deepracer-board/releases)
[![License](https://img.shields.io/github/license/nalbam/deepracer-board.svg)](https://github.com/nalbam/deepracer-board/blob/master/LICENSE)

A web application for managing AWS DeepRacer leagues, racers, and lap times. It provides a leaderboard system for DeepRacer competitions and includes a timer functionality for tracking lap times.

## Live Demo

- Production site: [https://dracer.io/](https://dracer.io/)
- Timer functionality: [https://dracer.io/timer](https://dracer.io/timer)

## Features

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

## Technology Stack

- **Frontend**: React-based single-page application (SPA)
- **Backend**: AWS Amplify with serverless functions
- **Database**: Amazon DynamoDB
- **Authentication**: Amazon Cognito
- **Hosting**: AWS Amplify Hosting (S3 and CloudFront)
- **Storage**: Amazon S3 for storing league logos

## Getting Started

### Prerequisites

- Node.js and npm
- AWS Account
- AWS Amplify CLI

### Installation

1. Install and configure the Amplify CLI:

```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. Clone the repository:

```bash
git clone https://github.com/nalbam/deepracer-board.git
cd deepracer-board
```

3. Install dependencies:

```bash
npm install
```

4. Initialize Amplify:

```bash
amplify init
```

5. Add authentication:

```bash
amplify auth add
```

6. Add analytics:

```bash
amplify analytics add
```

7. Add API:

```bash
amplify api add
```

8. Push the configuration to AWS:

```bash
amplify push
```

9. Pull the configuration from AWS:

```bash
amplify pull --appId d4dv0vnpaosfd --envName dev
```

### Local Development

Start the local development server:

```bash
npm start
```

The application will be available at http://localhost:3000

## Deployment

1. Add hosting:

```bash
amplify hosting add
```

2. Publish the application:

```bash
amplify publish
```

### URL Rewrite Rules

Add the following rewrite rule to your hosting configuration:

```
</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|json|mp3)$)([^.]+$)/>	    /index.html    200
```

## Project Structure

```
deepracer-board/
├── amplify/                # AWS Amplify configuration
│   ├── backend/            # Backend resources
│   │   ├── analytics/      # Analytics configuration
│   │   ├── api/            # API configuration
│   │   ├── auth/           # Authentication configuration
│   │   ├── function/       # Lambda functions
│   │   ├── hosting/        # Hosting configuration
│   │   └── storage/        # Storage configuration
├── public/                 # Public assets
│   ├── fonts/              # Font files
│   ├── images/             # Image files
│   └── sounds/             # Sound files
├── src/                    # Source code
│   ├── component/          # React components
│   ├── config/             # Configuration files
│   ├── context/            # React context
│   └── pages/              # Page components
├── architecture.md         # Architecture documentation
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Related Projects

- [DeepRacer Timer](https://github.com/nalbam/deepracer-timer) - Standalone timer for AWS DeepRacer

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
