# JUST ASK - Audience Survey App

## 🎯 Overview

**JUST ASK** is a React Native mobile application designed to help content creators, influencers, and community leaders connect with their audience through surveys and feedback collection. The app enables users to easily gather insights from their audience, fans, subscribers, friends, and classmates.

## 🏗️ Architecture

### **Frontend** (React Native + Expo)

- **Framework**: React Native with Expo SDK
- **Navigation**: React Navigation v7 with native stack navigator
- **State Management**: Zustand for authentication and app state
- **Form Handling**: React Hook Form for user input validation
- **Authentication**: Google OAuth 2.0 integration
- **Platform Support**: iOS, Android, and Web

### **Backend** (Node.js + Express)

- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens + Google OAuth verification
- **API**: RESTful endpoints for user management and surveys
- **Security**: CORS enabled, token-based authentication

## 🚀 Key Features

### **Authentication Flow**

- Google OAuth 2.0 sign-in integration
- Secure JWT token management
- Persistent authentication state
- Cross-platform compatibility

### **User Onboarding**

- Profile creation with personal details
- Social media handle integration
- Demographic information collection
- Progressive onboarding experience

### **Core Functionality** (In Development)

- Dashboard for survey management
- Audience engagement tools
- Real-time feedback collection
- Analytics and insights

## 📱 App Screens

1. **Welcome Screen** - Google OAuth login
2. **Onboarding Screen** - Profile setup and personal information
3. **Profile Created Screen** - Confirmation and next steps
4. **Dashboard** - Main app interface (coming soon)

## 🛠️ Technology Stack

### Frontend Dependencies

```json
{
  "expo": "~53.0.20",
  "react": "19.0.0",
  "react-native": "0.79.5",
  "@react-navigation/native": "^7.1.16",
  "zustand": "^5.0.7",
  "react-hook-form": "^7.61.1",
  "expo-auth-session": "~6.2.1"
}
```

### Backend Dependencies

```json
{
  "express": "^5.1.0",
  "mongodb": "^5.0.0",
  "mongoose": "^8.17.0",
  "google-auth-library": "^10.2.0",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5"
}
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Google OAuth credentials
- Expo CLI (for mobile development)

### Backend Setup

1. Copy `.env.example` to `.env`
2. Update `.env` with your MongoDB connection string
3. Run `npm install` in the backend directory
4. Test connection: `node test-direct-connection.js`
5. Start the server: `npm start`

### Frontend Setup

1. Run `npm install` in the frontend directory
2. Start the app: `npm start`
3. Press `w` for web or scan QR code for mobile

### Environment Variables

Create a `.env` file in the backend directory with:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID_WEB=your_google_client_id
GOOGLE_CLIENT_SECRET_WEB=your_google_client_secret
```

## 📂 Project Structure

```
/frontend
  /src
    /components
    /screens
    /stores
    /utils
    App.js
    AppNavigator.js
    index.js
/backend
  /controllers
  /models
  /routes
  /utils
  server.js
  test-direct-connection.js
```

## 🔐 API Endpoints

- `POST /api/auth/google` - Google OAuth authentication
- `PATCH /api/users/onboarding` - User profile setup
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/profile` - Update user profile

## 🎨 App Identity

- **Bundle ID**: `com.laroiare.just-ask`
- **App Name**: JUST ASK
- **Version**: 1.0.0
- **Platforms**: iOS 15.1+, Android, Web

## 🔄 Current Status

✅ **Completed**

- Google OAuth authentication
- User onboarding flow
- Profile creation and management
- Cross-platform navigation
- MongoDB integration

🚧 **In Development**

- Dashboard interface
- Survey creation tools
- Audience management
- Analytics features

## 📝 Development Notes

- Uses localhost for local development API calls
- Implements comprehensive error handling and logging
- Follows React Native best practices
- TypeScript enabled for type safety
- Expo managed workflow for easier development

This app is designed to be a comprehensive platform for audience engagement and feedback collection, currently in active development with core authentication and onboarding features completed.
