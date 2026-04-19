# Outage Management System - Frontend

Welcome to the frontend application for the Outage Management System. This project provides a responsive user interface for monitoring, reporting, and managing service outages, as well as communicating system statuses in real-time.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- A package manager: npm, yarn, or pnpm

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### 1. Installation

Navigate to the frontend directory and install the project dependencies:

```bash
cd frontend
npm install
# or use yarn install / pnpm install
```

### 2. Environment Setup

If the project requires specific environment variables, create a `.env` or `.env.local` file in the root of the `frontend` directory. Ask your team for the required development keys.

### 3. Running the Development Server

Start the local development server:

```bash
npm run dev
# or use yarn dev / pnpm dev
```

The application should now be running. Check your terminal output for the local URL (usually `http://localhost:3000` or `http://localhost:5173`) and open it in your browser.

### 4. Building for Production

To create an optimized, production-ready build, run:

```bash
npm run build
# or use yarn build / pnpm build
```


# Outage Management System - Backend

Welcome to the backend application for the Outage Management System. This project serves as the core API, handling database operations, business logic, and real-time updates for monitoring and managing service outages.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- A package manager: npm, yarn, or pnpm
- A local or cloud database instance (e.g., PostgreSQL, MongoDB), depending on your system architecture

## Getting Started

Follow these instructions to set up and run the backend server on your local machine.

### 1. Installation

Navigate to the backend directory and install the project dependencies:

```bash
cd backend
npm install
# or use yarn install / pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root of the `backend` directory. You will likely need to configure database connection strings, port numbers, and secret keys. Ask your team for a sample configuration or the required development environment variables.

### 3. Running the Development Server

Start the local development server (typically configured with a tool like `nodemon` or `ts-node-dev` for hot-reloading):

```bash
npm run dev
# or use yarn dev / pnpm dev
```

The server should now be running. Check your terminal output for the local URL (usually `http://localhost:4000` or `http://localhost:8080`) and any API health check endpoints.

### 4. Running in Production

To start the server for a production environment, run:

```bash
npm start
# or use yarn start / pnpm start
```

