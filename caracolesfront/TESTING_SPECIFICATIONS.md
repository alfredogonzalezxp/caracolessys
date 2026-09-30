# Frontend Testing Specifications

This document outlines the testing strategy, tooling, and implemented tests for the DevCourses frontend Next.js application.

## Tooling
- **Test Runner:** Jest
- **UI Testing Library:** React Testing Library (`@testing-library/react`)
- **Environment:** `jest-environment-jsdom` (Simulates a browser environment for unit tests)
- **Mocking:** Jest's built-in mocking capabilities (`jest.mock`, `jest.fn`)

## Implemented Tests

### 1. API Layer (`api/api.test.ts`)
- **Target File:** `api/api.ts`
- **Mocking Strategy:** Mocked the global `axios` instance and standard HTTP methods.
- **Test Coverage:**
  - `login`: Verifies POST to `/signin` with credentials.
  - `signup`: Verifies POST to `/signup` with new user data.
  - `getAllUsers`, `deleteUser`, `updateUser`: Verifies properly adding the `Authorization: Bearer <token>` header retrieved from the local storage.

### 2. Context Layer (`app/context/AuthContext.test.tsx`)
- **Target File:** `app/context/AuthContext.tsx`
- **Mocking Strategy:** Globally mocked `window.localStorage` and JWT decoding logic.
- **Test Coverage:**
  - Verifies default unauthenticated state upon initialization.
  - Verifies session restoration if an `accessToken` exists in `localStorage` on mount.
  - Verifies state transitions during `login` (saves token, parses role) and `logout` (clears token and resets state).

### 3. UI Components

#### Header (`app/Header.test.tsx`)
- **Target File:** `app/Header.tsx`
- **Mocking Strategy:** Mocked `useAuth` (from `AuthContext`) and `usePathname` (from `next/navigation`).
- **Test Coverage:**
  - Unauthenticated: Renders no Header (returns `null`).
  - Authenticated (`USER` role): Renders Dashboard link, hides Management link.
  - Authenticated (`ADMIN` role): Renders both Dashboard and Management links.
  - Verifies `logout` function is called when the Log Out button is clicked.

#### Dashboard (`app/dashboard/dashboard.test.tsx`)
- **Target File:** `app/dashboard/dashboard.tsx`
- **Mocking Strategy:** None required for this static display component.
- **Test Coverage:**
  - Verifies that all statistical cards (Total Users, Active Sessions, Revenue) render properly.

#### User Management (`app/users/manage_usr.test.tsx`)
- **Target File:** `app/users/manage_usr.tsx`
- **Mocking Strategy:** Mocked all API methods (`getAllUsers`, `deleteUser`, `signup`, `updateUser`) from `api/api.ts` and mocked `window.confirm`.
- **Test Coverage:**
  - Verifies initial fetch of users on mount and renders them in the table.
  - Verifies the user creation form submission properly calls the `signup` API mock with form data.
  - Verifies that clicking the delete button triggers a confirmation dialog and then calls the `deleteUser` API properly.
  - Verifies the modal close button triggers the mapped `onClose` callback.
