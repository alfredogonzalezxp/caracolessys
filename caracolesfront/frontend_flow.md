# Frontend Application Flow - DevCourses

This document outlines the architecture and user journeys in the Next.js `DevCourses` frontend application.

## 🏗️ Architecture Stack

- **Framework:** Next.js (App Router)
- **State Management:** React Context (`AuthContext`)
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS

---

## 🚦 Application Routing Flow

The application uses the modern Next.js App Router (the `app/` directory).

1. **Global Initialization (`app/layout.tsx`)**
   - The Root Layout wraps the entire application.
   - It initializes global providers, most importantly the **`AuthProvider`**.
   - It also consistently renders the **`Header`** component across all pages.
   - Main content (`{children}`) is injected into a flex-growing `<main>` tags.

2. **Entry Point (`app/page.tsx`)**
   - When a user visits `/` (the root URL), the `HomePage` component is rendered as a Client Component (`"use client"`).
   - It taps into the `useAuth()` hook to check the user's authentication status.
     |

---

## 🔐 Authentication & Main User Journey

### State 1: Loading

- While the `AuthProvider` is verifying an existing session (e.g., checking tokens via Axios), the `HomePage` displays a circular loading spinner.

### State 2: Unauthenticated

- If `isAuthenticated` is false, the user remains on `/`.
- The UI renders the **`LoginForm`** component overlaid on a background with animated decorative shapes.
- **Login Action:** When the user enters credentials, the `LoginForm` calls the login function provided by `useAuth()`.
  - An Axios request is fired to the backend `/api/signin` endpoint.
  - On success, the JWT token is saved, and `isAuthenticated` is set to `true`.

### State 3: Authenticated (Dashboard)

- If `isAuthenticated` is true, the `HomePage` immediately transforms into the **Dashboard View**.
- **Dashboard Content:**
  - Displays a welcoming Hero Section.
  - Renders a Stats Grid showing "Active Courses", "Total Students", and "Completion Rate".
- The user can use the `Header` to navigate to other protected pages (e.g., users management, generic dashboard pages).

---

## 🔒 Protected Client Routes Context

The `AuthContext` provides a centralized mechanism for managing session state. Any component within the application can call `useAuth()` to conditionally render content or redirect users if their session expires (intercepting 401 Unauthorized responses from Axios and triggering a logout).

## 🚀 Key Application Routes & Components

Once authenticated, users have access to several protected routes under the `app/` directory:

- - **`MainDashboard`** (`app/dashboard/dashboard.tsx`): The primary overview screen showing stats and quick actions.
  - **`UserSpace`** (`app/dashboard/UserSpace.tsx`): A personalized area displaying user-specific details and progress.

2. **User Management (`/users`)**
   - **`ManageUsers`** (`app/users/manage_usr.tsx`): An administrative view to manage user accounts, roles, and statuses via an interactive data grid.

3. **Course Management (`/courses/manage_courses`)**
   - **`ManageCourses`** (`app/courses/manage_courses/manage_courses.tsx`): A robust interface for instructors/admins to create, edit, and oversee course content.

---

## 🧪 Testing Strategy

The frontend application uses a robust testing stack to ensure component reliability and prevent regressions:

- **Test Runner:** Jest
- **UI Testing Library:** React Testing Library (`@testing-library/react`)
- **Assertions:** `@testing-library/jest-dom`

### Key Testing Patterns

- **Context Mocking:** Tests for components relying on `useAuth()` mock the context to simulate authenticated states without needing actual network requests (e.g., `jest.mock('../context/AuthContext')`).
- **DOM Interaction:** Interactions like form submissions (e.g., `LoginForm.test.tsx`) use `fireEvent` to simulate typing and clicking.
- **Asynchronous Updates:** Components that fetch data on mount or user action (e.g., `ManageUsers`) wrap renders and state updates in `await act(...)` to ensure the virtual DOM settles before assertions.
