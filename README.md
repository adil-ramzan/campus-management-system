# Campus Management System (Frontend)

A React frontend for a university campus management system. It has a public
website and three role-based portals, for administrators, staff and students,
covering courses, enrolment, assignments, attendance and announcements.

> **Frontend only.** This is a portfolio project. It does not include a backend
> or a database. Sign-in and all data features need a separate backend API,
> which is not part of this repository.

## Features

**Public site**

- Home, About, Academics, Administration, Admissions and Contact pages
- Sign in, and sign up for student accounts

**Admin portal**

- Dashboard with summary figures and charts
- Create, update and delete courses, and enrol students in them
- Create staff and student accounts; view, edit and delete them
- Publish and delete announcements

**Staff portal**

- Dashboard with course, assignment and attendance summaries
- Course details and student lists
- Create assignments, view submissions and grade them
- Mark and review attendance

**Student portal**

- Dashboard with enrolled courses, assignments, attendance and announcements
- Submit assignments
- View attendance for each course

**Across the app**

- Routes are protected by role (`admin`, `staff`, `student`)
- Responsive layout

## Technology stack

- React 19 with Create React App (`react-scripts` 5)
- React Router 7
- Axios
- Chart.js with `react-chartjs-2`
- Tailwind CSS, loaded from the Tailwind CDN script in `public/index.html`
- Heroicons

## Prerequisites

- Node.js 20 or later, and npm
- A running backend API that this frontend can reach (see below)

## Installation

```bash
git clone https://github.com/adil-ramzan/campus-management-system-frontend.git
cd campus-management-system-frontend
npm install
```

## Environment configuration

The app reads the backend's base URL from `REACT_APP_API_URL`.

```bash
cp .env.example .env.local
```

Then set the value in `.env.local`, for example:

```text
REACT_APP_API_URL=http://localhost:5000
```

- If the variable is empty, the app uses `http://localhost:5000`.
- The value is read at build time, so restart `npm start` or rebuild after
  changing it.
- `.env.local` is ignored by Git. Do not commit environment files or
  credentials.

## Backend requirements

The backend is a separate project. This frontend expects it to:

- serve its routes under `/api` (`/api/auth`, `/api/admin`, `/api/staff`,
  `/api/student` and `/api/assignments`);
- authenticate with a session cookie. Every request is sent with
  `withCredentials`, so the backend must allow credentialed CORS requests from
  the frontend's origin;
- verify credentials and enforce the `admin`, `staff` and `student` roles.

The frontend ships no accounts, passwords or login shortcuts. The signed-in user
is kept in memory only and nothing is written to browser storage, so reloading
the page requires signing in again.

### Sample data on the dashboards

If a dashboard cannot reach the API at all, it shows generated sample figures
under a visible "Demo data" notice, so the layout and charts can still be
previewed. This sample data lives in `src/data/`, is never sent to the API and
is not used for authentication. Reaching a dashboard still requires signing in
through the backend.

## Development

```bash
npm start
```

Runs the development server at `http://localhost:3000` and reloads on changes.

```bash
npm test
```

Runs the Create React App test runner. The project has no test files yet.

## Production build

```bash
npm run build
```

Writes an optimised static build to `build/`, which can be served by any static
file host. The host must return `index.html` for unknown paths so that
client-side routes work.

## Project structure

```text
public/            Static assets and the HTML template
src/
  components/      Shared layout and UI components
  context/         Authentication context
  data/            Programme catalogue and dashboard sample data
  pages/           Public pages and portal pages
  config.js        API base URL
  theme.js         Colour palette
  App.js           Routes
```

## Screenshots

Screenshots have not been added yet.

<!-- Add images to docs/screenshots/ and reference them here, for example:
![Admin dashboard](docs/screenshots/admin-dashboard.png)
-->
