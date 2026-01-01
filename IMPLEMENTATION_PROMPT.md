# 🚀 **PROMPT: Implement Form Validation Error Display**

## **Copy this prompt for other projects:**

---

**"Implement form validation error display in my React + Express project. Backend: Use express-validator middleware to validate form data and return errors as `{ errors: [{ field: "fieldName", message: "error message" }] }` with 400 status. Frontend: Create a React Router action function that catches validation errors from API calls and returns `{ errors: [...] }`. In the component, use `useActionData()` hook to get errors, create a `getFieldError(fieldName)` helper function that searches the errors array, and pass errors as props to Input components. Update Input component to accept an `error` prop, show red border (`border-red-500`) when error exists, and display error message below input using conditional rendering (`{error && <p>{error}</p>}`). Ensure errors are displayed for each invalid field with clear visual feedback."**

---

**Word count: 100 words exactly**
