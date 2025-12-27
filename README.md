# DeepRacer Board

AWS DeepRacer League Management and Leaderboard System built with Next.js 15, NextAuth, and DynamoDB.

## Features

- 🏎️ **League Management**: Create and manage DeepRacer racing leagues
- 🏁 **Real-time Leaderboard**: Live rankings with automatic updates
- ⏱️ **Timer Integration**: Precise lap time tracking
- 🔐 **Authentication**: Secure login with AWS Cognito
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌐 **Production Ready**: Deployed at [dracer.io](https://dracer.io)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: AWS DynamoDB
- **Deployment**: AWS Amplify
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- AWS Account with DynamoDB tables
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nalbam/deepracer-board.git
cd deepracer-board
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your AWS credentials and Google OAuth settings.

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

```env
# Auth Settings
AUTH_ENABLED="true" # 인증 시스템 전체 활성화 여부 (true/false)
AUTH_DEBUG="false"  # 디버그 모드 설정

AUTH_SECRET= # openssl rand -hex 32

AUTH_TRUST_HOST=1

# NextAuth
NEXTAUTH_URL="http://localhost:3000"

# AWS Credentials
AUTH_AWS_REGION="ap-northeast-2"
AUTH_AWS_ACCESS_KEY_ID=
AUTH_AWS_SECRET_ACCESS_KEY=

# Google Auth
AUTH_GOOGLE_ENABLED="true"
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# AWS DynamoDB
NEXT_DYNAMODB_LEAGUES_TABLE="deepracer-board-leagues"
NEXT_DYNAMODB_RACERS_TABLE="deepracer-board-racers"
NEXT_DYNAMODB_USERS_TABLE="deepracer-board-users"
```

## Project Structure

```
deepracer-board/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── leagues/       # League management
│   │   └── racers/        # Racer management
│   ├── league/            # Leaderboard pages
│   ├── login/             # Authentication
│   └── manage/            # Admin pages
├── components/             # React components
│   ├── ui/                # Base UI components
│   ├── league/            # League components
│   └── racer/             # Racer components
├── lib/                   # Utilities and services
│   ├── auth.ts           # NextAuth configuration
│   ├── dynamodb.ts       # DynamoDB client
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── docs/                  # Documentation
```

## API Endpoints

### Leagues
- `GET /api/leagues` - Get user's leagues
- `GET /api/leagues?all=true` - Get all public leagues
- `POST /api/leagues` - Create/update league
- `GET /api/leagues/[id]` - Get specific league
- `DELETE /api/leagues/[id]` - Delete league

### Racers
- `GET /api/racers/[league]` - Get league leaderboard
- `POST /api/racers` - Create/update/delete racer

## Database Schema

### Leagues Table
```
league (PK)    # League code
title          # League title
logo           # Logo URL
dateOpen       # Start date
dateClose      # End date
userId         # Creator ID
registered     # Created timestamp
modified       # Modified timestamp
```

### Racers Table
```
league (PK)    # League code
email (SK)     # Racer email
racerName      # Display name
laptime        # Best lap time (milliseconds)
registered     # Created timestamp
modified       # Modified timestamp
```

### Users Table
```
id (PK)        # User email (lowercase)
email          # User email
name           # Display name
image          # Profile image URL
provider       # OAuth provider (google)
lastLogin      # Last login timestamp
createdAt      # Created timestamp
updatedAt      # Updated timestamp
```

## Deployment

The application is deployed using AWS Amplify:

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
    build:
      commands:
        - env | grep -e AUTH >> .env
        - env | grep -e NEXT >> .env
        - pnpm run build
  artifacts:
    baseDirectory: .next
    files:
      - "**/*"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- **Production**: [dracer.io](https://dracer.io)
- **Documentation**: [docs/](./docs/)
- **Architecture**: [docs/project-analysis.md](./docs/project-analysis.md)
- **Migration Plan**: [docs/nextjs-migration-plan.md](./docs/nextjs-migration-plan.md)
