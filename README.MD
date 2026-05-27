# MedHirely 🏥

> MedHirely is a mobile-first healthcare staffing marketplace that enables verified healthcare professionals to discover and apply for temporary healthcare shifts in real time.

---

## About

MedHirely connects nurses, doctors, and pharmacists with healthcare facilities that need temporary staff. Workers create an account, get verified by our admin team, and can immediately start browsing and applying for available shifts — all from their mobile device.

---

## Tech Stack

- **Framework:** React Native (Expo SDK 56)
- **Language:** TypeScript
- **Navigation:** React Navigation v6 (Native Stack + Bottom Tabs)
- **State Management:** Context API
- **HTTP Client:** Axios
- **Storage:** AsyncStorage
- **Icons:** @expo/vector-icons (Ionicons)

---

## Project Structure

```
src/
├── assets/              # Images, fonts, and static files
├── components/          # Reusable UI components
├── context/
│   └── AuthContext.tsx  # Global auth and user state
├── hooks/               # Custom React hooks
├── navigation/
│   ├── AppNavigator.tsx      # Root navigator (3-state logic)
│   ├── AuthStack.tsx         # Unauthenticated screens
│   ├── MainTabs.tsx          # Main app bottom tabs
│   └── VerificationStack.tsx # Credential verification flow
├── screens/
│   ├── auth/
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   └── ForgotPasswordScreen.tsx
│   ├── verification/
│   │   ├── UploadCredentialsScreen.tsx
│   │   └── PendingVerificationScreen.tsx
│   ├── shifts/
│   │   └── ShiftsScreen.tsx
│   ├── applications/
│   │   └── ApplicationsScreen.tsx
│   ├── notifications/
│   │   └── NotificationsScreen.tsx
│   ├── earnings/
│   │   └── EarningsScreen.tsx
│   └── profile/
│       └── ProfileScreen.tsx
├── services/
│   ├── api.ts            # Axios instance + interceptors
│   ├── auth.ts           # Auth service (mocked)
│   ├── shifts.ts         # Shifts service (mocked)
│   └── applications.ts   # Applications service (mocked)
├── theme/
│   ├── colors.ts         # Brand color tokens
│   └── typography.ts     # Font sizes and weights
└── utils/               # Helper functions
```

---

## App Flow

The app has **3 navigation states** based on user status:

```
Not Logged In       →  Auth Stack
                       (Splash → Onboarding → Login / Signup)

Logged In           →  Verification Stack
(Unverified)           (Upload Credentials → Pending Verification)

Logged In           →  Main App
(Verified)             (Shifts | Applications | Notifications | Earnings | Profile)
```

---

## Features

### ✅ Completed
- Animated Splash Screen
- 3-slide Onboarding with swipe gestures and animated dots
- Login with email and password
- Signup with form validation
- Forgot Password with success state
- Credential upload flow (License, Certifications, ID, CV)
- Pending verification screen with step tracker
- 3-state navigation (unauthenticated → unverified → verified)
- JWT token handling with AsyncStorage
- Centralized API service layer with Axios interceptors
- Global auth state via Context API

### 🔨 In Progress
- Shift Marketplace (feed, filters, shift detail)
- My Applications (apply, track status)
- Notifications
- Earnings Dashboard
- Profile Management

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Expo CLI
- Expo Go app on your mobile device

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/medhirely.git

# Navigate into the project
cd medhirely

# Install dependencies
npm install

# Start the development server
npx expo start
```

Scan the QR code with **Expo Go** on your Android or iOS device.

---

## Environment

All API calls are currently **mocked** for MVP development. When the backend is ready, update the base URL in:

```
src/services/api.ts
```

```typescript
const BASE_URL = 'https://your-api-url.com/api';
```

---

## Team

| Role | Responsibility |
|------|---------------|
| Mobile Dev | React Native app (this repo) |
| Backend Dev | REST API, authentication, admin dashboard |
| UI/UX Design | Wireframes, Figma designs, user flows |

---

## License

This project was built as part of the **TechCrush Mobile Development Bootcamp** Capstone Project.

---

*Built with 💙 by the MedHirely Mobile Team*
