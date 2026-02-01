# WOTR - Workout Tracker

WOTR is a personal workout tracking application built with React, TypeScript, and Vite. It allows you to track your workouts, monitor your progress, and view your history.

## Features

-   **Workout Plans**: Supports AB split workout routines.
-   **Exercise Tracking**: Log sets, reps, and weights for each exercise.
-   **History**: View past workouts and completed exercises.
-   **Persistence**: Data is stored securely using Firebase Firestore.
-   **Responsive Design**: Built with Tailwind CSS for a mobile-first experience.
-   **RTL Support**: Designed with Right-to-Left support for Hebrew users.

## Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand
-   **Backend/Database**: Firebase Firestore
-   **Icons**: Lucide React

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/wotr.git
    cd wotr
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Setup Access Control (Critical):**
    For security, the app requires you to whitelist your email address in Firestore.

    1.  Go to the **Firebase Console** -> **Firestore Database**.
    2.  Start a new collection named `config` and add a document ID `access`.
    3.  Add a field:
        -   **Field name**: `allowedEmails`
        -   **Type**: `array`
        -   **Value**: Add your email address(es), e.g., `"your-email@gmail.com"`.
    4.  Save the document.

5.  Run the development server:
    ```bash
    npm run dev
    ```

## Deployment

To deploy the application and security rules to Firebase Hosting:

```bash
# Install Firebase Tools if needed
npm install -g firebase-tools

# Login
firebase login

# Deploy
npx --package firebase-tools firebase deploy --project your_project_id
```

This will build the application and deploy it to your Firebase Hosting URL.

## License

MIT
