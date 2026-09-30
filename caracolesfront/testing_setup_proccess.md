# Jest Testing Setup Process

This document outlines the steps taken to set up the testing environment and implement unit tests for the `LoginForm` component in the `DevCoursesfront` project.

## 1. Dependency Installation
The following packages were installed as development dependencies:
- `jest`: The testing framework.
- `jest-environment-jsdom`: Provides a browser-like environment for testing React components.
- `@testing-library/react`: Tools for testing React components.
- `@testing-library/jest-dom`: Custom Jest matchers for asserting on DOM state.
- `ts-jest`: Allows Jest to handle TypeScript files.
- `@types/jest`: TypeScript definitions for Jest.

**Command:**
```powershell
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @types/jest ts-jest
```

## 2. Configuration Files

### `jest.config.ts`
Configured Jest specifically for Next.js, including:
- Mapping of the `@/` alias to the root directory.
- Specifying `jsdom` as the test environment.
- Linking the setup file.

### `jest.setup.ts`
Imported `@testing-library/jest-dom` to enable advanced assertions like `.toBeInTheDocument()`.

## 3. Package Scripts
Added the following scripts to `package.json`:
- `"test": "jest"`: Runs all tests once.
- `"test:watch": "jest --watch"`: Runs tests in interactive watch mode.

## 4. Implementation of Unit Tests
Created `app/auth/LoginForm.test.tsx` which includes tests for:
1. **Rendering**: Ensures the login form, email field, password field, and sign-in button are displayed.
2. **Input State**: Verifies that typing in the email and password fields updates their respective values.
3. **Success Scenario**: Mocks a successful login response from the API and verifies that the `login` function from context is called and the success message is displayed.
4. **Failure Scenario**: Mocks an API error and verifies that the error message is correctly rendered in the UI.
5. **Loading State**: Ensures that the button displays a "Signing in..." message and is disabled while a login request is in progress.

## 5. Mocking Strategy
- **`next/navigation`**: Mocked `useRouter` to prevent actual navigation during tests.
- **`AuthContext`**: Mocked `useAuth` to control the authentication state and verify calls to the `login` method.
- **`api.ts`**: Mocked the `login` API call to simulate network responses without hitting the actual server.

## 6. Verification
All tests were executed and passed successfully.

```text
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Time:        26.296 s
```

---
*Created on 2026-03-10*
