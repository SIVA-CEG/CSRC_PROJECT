# CSRC Project Documentation

## 1. Overview
CSRC is a web-based administrative portal for managing academic and research-related workflows. The current implementation focuses on a React-based frontend experience with sections for user profile, endorsements, project administration, request forms, payment claims, and related academic activities.

## 2. Purpose
The application appears to support staff members in:
- viewing and managing their profile,
- submitting and tracking endorsements,
- managing sanctioned projects and project-related records,
- handling request forms such as reappropriation and project extension,
- managing payment claims and expenditure reports,
- accessing sections for consultancies, testing, training, and workshops.

## 3. Technology Stack
- Frontend: React 19
- Build tool: Vite
- Styling: CSS modules and component-level CSS
- HTTP client: Axios
- Document/report utilities: jsPDF, html2pdf.js, docxtemplater, Pizzip, FileSaver
- Package manager: npm

## 4. Project Structure
- frontend/ — main application source code
  - src/ — application source files
    - App.jsx — main route/navigation logic
    - components/ — reusable UI components such as sidebar and module cards
    - layouts/ — layout wrappers like the dashboard shell
    - pages/ — feature pages grouped by domain
  - public/ — static assets
  - package.json — frontend dependencies and scripts
- backend/ — currently empty in the repository snapshot
- docs/ — project documentation files

## 5. Main Application Flow
The application uses a simple page state system in App.jsx to switch between modules. The dashboard layout wraps the active page, and the sidebar provides navigation to major sections.

### Main Sections
- Profile
- Endorsements
- My Projects
  - Sanctioned Projects
  - CTDT Proceedings
  - Project Staff
  - Request Forms
  - Payment Claims
  - Claim Bills
  - Statement of Expenditure
  - Project Reports
  - Project Transfer
- Consultancies
- Testing
- Training
- Workshops

## 6. Getting Started
### Prerequisites
- Node.js and npm installed

### Install Dependencies
```bash
cd frontend
npm install
```

### Run the Development Server
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
cd frontend
npm run build
```

### Lint the Project
```bash
cd frontend
npm run lint
```

## 7. Notes on the Current Repository State
- The frontend is implemented and runnable.
- The backend folder is currently empty, so the project is presently frontend-focused.
- The app includes report/document generation features, suggesting future integration with form processing or backend services.

## 8. Recommended Next Steps
- Add backend APIs for data persistence and authentication.
- Define a formal data model for projects, endorsements, claims, and reports.
- Add route-based navigation instead of local page state if the app grows further.
- Replace placeholder UI text and hard-coded user data with real dynamic content.
- Add unit/integration tests for critical workflows.
