# Campus Management System

A React-based frontend for a Campus Management System, providing interfaces for students, staff, and administrators.

## Features

* Student dashboard
* Admin dashboard
* Authentication UI
* Backend API integration
* Responsive interface
* Role-based frontend routing

## Tech Stack

* React
* JavaScript
* React Router
* CSS
* REST API integration

## Getting Started

### Installation

```bash
git clone https://github.com/adil-ramzan/campus-management-system-frontend.git
cd campus-management-system-frontend
npm install
```

### Environment

Create a `.env.local` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

Change the URL to match your backend API.

### Run the project

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
```

## Backend

This repository contains the frontend only. Authentication and application data are handled by a separate backend API.

The backend must provide the required authentication and data endpoints.

## Project Structure

```text
src/
├── components/
├── context/
├── pages/
├── config.js
├── App.js
└── index.js
```

## License

This project is for educational and portfolio purposes.
