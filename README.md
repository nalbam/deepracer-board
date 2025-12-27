# DeepRacer Board

AWS DeepRacer League Management and Leaderboard System built with Next.js 15, NextAuth, and DynamoDB.

## Features

### Core Features
- 🏎️ **League Management**: Create, edit, and delete DeepRacer racing leagues
- 🏁 **Real-time Leaderboard**: Live rankings with 3-second auto-refresh
- ⏱️ **Timer Integration**: Precise lap time tracking with MM:SS.mmm format
- 🔐 **Authentication**: Secure Google OAuth login with NextAuth.js
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌐 **Production Ready**: Deployed at [deepracerboard.com](https://deepracerboard.com)

### Advanced Features
- 🎉 **Event Detection System**: 6-type priority-based event system
  - New Champion, Champion Record, Top 3 Entry, First Lap, New Racer, Record Update
- 📜 **Auto-scroll**: Automatic scrolling through leaderboard every 10 minutes
- ✏️ **Click-to-Edit Racers**: Select racers from list to edit lap times
- 🗑️ **Safe League Deletion**: Confirmation modal with league code verification
- 🎨 **Visual Effects**: Confetti, popups, logo displays, and QR codes
- 🔄 **Legacy Data Support**: Automatic conversion of old string-based lap times

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Custom CSS + shadcn/ui components
- **Authentication**: NextAuth.js v5 with Google OAuth
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
# NextAuth Settings
AUTH_SECRET=                              # openssl rand -hex 32
NEXTAUTH_URL="http://localhost:3000"      # Deployment URL

# AWS Credentials
AUTH_AWS_REGION="ap-northeast-2"
AUTH_AWS_ACCESS_KEY_ID=
AUTH_AWS_SECRET_ACCESS_KEY=

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# DynamoDB Tables
NEXT_DYNAMODB_LEAGUES_TABLE="deepracer-board-leagues"
NEXT_DYNAMODB_RACERS_TABLE="deepracer-board-racers"
NEXT_DYNAMODB_USERS_TABLE="deepracer-board-users"
```

## Project Structure

```
deepracer-board/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/       # NextAuth API route
│   │   ├── leagues/
│   │   │   ├── route.ts              # GET/POST leagues
│   │   │   └── [league]/route.ts     # GET/DELETE specific league
│   │   └── racers/
│   │       ├── route.ts              # POST racer
│   │       └── [league]/route.ts     # GET/DELETE racers
│   ├── league/[league]/page.tsx      # Leaderboard page
│   ├── login/page.tsx                # Login page
│   ├── manage/
│   │   ├── page.tsx                  # Dashboard
│   │   ├── league/
│   │   │   ├── page.tsx              # Create league
│   │   │   └── [league]/page.tsx     # Edit league
│   │   └── racers/[league]/page.tsx  # Manage racers
│   ├── timer/
│   │   ├── page.tsx                  # Timer (no limit)
│   │   └── [min]/page.tsx            # Timer (with limit)
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── deepracer.css                 # Main CSS
├── components/
│   ├── common/
│   │   ├── app-header.tsx            # Unified navbar
│   │   └── modal.tsx                 # Reusable modal
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   ├── effects/
│   │   ├── pollen.tsx                # Confetti effect
│   │   ├── popup.tsx                 # Racer popup
│   │   ├── scroll.tsx                # Auto scroll
│   │   ├── logo-popup.tsx            # League logo
│   │   └── qrcode.tsx                # QR code
│   ├── league/
│   │   ├── league-card.tsx           # League card
│   │   ├── league-form.tsx           # Create/Edit form
│   │   ├── league-list.tsx           # Public leagues
│   │   ├── my-leagues.tsx            # User's leagues
│   │   └── delete-league-modal.tsx   # Delete confirmation
│   ├── racer/
│   │   ├── racer-form.tsx            # Add/Edit racer
│   │   ├── racer-manager.tsx         # Racer list manager
│   │   └── leaderboard.tsx           # Leaderboard with events
│   ├── timer/
│   │   └── timer.tsx                 # Timer component
│   ├── manage/
│   │   ├── logout-button.tsx         # Logout button
│   │   └── manage-header.tsx         # Manage page header
│   ├── theme-provider.tsx            # Theme provider
│   └── providers.tsx                 # App providers
├── lib/
│   ├── actions/
│   │   └── auth.ts                   # Auth actions
│   ├── types/
│   │   └── next-auth.d.ts            # NextAuth types
│   ├── auth.ts                       # NextAuth config
│   ├── dynamodb.ts                   # DynamoDB client
│   ├── types.ts                      # TypeScript types
│   └── utils.ts                      # Utilities
└── docs/
    ├── architecture.md               # Architecture
    └── data-models.md                # Data models
```

## API Endpoints

### Leagues
- `GET /api/leagues` - Get user's leagues
- `GET /api/leagues?all=true` - Get all public leagues
- `POST /api/leagues` - Create/update league
- `GET /api/leagues/[league]` - Get specific league
- `DELETE /api/leagues/[league]` - Delete league (requires ownership)

### Racers
- `GET /api/racers/[league]` - Get league leaderboard with rankings
- `POST /api/racers` - Create/update racer lap time
- `DELETE /api/racers/[league]` - Delete all racers in league (requires ownership)

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

## Recent Updates (2025-12-28)

### New Features
- ✅ **League Deletion**: Added confirmation modal requiring league code verification
- ✅ **Unified Navigation**: Created AppHeader component used across all pages
- ✅ **Racer Selection**: Click-to-edit functionality for managing racer lap times
- ✅ **Event Detection**: 6-type priority-based event system for leaderboard celebrations
- ✅ **Auto-scroll**: Automatic leaderboard scrolling every 10 minutes with custom easing
- ✅ **Modal Component**: Reusable modal with ESC and backdrop click support
- ✅ **Bulk Racer Deletion**: API endpoint to delete all racers before league deletion

### Bug Fixes
- ✅ **Auto-scroll Not Working**: Fixed useEffect dependency causing countdown reset
  - Root cause: `items` prop triggering re-execution on data fetch (every 3 seconds)
  - Solution: Used `useRef` and `useCallback` to stabilize dependencies
- ✅ **Auto-trigger Detection**: Switched to email-based tracking instead of index-based
- ✅ **Event Popup Display**: Removed blocking check that prevented popup from showing
- ✅ **Legacy Laptime Data**: Added automatic conversion from string to number format
- ✅ **First Lap Classification**: Added rank-based event type detection
- ✅ **New Racer Classification**: Proper event type for new racers entering top positions

### Improvements
- ✅ **Button Standardization**: Unified all button styles (14px font, consistent padding)
- ✅ **Scroll Animation**: Custom easeInOutCubic function with racer count proportional duration
- ✅ **Event Priorities**:
  - NEW_CHAMPION (priority 10)
  - CHAMPION_RECORD (priority 8)
  - TOP3_ENTRY (priority 6)
  - FIRST_LAP (priority 4)
  - NEW_RACER (priority 4)
  - RECORD_UPDATE (priority 2)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- **Production**: [deepracerboard.com](https://deepracerboard.com)
- **Documentation**: [docs/](./docs/)
- **Architecture**: [docs/architecture.md](./docs/architecture.md)
- **Data Models**: [docs/data-models.md](./docs/data-models.md)
