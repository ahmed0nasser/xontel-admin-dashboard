# HR Feedback Admin Panel

This project is an administrative dashboard designed to manage HR feedback and facilitate real-time communication with employees. Built as part of the Xontel Coding Challenge, it provides a comprehensive overview of employee feedback, detailed filtering capabilities, and an interactive chat interface.

## [Demo](https://drive.google.com/file/d/16Vi7plwzvmSvM5V5Wy3Ff9E3GMbGsWb8/view?usp=sharing)

## Features

- **Dashboard Overview**:
  - Summary of total feedback, recent feedback, and average scores.
  - Visual representation of KPI score distribution using a responsive pie chart.
  - Trends for feedback and popularity changes over the last 7 days.
- **Feedback Management**:
  - **Detailed Feedback Table**: View all employee feedback in a paginated table.
  - **Advanced Filtering**: Filter feedback by:
    - Date (before, after, or at a specific date)
    - Employee Name
    - Score (1-5 stars)
    - Keywords within notes
  - **Filter Management**: Easily apply, view, and reset active filters.
- **Real-time Chat**:
  - **Conversation List**: View a list of ongoing conversations with employees.
  - **Unread Indicators**: Real-time badges display the number of unread messages for each conversation and a total unread count in the sidebar.
  - **Interactive Chat Box**: Send and receive messages in real-time with selected employees.
  - **Message Grouping**: Messages are grouped by date for better readability.
- **User Authentication**: Secure login and user management.
- **Responsive Design**: Optimized for various screen sizes, from desktop to mobile, with a collapsible sidebar.

## Technologies Used

- **Frontend**:
  - [React](https://react.dev/) (with TypeScript) - A JavaScript library for building user interfaces.
  - [Vite](https://vitejs.dev/) - A fast build tool for modern web projects.
  - [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
  - [React Router DOM](https://reactrouter.com/en/main) - Declarative routing for React.
  - [ECharts](https://echarts.apache.org/en/index.html) (via `echarts-for-react`) - A powerful charting and visualization library.
  - [React Select](https://react-select.com/home) - Flexible and accessible React select control.
  - [React Icons](https://react-icons.github.io/react-icons/) - Popular icon library.
- **Backend & Database**:
  - [Firebase](https://firebase.google.com/) - Google's mobile and web application development platform.
    - **Firestore**: NoSQL cloud database for real-time data synchronization.
    - **Authentication**: For user sign-up and sign-in.

## Project Structure

The project follows a clear and modular structure:

```
.
├── public/                 # Static assets
├── src/
│   ├── assets/             # Application-specific images/icons
│   ├── components/         # Reusable UI components (e.g., layout, charts, generic UI)
│   │   ├── charts/
│   │   ├── layout/
│   │   └── ui/
│   ├── config/             # Firebase configuration
│   ├── context/            # React Context for global state (e.g., AuthContext)
│   ├── data/               # Mock data for development/seeding
│   ├── features/           # Self-contained features (e.g., feedback-table)
│   │   ├── feedback-table/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── ...
│   ├── pages/              # Main application views (e.g., Dashboard, Chat)
│   ├── router/             # Application routing setup
│   ├── scripts/            # Utility scripts (e.g., database seeding)
│   ├── services/           # Firebase interaction logic
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions (e.g., formatters)
├── .gitignore              # Git ignore rules
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── pnpm-lock.yaml          # PNPM lock file
├── README.md               # Project README
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (or npm/yarn)
- A Firebase project with Firestore and Authentication enabled.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd admin-dashboard
    ```
2.  **Install dependencies**:
    ```bash
    pnpm install
    ```
3.  **Firebase Configuration**:
    - Create a `.env.local` file in the project root.
    - Add your Firebase project configuration details:
      ```
      VITE_FIREBASE_API_KEY="YOUR_API_KEY"
      VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
      VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
      VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
      VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
      VITE_FIREBASE_APP_ID="YOUR_APP_ID"
      ```
    - Ensure you have a user with `role: "hr"` in your Firebase Firestore `employees` collection for the admin panel to function correctly.
    - Optionally, run the seeding scripts to populate your Firestore with initial data (see "Seeding Data" section below).

### Running the Application

To start the development server:

```bash
pnpm dev
```

The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To build the application for production:

```bash
pnpm build
```

The optimized production build will be generated in the `dist/` directory.

## Firebase Firestore DB Schema

![db-schema](/assets/db-schema.png)

## Seeding Data (Optional)

The project includes scripts to seed your Firebase Firestore with initial employee, conversation, and feedback data.

1.  **Ensure Firebase is configured** as described in the "Installation" section.
2.  **Run the seeding scripts**:
    ```bash
    pnpm seed-feedback
    pnpm seed-employees
    ```
    _Note: You might need to install `tsx` globally or locally if you haven't already (`pnpm add -D tsx`)._
