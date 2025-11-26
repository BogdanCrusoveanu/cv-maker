# CV Maker

A modern, interactive CV builder application that allows users to create, customize, and export professional resumes.

## 🚀 Features

*   **Real-time Editing:** See changes instantly as you type.
*   **Multiple Templates:** Choose from a variety of professionally designed templates (Midnight, Slate, Azure, Citrus, Classic, Minimal, Modern, Noir).
*   **Customizable Layout:** Reorder sections globally to fit your needs.
*   **Rich Text Support:** Add details to your experience and education.
*   **PDF Export:** Download your CV as a high-quality PDF.
*   **Photo Upload:** Add a personal touch with a profile photo.
*   **Responsive Design:** Works on various screen sizes.

## 🛠️ Technologies Used

### Frontend (`/ui`)
*   **Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Routing:** [React Router DOM](https://reactrouter.com/)
*   **State Management/Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **PDF Generation:** [jspdf](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)

### Backend (`/api`)
*   **Framework:** ASP.NET Core Web API
*   **Language:** C#
*   **Database ORM:** Entity Framework Core (implied by Migrations/Data folders)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (Latest LTS recommended)
*   [.NET SDK](https://dotnet.microsoft.com/download) (Compatible with the project's target framework)

## 🏃‍♂️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cv-maker
```

### 2. Backend Setup (`/api`)

Navigate to the API directory and run the application:

```bash
cd api
# Restore dependencies (optional, dotnet run usually does this)
dotnet restore
# Run the application
dotnet run
```

The backend server should now be running (typically on `https://localhost:7176` or similar, check console output).

### 3. Frontend Setup (`/ui`)

Open a new terminal, navigate to the UI directory, install dependencies, and start the development server:

```bash
cd ui
# Install dependencies
npm install
# Start development server
npm run dev
```

The frontend application will be available at `http://localhost:5173` (or the port shown in the terminal).

## 🔧 Configuration

*   **API URL:** The frontend is configured to communicate with the backend. Ensure the backend URL matches the configuration in the frontend (usually in `.env` or hardcoded in `api.ts` or similar).
*   **Database:** The backend likely uses a local database (e.g., SQL Server LocalDB or SQLite) configured in `appsettings.json`. Ensure your environment supports the configured database provider.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
