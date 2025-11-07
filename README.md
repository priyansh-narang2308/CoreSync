# CoreSync - AI-Powered Fitness Tracker

A modern, cross-platform fitness tracking application built with React Native and Expo. CoreSync helps users track workouts, manage exercises, and get AI-powered guidance for their fitness journey.

## 🚀 Features

- **Workout Tracking**: Track active workouts with real-time timer, sets, reps, and weights
- **Exercise Library**: Browse and search through a comprehensive exercise database
- **AI-Powered Guidance**: Get detailed exercise instructions and tips using Google Gemini AI
- **Workout History**: View past workouts with detailed statistics and analytics
- **User Authentication**: Secure authentpication powered by Clerk
- **Cross-Platform**: Works on iOS, Android, and Web
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and NativeWind
- **State Management**: Efficient state management with Zustand
- **CMS Integration**: Sanity CMS for managing exercises and workout data

## 🛠️ Tech Stack

### Core Framework
- **[Expo](https://expo.dev/)** (v53.0.4) - React Native framework for cross-platform development
- **[React Native](https://reactnative.dev/)** (v0.79.4) - Mobile app framework
- **[React](https://react.dev/)** (v19.0.0) - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Routing & Navigation
- **[Expo Router](https://docs.expo.dev/router/introduction/)** (v5.1.0) - File-based routing system with API routes support
- Protected routes with authentication guards

### Authentication
- **[Clerk](https://clerk.com/)** - Complete authentication solution with Google Sign-In support

### State Management
- **[Zustand](https://github.com/pmndrs/zustand)** (v5.0.8) - Lightweight state management
- Persistent storage with AsyncStorage

### Styling
- **[NativeWind](https://www.nativewind.dev/)** (v4.0.1) - Tailwind CSS for React Native
- **[Tailwind CSS](https://tailwindcss.com/)** (v3.4.0) - Utility-first CSS framework
- **[Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)** - Gradient components

### Backend & Database
- **[Sanity CMS](https://www.sanity.io/)** - Headless CMS for content management
- **[GROQ](https://www.sanity.io/docs/groq)** - Query language for Sanity
- **[Sanity Client](https://www.sanity.io/docs/js-client)** - JavaScript client for Sanity

### AI Integration
- **[Google Gemini AI](https://ai.google.dev/)** - AI-powered exercise guidance
- **[Groq](https://groq.com/)** - AI inference platform


## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- Sanity account
- Clerk account
- Google Cloud account (for Gemini AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coresync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Clerk Authentication
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Sanity CMS
   EXPO_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   EXPO_PUBLIC_SANITY_DATASET=production
   EXPO_PUBLIC_SANITY_API_VERSION=2024-01-01
   SANITY_API_TOKEN=your_sanity_api_token

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Configure Sanity**
   
   Navigate to the sanity directory and install dependencies:
   ```bash
   cd sanity
   npm install
   ```
   
   Update `sanity.config.ts` with your project ID and dataset.

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on your preferred platform**
   - iOS: `npm run ios` or press `i` in the Expo CLI
   - Android: `npm run android` or press `a` in the Expo CLI
   - Web: `npm run web` or press `w` in the Expo CLI

## 🔧 Configuration

### Expo Configuration

The `app.json` file is configured with:
- **Output Mode**: Set to `"server"` for API routes to work (similar to Next.js)
- **Scheme**: Custom URL scheme for deep linking
- **Plugins**: Expo Router plugin configured

### Sanity Schema

The project uses two main schema types:

1. **Exercise Schema** (`sanity/schemaTypes/exercise.ts`)
   - Exercise name, description, difficulty level
   - Image and video URL
   - Active status toggle

2. **Workout Schema** (`sanity/schemaTypes/workout.ts`)
   - User ID (Clerk user ID)
   - Workout date and duration
   - Exercises with sets, reps, weights, and weight units

### API Routes

CoreSync uses Expo Router's API routes (similar to Next.js):

- **`/api/ai`** (POST): Get AI-powered exercise guidance
  - Request body: `{ exerciseName: string }`
  - Returns: Markdown-formatted exercise instructions

- **`/api/save-workout`** (POST): Save workout to Sanity
  - Request body: `{ workoutData: WorkoutData }`
  - Returns: `{ success: boolean, workoutId: string }`

- **`/api/delete-workout`** (DELETE): Delete a workout
  - Request body: `{ workoutId: string }`

## 🎯 Key Features Explained

### Protected Routes

The app uses Expo Router's `Stack.Protected` component to guard routes:
- Authenticated users can access app tabs and exercise details
- Unauthenticated users are redirected to sign-in/sign-up screens

### State Management with Zustand

The workout state is managed using Zustand with persistence:
- Workout exercises and sets
- Weight unit preference (lbs/kgs)
- Persistent storage using AsyncStorage

### Real-Time Workout Timer

Uses `react-timer-hook` to track workout duration:
- Auto-start timer when workout begins
- Track total seconds for workout duration
- Reset functionality

### GROQ Queries

Uses GROQ (Graph-Relational Object Queries) for fetching data from Sanity:
- Type-safe queries with `defineQuery`
- Efficient data fetching with references
- Filtered and sorted results


## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run deploy` - Build and deploy the app

## 🏗️ Development

### Adding New Exercises

1. Access Sanity Studio (usually at `http://localhost:3333`)
2. Navigate to the Exercise schema
3. Add new exercise with name, description, difficulty, and image
4. Exercises will automatically appear in the app

### Creating API Routes

API routes follow the Next.js convention:
- Create files with `+api.ts` extension in the `app/api/` directory
- Export HTTP method functions (GET, POST, PUT, DELETE)
- Use `Request` and `Response` objects


## 🔐 Security Notes

- Never commit `.env` files to version control
- Keep API keys secure and rotate them regularly
- Use Sanity's token-based authentication for mutations
- Clerk handles all authentication security

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainer.


