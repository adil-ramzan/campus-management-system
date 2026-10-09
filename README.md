# Campus Management System

A responsive React frontend for a university management system, featuring a public website and dedicated dashboards for administrators, staff, and students.

## Features

* **Public website:** Home, About, Academics, Administration, Admissions, and Contact.
* **Admin dashboard:** Statistics, charts, course management, user management, enrollment, and announcements.
* **Staff dashboard:** Courses, student lists, assignments, grading, and attendance.
* **Student dashboard:** Enrolled courses, assignments, attendance, announcements, and progress.
* **Responsive UI:** Layouts for desktop and mobile screens.
* **API integration:** Connects to a separate backend for authentication and application data.

## Tech Stack

* React 19
* React Router 7
* JavaScript
* Tailwind CSS
* Axios
* Chart.js

## Getting Started

**Requirements:** Node.js and npm.

```bash
git clone https://github.com/adil-ramzan/campus-management-system-frontend.git
cd campus-management-system-frontend
npm install
```

Configure the backend API:

```bash
cp .env.example .env.local
```

Set the API URL in `.env.local`:

```text
REACT_APP_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm start
```

Create a production build:

```bash
npm run build
```

## Project Structure

* `src/components/` — Shared UI components
* `src/context/` — Authentication context
* `src/data/` — Programme catalogue and dashboard preview data
* `src/pages/` — Website pages and dashboards
* `src/theme.js` — Theme configuration
* `src/config.js` — API configuration

## Note

This is a frontend portfolio project. The backend and database are maintained separately. Authentication and live application data require a configured backend API.

## License

For educational and portfolio purposes.
