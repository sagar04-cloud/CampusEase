# CampusEase

CampusEase is a comprehensive, all-in-one smart campus companion web application designed to streamline college management, enhance student-faculty communication, and provide intuitive administrative tools. With separate portals for Students, Faculty, and Administrators, CampusEase digitalizes daily educational operations effectively.

## 🚀 Key Features

*   **Multi-Role Authentication**: Dedicated portals tailored for Students, Teachers (Faculty), and System Administrators.
*   **Intuitive Dashboards**: Visually appealing, real-time charts powered by `Chart.js` for quick data insights (e.g., Attendance, Performance).
*   **Real-Time Data Sync**: Smooth real-time cross-tab synchronization leveraging shared browser storage/events to keep all windows up to date seamlessly.
*   **Smart Campus Requests**: A ticketing system to submit, approve, reject, and track collegiate requests (e.g., event bookings, tech support, equipment).
*   **Announcements System**: Broadcast campus-wide notices dynamically.
*   **AI Chatbot Assistant**: Built-in Google Gemini AI integration to assist students with queries and standard formats (e.g., generating letter drafts).
*   **Event Scheduling**: Interactive campus calendar mapping events effectively, integrated with `FullCalendar`.
*   **Admin Panel Functions**: Add, manage, and view Students, Teachers, and system-wide Reports.

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **Other Libraries**: `Chart.js`, `@fullcalendar/react`, `@google/genai`, `firebase`

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Integrations**: `firebase-admin`, `cors`, `dotenv`

## 📦 Project Setup and Installation

1.  **Clone the Repository** (or download the source):
    ```bash
    git clone https://github.com/sagar04-cloud/CampusEase.git
    cd CampusEase
    ```

2.  **Install Node Modules**:
    You will need to install the dependencies for both the frontend and backend.

    *Open the first terminal (Frontend):*
    ```bash
    cd frontend
    npm install
    ```

    *Open a second terminal (Backend):*
    ```bash
    cd backend
    npm install
    ```

3.  **Run the Development Servers**:
    *In the Frontend terminal:*
    ```bash
    npm run dev
    ```

    *In the Backend terminal:*
    ```bash
    node server.js
    ```

4.  **Open the Application**:
    Vite will start the frontend server, typically at `http://localhost:5173/`. Open this URL in your browser.

## 🧪 Demo Credentials

The login page provides a **"Quick Fill Magic"** button specifically for demonstrating the capabilities of the application. Click it while choosing between Student or Faculty to instantly fill in valid demonstration credentials and explore the robust user interfaces. 

---
*Developed for a more connected campus.*
