# A Real-time Chat Application

## Overview

A full-stack chat application built with React JS and Firebase. It allows users to create an account, chat with friends in real-time, and share images directly within the chat. The app leverages Firebase for user authentication, real-time message synchronization, and secure image storage, providing a seamless and responsive chatting experience.

## Features

- **User Authentication**: Secure user account creation and login using Firebase Authentication.
- **Real-time Messaging**: Messages are stored in Firebase Firestore and are updated in real-time across all connected users.
- **Image Sharing**: Users can share images within the chat, with the images stored securely in Firebase Storage.
- **Responsive UI**: Built with React JS, the app offers a smooth and intuitive user experience across devices.

## Tech Stack

- **Frontend**: React JS
- **Backend**: Firebase (Authentication, Firestore Database, Storage)
- **Hosting**: Firebase Hosting

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shaw145/Real-time-Chat-Application.git
   cd Real-time-Chat-Application

2. Install dependencies:
```bash
    npm install
```

3. Create a Firebase project and configure Firebase in your React app:

- Go to the Firebase Console.
- Create a new project.
- Add a new web app and copy the Firebase config object.
- Replace the Firebase configuration in your project with the new config details.

4. Run the app:
```bash
    npm run dev
```

## Usage

- Sign up or log in using your email and password.
- Start a new chat with your friends by searching for their usernames.
- Send text messages and share images in real-time.


## Author
imdad khan

## Resources

- [**GreatStack**](https://www.youtube.com/@GreatStackDev)




Real-time-Chat-Application-master   fyp project/
├─ .gitignore
├─ .idea/
│  ├─ inspectionProfiles/
│  │  └─ profiles_settings.xml
│  ├─ modules.xml
│  ├─ Real-time-Chat-Application-master.iml
│  └─ workspace.xml
├─ app/
├─ index.html
├─ package-lock.json
├─ package.json
├─ public/
│  ├─ background.png
│  ├─ chat_app.svg
│  └─ vite.svg
├─ README.md
└─ src/
   ├─ App.jsx
   ├─ assets/
   │  ├─ add_icon.png
   │  ├─ arrow_icon.png
   │  ├─ assets.js
   │  ├─ avatar_icon.png
   │  ├─ gallery_icon.png
   │  ├─ green_dot.png
   │  ├─ help_icon.png
   │  ├─ img1.jpg
   │  ├─ img2.jpg
   │  ├─ logo.png
   │  ├─ logo_big.png
   │  ├─ logo_icon.png
   │  ├─ menu_icon.png
   │  ├─ pic1.png
   │  ├─ pic2.png
   │  ├─ pic3.png
   │  ├─ pic4.png
   │  ├─ profile_alison.png
   │  ├─ profile_enrique.png
   │  ├─ profile_marco.png
   │  ├─ profile_martin.png
   │  ├─ profile_richard.png
   │  ├─ react.svg
   │  ├─ search_icon.png
   │  └─ send_button.png
   ├─ components/
      LLM
        LLM chatbot.css
        LLM Chatbot.jsx
   │  ├─ ChatBox/
   │  │  ├─ ChatBox.css
   │  │  └─ ChatBox.jsx
   │  ├─ LeftSidebar/
   │  │  ├─ LeftSidebar.css
   │  │  └─ LeftSidebar.jsx
   │  └─ RightSidebar/
   │     ├─ RightSidebar.css
   │     └─ RightSidebar.jsx
   ├─ config/
   │  └─ firebase.js
   ├─ context/
   │  └─ AppContext.jsx
   ├─ index.css
   ├─ lib/
   │  └─ upload.js
   ├─ main.jsx
   └─ pages/
      ├─ Chat/
      │  ├─ Chat.css
      │  └─ Chat.jsx
      ├─ Login/
      │  ├─ Login.css
      │  └─ Login.jsx
      └─ ProfileUpdate/
         ├─ ProfileUpdate.css
         └─ ProfileUpdate.jsx

