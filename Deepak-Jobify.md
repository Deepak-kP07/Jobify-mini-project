# 🎯 **COMPLETE WORKFLOW EXPLANATION - JOBIFY MERN STACK**

## 📋 **TABLE OF CONTENTS**

1. [Architecture Overview](#architecture)
2. [Frontend Workflow](#frontend)
3. [Backend MVC Architecture](#backend)
4. [How Frontend & Backend Connect](#connection)
5. [Authentication Flow (JWT & Cookies)](#authentication)
6. [Validation & Error Handling](#validation)
7. [Complete Request Flow Example](#example)
8. [File Uploads & Security](#security-upload)
9. [Key Concepts Summary](#summary)

---

## 🏗️ **ARCHITECTURE OVERVIEW** {#architecture}

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  Port: 5173                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Components  │  │    Pages     │  │    Routes    │     │
│  │  (UI Parts)  │→ │  (Views)     │→ │  (URL Map)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                          │                                  │
│                          │ HTTP Requests (Axios)            │
│                          │ with Cookies (JWT)               │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                 BACKEND (Express/Node.js)                   │
│  Port: 5200                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Routes  │→ │Middleware│→ │Controller│→ │  Models  │    │
│  │ (URL Map)│  │ (Auth)   │  │(Business)│  │(Database)│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                          │                                  │
│                          │ Database Queries                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    DATABASE (MongoDB)                       │
│  - Users Collection                                         │
│  - Jobs Collection                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 **FRONTEND WORKFLOW** {#frontend}

### **1. Components (Static UI Parts)**

**What they are:**

- Reusable UI building blocks
- Examples: `Button.jsx`, `Input.jsx`, `Logo.jsx`, `Sidebar.jsx`

**Purpose:**

- Create consistent UI elements
- Reuse across multiple pages
- Keep code DRY (Don't Repeat Yourself)

**Example:**

```jsx
// Button.jsx - Reusable button component
export default function Button({btnName, isSubmitting}) {
  return <button>{isSubmitting ? "Loading..." : btnName}</button>
}

// Used in multiple pages:
<Button btnName="Login" />      // In Login.jsx
<Button btnName="Register" />   // In Register.jsx
```

---

### **2. Pages (Complete Views)**

**What they are:**

- Full page components that combine multiple components
- Examples: `Login.jsx`, `Register.jsx`, `Dashboard.jsx`, `AddJob.jsx`

**Purpose:**

- Display complete user interfaces
- Handle user interactions
- Make API calls to backend

**Example:**

```jsx
// Login.jsx - Complete login page
export default function Login() {
  return (
    <div>
      <Logo /> // Component
      <Input label="Email" /> // Component
      <Input label="Password" /> // Component
      <Button btnName="Login" /> // Component
    </div>
  );
}
```

---

### **3. Frontend Routes (URL to Component Mapping)**

**What they are:**

- Maps browser URLs to React components
- Uses React Router DOM

**How it works:**

```jsx
// App.jsx - Route configuration
const router = createBrowserRouter([
  {
    path: "/", // URL: http://localhost:5173/
    element: <HomeLayout />, // Shows HomeLayout component
  },
  {
    path: "/login", // URL: http://localhost:5173/login
    element: <Login />, // Shows Login component
  },
  {
    path: "/dashboard", // URL: http://localhost:5173/dashboard
    element: <Dashboard />, // Shows Dashboard component
  },
]);
```

**Flow:**

```
User types URL → React Router checks routes → Finds matching path → Renders component
```

**Key Points:**

- **Frontend Routes** = Show which **component/page** to display
- **No page refresh** (Single Page Application - SPA)
- **Client-side navigation** (faster, smoother)

---

### **📊 Three Ways Frontend Interacts with Backend - Quick Summary**

| **Pattern**     | **Purpose**                   | **When Runs**        | **HTTP Method** | **Connected To**   | **Access Data**        |
| --------------- | ----------------------------- | -------------------- | --------------- | ------------------ | ---------------------- |
| **Loader**      | Load data from DB to frontend | Page loads (auto)    | GET only        | Route in App.jsx   | `useLoaderData()`      |
| **Action**      | Send data to DB from frontend | Form submits (auto)  | POST/PUT/DELETE | Route in App.jsx   | `useActionData()`      |
| **Direct Call** | Any functionality on events   | User clicks (manual) | Any method      | Component function | Direct function result |

**Simple Understanding:**

- **Loader** = Fetch data when page loads (GET)
- **Action** = Send data when form submits (POST/PUT/DELETE)
- **Direct Call** = Any operation when something happens (any HTTP method)

---

### **4. Actions (Form Submission Handlers - Send Data to DB)**

**What they are:**

- Functions that handle form submissions
- Run automatically when user submits a form
- Send data to backend API (POST, PUT, DELETE)
- Connected to routes in App.jsx
- Return data to component via `useActionData()` hook

**Purpose:**

- **Action = Send data to DB from frontend**
- Used for: Creating, updating, or deleting data
- HTTP Methods: POST (create), PUT/PATCH (update), DELETE (delete)

**Example:**

```javascript
// actions/addJobAction.js
import customFetch from "../utils/customFetch";

export const addJobAction = async ({ request }) => {
  try {
    // 1. Get form data
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // 2. Send to backend (POST request)
    await customFetch.post("/jobs", data);

    // 3. Return success
    return { success: true, redirect: "/dashboard/all-jobs" };
  } catch (error) {
    // 4. Return error
    return {
      error: error.response?.data?.msg || "Failed to add job",
    };
  }
};
```

**How it works:**

1. **Connect Action to Route in App.jsx:**

```javascript
// App.jsx
import { addJobAction } from "./actions/addJobAction";

const router = createBrowserRouter([
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AddJob />,
        action: addJobAction, // ← Connect action to route
      },
    ],
  },
]);
```

2. **Use in Component:**

```javascript
// AddJob.jsx
import { Form, useActionData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function AddJob() {
  const actionData = useActionData(); // Gets return value from action
  const navigate = useNavigate();

  // Show toast based on action result
  useEffect(() => {
    if (actionData?.success) {
      toast.success("Job added successfully!");
      setTimeout(() => {
        navigate(actionData.redirect);
      }, 1500);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData, navigate]);

  return (
    <Form method="post">
      <Input name="company" />
      <Input name="position" />
      <Button type="submit" />
    </Form>
  );
}
```

**Complete Flow:**

```
User submits form → React Router calls action() →
Action gets form data → Makes API call (POST/PUT/DELETE) →
Returns result → Component gets via useActionData() →
Shows toast/redirects
```

**Key Points:**

- ✅ Runs automatically when form submits
- ✅ Connected to route in App.jsx
- ✅ Can send data (POST, PUT, DELETE)
- ✅ Returns data to component via `useActionData()`
- ✅ Used for form submissions only

---

### **5. Loaders (Data Fetching Before Component Renders - Load Data from DB)**

**What they are:**

- Functions that fetch data **before** a component renders
- Run automatically when user navigates to a route
- Load data from backend API (GET requests only)
- Make data available to components via `useLoaderData()` hook
- Connected to routes in App.jsx

**Purpose:**

- **Loader = Load data from DB to frontend**
- Used for: Fetching data when page loads
- HTTP Method: GET only
- Data is ready before component renders (no loading state needed)

**How it works:**

#### **Step 1: Define Loader Function**

```javascript
// actions/headerLoader.js
import customFetch from "../utils/customFetch";

export const headerLoader = async () => {
  try {
    // Fetch data from backend
    const { data } = await customFetch.get("/users/current-user");
    return data; // Return data to be used in component
  } catch {
    return null; // Return null if error
  }
};
```

**What this does:**

- Makes API call to `/users/current-user`
- Returns user data: `{ user: { firstName: "Deepak", email: "..." } }`
- Runs **automatically** when route is accessed

---

#### **Step 2: Connect Loader to Route in App.jsx**

```javascript
// App.jsx
import { headerLoader } from "./actions/headerLoader";

const router = createBrowserRouter([
  {
    path: "dashboard",
    element: <DashboardLayout />,
    loader: headerLoader, // ← Connect loader to route
    children: [
      { index: true, element: <AddJob /> },
      // ... other routes
    ],
  },
]);
```

**What this does:**

- Tells React Router: "When user goes to `/dashboard`, run `headerLoader` first"
- Loader runs **before** `DashboardLayout` component renders
- Data from loader is stored by React Router

---

#### **Step 3: Access Data in Component with useLoaderData()**

```javascript
// DashboardLayout.jsx
import { useLoaderData } from "react-router-dom";

export default function DashboardLayout() {
  // Get data from loader
  const data = useLoaderData();
  // data = { user: { firstName: "Deepak", email: "..." } }

  const user = data?.user || null;

  // Pass user to child components
  return (
    <>
      <Sidebar user={user} />
      <Header user={user} />
      <Outlet />
    </>
  );
}
```

**What this does:**

- `useLoaderData()` gets the data returned by the loader
- Data is available immediately (no loading state needed)
- Can pass data to child components as props

---

#### **Complete Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: User navigates to /dashboard                       │
│                                                             │
│  User types URL or clicks link:                             │
│  http://localhost:5173/dashboard                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ React Router checks routes
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 2: React Router finds route with loader               │
│                                                             │
│  App.jsx route configuration:                             │
│  {                                                          │
│    path: "dashboard",                                       │
│    element: <DashboardLayout />,                            │
│    loader: headerLoader  ← Loader function                  │
│  }                                                          │
│                                                             │
│  React Router: "I see a loader, let me run it first"        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ React Router calls headerLoader()
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 3: Loader function runs (headerLoader.js)            │
│                                                             │
│  export const headerLoader = async () => {                 │
│    const { data } = await customFetch.get("/users/current-user"); │
│    return data;  // Returns: { user: {...} }              │
│  };                                                         │
│                                                             │
│  Makes API call:                                            │
│  GET http://localhost:5200/api/v1/users/current-user        │
│                                                             │
│  Backend returns:                                           │
│  { user: { firstName: "Deepak", lastName: "KPD", ... } }   │
│                                                             │
│  Loader returns: { user: {...} }                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ React Router stores returned data
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 4: Component renders with data available             │
│                                                             │
│  DashboardLayout component:                                 │
│  const data = useLoaderData();  // Gets data from loader    │
│  // data = { user: { firstName: "Deepak", ... } }          │
│                                                             │
│  const user = data?.user || null;                           │
│                                                             │
│  Component renders:                                        │
│  <Sidebar user={user} />  ← User data passed as prop       │
│  <Header user={user} />   ← User data passed as prop       │
└─────────────────────────────────────────────────────────────┘
```

---

#### **Key Points:**

1. **Loader runs BEFORE component renders**

   - Data is fetched before UI shows
   - No loading spinner needed (data is ready)

2. **Loader is connected in App.jsx**

   - `loader: headerLoader` connects function to route
   - Loader runs automatically when route is accessed

3. **useLoaderData() accesses the data**

   - Hook gets data returned by loader
   - Available immediately in component
   - No need for useState or useEffect

4. **Data flows: Loader → useLoaderData() → Component → Props**
   ```
   headerLoader() returns data
        ↓
   useLoaderData() gets data
        ↓
   Component uses data
        ↓
   Pass data to child components as props
   ```

---

#### **Why Use Loaders?**

**Without Loader (Old Way):**

```javascript
// Component has to handle loading state
export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data after component mounts
    customFetch.get("/users/current-user").then((res) => {
      setUser(res.data.user);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading

  return <Header user={user} />;
}
```

**With Loader (Better Way):**

```javascript
// Data is ready before component renders
export default function DashboardLayout() {
  const data = useLoaderData(); // Data already loaded!
  const user = data?.user || null;

  return <Header user={user} />; // No loading state needed
}
```

**Benefits:**

- ✅ Data ready before component renders
- ✅ No loading states needed
- ✅ Cleaner code
- ✅ Better user experience (no flash of loading)

---

#### **Real Example from Your Code:**

**1. Loader Function (`actions/headerLoader.js`):**

```javascript
export const headerLoader = async () => {
  const { data } = await customFetch.get("/users/current-user");
  return data; // Returns: { user: {...} }
};
```

**2. Connect to Route (`App.jsx`):**

```javascript
{
  path: "dashboard",
  element: <DashboardLayout />,
  loader: headerLoader,  // ← Loader runs when /dashboard is accessed
}
```

**3. Access in Component (`DashboardLayout.jsx`):**

```javascript
export default function DashboardLayout() {
  const data = useLoaderData(); // Gets data from headerLoader
  const user = data?.user || null;

  return (
    <>
      <Sidebar user={user} /> // Pass user to Sidebar
      <Header user={user} /> // Pass user to Header
    </>
  );
}
```

**4. Use in Child Components (`Header.jsx`, `Sidebar.jsx`):**

```javascript
// Header.jsx
export default function Header({ user }) {
  const userName = user ? `${user.firstName} ${user.lastName}` : "Guest";
  return <div>{userName}</div>;
}
```

---

### **6. Direct API Calls in Components (User-Triggered Actions - Any Functionality)**

**What they are:**

- Functions that make API calls directly inside components
- Run when user clicks buttons or triggers events
- **Not connected to routes** (unlike loaders/actions)
- Handle immediate user interactions
- Can use any HTTP method (GET, POST, PUT, DELETE)

**Purpose:**

- **Direct API Call = Any functionality triggered by events**
- Used for: Button clicks, user interactions, any operation
- HTTP Methods: Any (GET, POST, PUT, DELETE)
- Runs only when explicitly called (not automatic)

**When to use:**

- ✅ Button clicks (logout, delete, toggle)
- ✅ User-triggered actions (not form submissions)
- ✅ Any functionality when something happens
- ✅ Need immediate feedback (toast notifications)
- ✅ Not tied to form submission or page load

**How it works:**

#### **Step 1: Create Function in Component**

```javascript
// Sidebar.jsx
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export default function Sidebar({ user }) {
  const navigate = useNavigate();

  // Direct API call function
  const logoutUser = async () => {
    try {
      // Make API call directly
      await customFetch.post("/auth/logout");

      // Show success message
      toast.success("Logged out successfully");

      // Redirect user
      navigate("/");
    } catch (error) {
      // Handle error
      toast.error("Failed to logout");
    }
  };

  return (
    <LogOut onClick={logoutUser} /> // ← Direct function call
  );
}
```

**What this does:**

- Function runs when user clicks the logout icon
- Makes POST request to `/auth/logout`
- Shows toast notification
- Redirects to home page
- Handles errors gracefully

---

#### **Complete Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: User clicks button                                │
│                                                             │
│  User clicks logout icon:                                   │
│  <LogOut onClick={logoutUser} />                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ onClick event fires
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 2: Function runs (Direct API call)                    │
│                                                             │
│  const logoutUser = async () => {                          │
│    await customFetch.post("/auth/logout");                  │
│    // Makes API call directly                               │
│  };                                                         │
│                                                             │
│  Makes API call:                                            │
│  POST http://localhost:5200/api/v1/auth/logout               │
│  Headers: Cookie: mytokenCookie=...                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Request
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 3: Backend processes request                         │
│                                                             │
│  Backend:                                                    │
│  - Receives POST /auth/logout                                │
│  - logout() controller runs                                 │
│  - Clears cookie (sets to "logout", expires immediately)    │
│  - Returns: { message: "user logged out" }                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Response
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 4: Frontend handles response                         │
│                                                             │
│  Frontend:                                                   │
│  - Receives success response                                │
│  - Shows toast: "Logged out successfully"                   │
│  - Redirects: navigate("/")                                  │
│  - User sees home page                                      │
└─────────────────────────────────────────────────────────────┘
```

---

#### **Key Points:**

1. **Not connected to routes**

   - Function is defined in component
   - Not in App.jsx route configuration
   - Runs only when explicitly called

2. **User-triggered**

   - Runs on button clicks, not automatically
   - User must interact to trigger
   - Immediate feedback (toasts, redirects)

3. **Direct API call**

   - Uses `customFetch` directly in component
   - No loader/action wrapper needed
   - Simple async/await pattern
   - Can use any HTTP method (GET, POST, PUT, DELETE)

4. **Common use cases:**
   ```
   - Logout button (POST /auth/logout)
   - Delete button (DELETE /jobs/:id)
   - Toggle settings (PATCH /settings)
   - Like/favorite buttons (POST /like)
   - Any button that doesn't submit a form
   - Any functionality triggered by user events
   ```

---

#### **Real Example from Your Code:**

**Sidebar.jsx - Logout Function:**

```javascript
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";

export default function Sidebar({ user }) {
  const navigate = useNavigate();

  const logoutUser = async () => {
    try {
      await customFetch.post("/auth/logout");
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <LogOut onClick={logoutUser} /> // Direct function call
  );
}
```

**What happens:**

1. User clicks logout icon
2. `logoutUser()` function runs
3. Makes POST request to backend
4. Backend clears cookie
5. Shows success toast
6. Redirects to home page

---

#### **Comparison: Loader vs Action vs Direct Call**

| **Pattern**     | **Purpose**                   | **When Runs**      | **HTTP Method**           | **Connected To**   | **Example**                            |
| --------------- | ----------------------------- | ------------------ | ------------------------- | ------------------ | -------------------------------------- |
| **Loader**      | Load data from DB to frontend | Page loads         | GET only                  | Route in App.jsx   | Get user data before dashboard renders |
| **Action**      | Send data to DB from frontend | Form submits       | POST/PUT/DELETE           | Route in App.jsx   | Login form, Register form, AddJob      |
| **Direct Call** | Any functionality on events   | User clicks/events | Any (GET/POST/PUT/DELETE) | Component function | Logout button, Delete button           |

---

#### **When to Use Each Pattern:**

**Use Loader when:**

- ✅ Need to **fetch data** when page loads
- ✅ Data required before component renders
- ✅ No user action needed (automatic)
- ✅ Example: Show user name in header, list all jobs

**Use Action when:**

- ✅ User **submits a form**
- ✅ Need to **send data** to backend (create/update/delete)
- ✅ Want React Router form handling
- ✅ Example: Login form, Register form, AddJob form

**Use Direct Call when:**

- ✅ User **clicks a button** (not form submission)
- ✅ Any functionality triggered by events
- ✅ Need immediate feedback
- ✅ Not tied to route navigation
- ✅ Example: Logout button, Delete button, Toggle settings

---

## 🖥️ **BACKEND MVC ARCHITECTURE** {#backend}

### **MVC = Model, View, Controller**

**In this project:**

- **Model** = Database schema (MongoDB collections)
- **View** = JSON responses (API responses)
- **Controller** = Business logic (what happens)

---

### **1. MODELS (Database Schema)**

**What they are:**

- Define structure of data in MongoDB
- Set validation rules
- Create relationships between data

**Example:**

```javascript
// Models/userModel.js
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

export default mongoose.model("User", userSchema);
```

**Purpose:**

- Defines what a User document looks like in MongoDB
- Sets validation: firstName must be 3+ chars, email must be unique
- Creates "users" collection in database

---

### **2. CONTROLLERS (Business Logic)**

**What they are:**

- Functions that handle the actual work
- Process requests
- Talk to database through Models
- Return responses

**Example:**

```javascript
// Controllers/authControllers.js
export const login = async (req, res, next) => {
  // 1. Get data from request
  const { email, password } = req.body;

  // 2. Find user in database (using Model)
  const user = await User.findOne({ email });

  // 3. Check password
  const isCorrect = await comparePassword(password, user.password);

  // 4. Create JWT token
  const token = createToken({ userId: user._id });

  // 5. Set cookie
  res.cookie("mytokenCookie", token);

  // 6. Return response
  res.json({ message: "Logged in", user });
};
```

**Purpose:**

- Contains all business logic
- Uses Models to interact with database
- Returns JSON responses

---

### **3. ROUTES (URL to Controller Mapping)**

**What they are:**

- Maps API URLs to controller functions
- Defines HTTP methods (GET, POST, PATCH, DELETE)

**Example:**

```javascript
// Routes/authRoutes.js
import { login, register, logout } from "../Controllers/authControllers.js";

router.post("/login", login); // POST /api/v1/auth/login → login()
router.post("/register", register); // POST /api/v1/auth/register → register()
router.post("/logout", logout); // POST /api/v1/auth/logout → logout()
```

**How it works:**

```
HTTP Request → Route matches URL → Calls controller function → Returns response
```

---

### **4. MIDDLEWARE (Request Processing)**

**What they are:**

- Functions that run BEFORE controllers
- Can modify requests
- Can block requests
- Can add data to requests

**Types of Middleware:**

#### **A. Authentication Middleware**

```javascript
// middlewares/authMiddleware.js
export const authenticateUser = (req, res, next) => {
  // 1. Read cookie
  const token = req.cookies.mytokenCookie;

  // 2. Verify JWT token
  const { userId, role } = verifyToken(token);

  // 3. Add user info to request
  req.user = { userId, role };

  // 4. Continue to controller
  next();
};
```

**Purpose:**

- Protects routes (only logged-in users can access)
- Adds user info to request (`req.user`)
- Blocks unauthorized requests

#### **B. Validation Middleware**

```javascript
// Errors/validateMiddleware.js
const validateRegisterInput = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 8 }).withMessage("Password too short"),

  // Check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Continue if valid
  },
];
```

**Purpose:**

- Validates data before it reaches controller
- Returns errors if validation fails
- Prevents invalid data from reaching database

#### **C. Error Handling Middleware**

```javascript
// middlewares/errorHandlingMiddleware.js
export const errorHandlingMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({ msg: message });
};
```

**Purpose:**

- Catches all errors
- Sends consistent error responses
- Prevents server crashes

---

### **5. SERVER.JS (Entry Point)**

**What it does:**

- Starts Express server
- Connects to MongoDB
- Sets up all routes
- Configures middleware

**Example:**

```javascript
// server.js
const app = express();

// 1. Middleware setup
app.use(express.json()); // Parse JSON
app.use(cookieParser()); // Read cookies
app.use(cors()); // Allow frontend

// 2. Route setup
app.use("/api/v1/jobs", authenticateUser, jobRoutes);
//     ↑ URL path    ↑ Middleware  ↑ Routes

// 3. Connect database & start server
await mongoose.connect(MONGODB_URL);
app.listen(5200);
```

**Flow:**

```
Server starts → Connects MongoDB → Sets up routes → Listens for requests
```

---

## 🔗 **HOW FRONTEND & BACKEND CONNECT** {#connection}

### **1. Axios/Fetch (HTTP Client)**

**What it is:**

- Library to make HTTP requests
- Sends data to backend
- Receives responses from backend

**Example:**

```javascript
// front-end/src/utils/customFetch.js
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5200/api/v1", // Backend URL
  withCredentials: true, // Send cookies
});
```

**Usage:**

```javascript
// In component
import customFetch from "../utils/customFetch";

// GET request
const jobs = await customFetch.get("/jobs");

// POST request
await customFetch.post("/auth/login", { email, password });

// PATCH request
await customFetch.patch("/jobs/123", { company: "Google" });

// DELETE request
await customFetch.delete("/jobs/123");
```

---

### **2. Complete Connection Flow**

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (React Component)                                 │
│                                                             │
│  1. User clicks "Login" button                             │
│  2. Form submits → action() runs                           │
│  3. action() calls:                                         │
│     customFetch.post("/auth/login", { email, password })   │
│                                                             │
│  customFetch = axios instance                              │
│  - baseURL: http://localhost:5200/api/v1                  │
│  - withCredentials: true (sends cookies)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP POST Request
                     │ URL: http://localhost:5200/api/v1/auth/login
                     │ Body: { email: "...", password: "..." }
                     │ Cookie: mytokenCookie=... (if logged in)
                     │
┌────────────────────▼────────────────────────────────────────┐
│  BACKEND (Express Server)                                   │
│                                                             │
│  1. server.js receives request                              │
│  2. Checks route: app.use("/api/v1/auth", authRoutes)      │
│  3. Routes to: router.post("/login", login)                │
│  4. Calls: login() controller function                      │
│  5. Controller uses: User.findOne() (Model)                 │
│  6. Returns: JSON response                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Response
                     │ Status: 200 OK
                     │ Body: { message: "Logged in", user: {...} }
                     │ Set-Cookie: mytokenCookie=...
                     │
┌────────────────────▼────────────────────────────────────────┐
│  FRONTEND (React Component)                                 │
│                                                             │
│  1. Receives response                                       │
│  2. Updates UI (shows success/error)                        │
│  3. Cookie automatically saved by browser                   │
│  4. Redirects to dashboard                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 **AUTHENTICATION FLOW (JWT & COOKIES)** {#authentication}

### **1. JWT (JSON Web Token)**

**What it is:**

- Encrypted token containing user information
- Contains: `{ userId: "123", role: "user" }`
- Signed with secret key

**How it works:**

```javascript
// utils/jwtToken.js

// CREATE TOKEN (on login)
export const token = (payload) => {
  return jwt.sign(
    { userId: "123", role: "user" }, // Data to encode
    process.env.JWT_SECRET, // Secret key
    { expiresIn: "1d" } // Expires in 1 day
  );
};

// VERIFY TOKEN (on protected routes)
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
  // Returns: { userId: "123", role: "user" }
};
```

---

### **2. Cookies**

**What they are:**

- Small data stored in browser
- Automatically sent with every request
- Used to store JWT token

**How it works:**

```javascript
// On login (Backend)
res.cookie("mytokenCookie", token, {
  httpOnly: true, // Can't be accessed by JavaScript (security)
  expires: new Date(Date.now() + oneDay),
  secure: true, // Only sent over HTTPS in production
});

// Browser automatically:
// - Saves cookie
// - Sends cookie with every request to same domain
```

---

### **3. Complete Authentication Flow**

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: USER LOGS IN                                       │
│                                                             │
│  Frontend:                                                  │
│  - User enters email & password                             │
│  - Submits form                                             │
│  - customFetch.post("/auth/login", { email, password })     │
│                                                             │
│  Backend:                                                    │
│  - authControllers.login() runs                             │
│  - Finds user in database                                   │
│  - Compares password                                        │
│  - Creates JWT token: token({ userId, role })              │
│  - Sets cookie: res.cookie('mytokenCookie', token)           │
│  - Returns: { message: "Logged in", user }                  │
│                                                             │
│  Browser:                                                    │
│  - Automatically saves cookie                               │
└─────────────────────────────────────────────────────────────┘
                     │
                     │ Cookie saved: mytokenCookie = "eyJhbGc..."
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 2: USER MAKES PROTECTED REQUEST                       │
│                                                             │
│  Frontend:                                                  │
│  - User clicks "Add Job"                                    │
│  - customFetch.post("/jobs", { company, position })          │
│  - Browser automatically includes cookie in request         │
│                                                             │
│  Backend:                                                    │
│  - Request arrives with cookie                              │
│  - authenticateUser middleware runs:                        │
│    1. Reads cookie: req.cookies.mytokenCookie                │
│    2. Verifies token: verifyToken(token)                     │
│    3. Extracts: { userId: "123", role: "user" }              │
│    4. Adds to request: req.user = { userId, role }           │
│    5. Calls next() → continues to controller                │
│                                                             │
│  Controller:                                                 │
│  - Gets userId from req.user.userId                          │
│  - Creates job with createdBy: req.user.userId               │
│  - Saves to database                                        │
│  - Returns: { job: {...} }                                  │
└─────────────────────────────────────────────────────────────┘
```

---

### **4. Why JWT + Cookies?**

**JWT Benefits:**

- Contains user info (no need to query database every time)
- Stateless (server doesn't need to store sessions)
- Secure (signed with secret key)

**Cookies Benefits:**

- Automatically sent with requests
- HttpOnly (can't be accessed by JavaScript - prevents XSS)
- Secure (only sent over HTTPS)

**Together:**

- JWT stores user info
- Cookie stores JWT securely
- Middleware verifies JWT on every request
- User stays logged in

---

## ✅ **VALIDATION & ERROR HANDLING** {#validation}

### **1. Backend Validation**

**Where it happens:**

- **Middleware** (before controller)
- **Models** (database schema validation)

**Example:**

```javascript
// Errors/validateMiddleware.js
const validateRegisterInput = [
  // Validation rules
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be 8+ characters"),

  // Error handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }
    next(); // Continue if valid
  },
];
```

**Flow:**

```
Request → Validation Middleware → If invalid: Return errors → If valid: Continue to controller
```

---

### **2. Frontend Validation Display**

**How it works:**

```javascript
// Register.jsx
export default function Register() {
  const actionData = useActionData(); // Gets errors from action()

  // Show toast for errors
  useEffect(() => {
    if (actionData?.errors) {
      toast.error(actionData.errors[0].message);
    }
  }, [actionData]);

  // Show field-specific errors
  const getFieldError = (fieldName) => {
    const error = actionData.errors?.find((err) => err.field === fieldName);
    return error?.message || null;
  };

  return (
    <Input
      name="email"
      error={getFieldError("email")} // Shows error below input
    />
  );
}
```

**Flow:**

```
Backend returns errors → action() catches → Returns to component →
Component displays errors → User sees what's wrong
```

---

### **3. Error Handling**

**Backend Error Handling:**

```javascript
// middlewares/errorHandlingMiddleware.js
export const errorHandlingMiddleware = (err, req, res, next) => {
  // Custom errors have statusCode
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({ msg: message });
};

// Custom error classes
export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400; // Bad Request
  }
}

// Usage in controller
if (!email || !password) {
  throw new BadRequestError("Please provide email and password");
}
```

**Frontend Error Handling:**

```javascript
// In action function
try {
  await customFetch.post("/auth/login", data);
  return { success: true };
} catch (error) {
  // Catch backend errors
  return {
    error: error.response?.data?.msg || "Login failed",
  };
}
```

---

## 📝 **COMPLETE REQUEST FLOW EXAMPLE** {#example}

### **Example: User Creates a Job**

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: USER ACTION (Frontend)                            │
│                                                             │
│  User fills form in AddJob.jsx:                             │
│  - Company: "Google"                                        │
│  - Position: "Software Engineer"                            │
│  - Clicks "Submit"                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Form submits
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 2: FRONTEND ACTION (Frontend)                         │
│                                                             │
│  action() function runs:                                    │
│  const formData = await request.formData();                 │
│  const data = { Company: "Google", Position: "..." };       │
│                                                             │
│  Makes API call:                                            │
│  await customFetch.post("/jobs", data);                     │
│                                                             │
│  customFetch automatically:                                 │
│  - Adds baseURL: http://localhost:5200/api/v1              │
│  - Sends cookies (mytokenCookie)                            │
│  - Full URL: POST http://localhost:5200/api/v1/jobs         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP POST Request
                     │ Headers: Cookie: mytokenCookie=...
                     │ Body: { Company: "Google", Position: "..." }
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 3: SERVER.JS (Backend Entry Point)                   │
│                                                             │
│  Express receives request:                                  │
│  - URL: /api/v1/jobs                                        │
│  - Method: POST                                             │
│  - Checks routes: app.use("/api/v1/jobs", ...)              │
│  - Matches route → Goes to jobRoutes                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Route matches
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 4: AUTHENTICATION MIDDLEWARE                          │
│                                                             │
│  authenticateUser middleware runs:                          │
│  1. Reads cookie: req.cookies.mytokenCookie                 │
│  2. Verifies JWT: verifyToken(token)                          │
│  3. Extracts: { userId: "123", role: "user" }              │
│  4. Adds to request: req.user = { userId: "123", role: "user" } │
│  5. Calls next() → Continues                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ User authenticated
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 5: ROUTES (Backend)                                  │
│                                                             │
│  jobRoutes.js:                                              │
│  router.route('/').post(createJob);                         │
│                                                             │
│  Matches: POST /api/v1/jobs                                 │
│  Calls: createJob() controller function                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Routes to controller
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 6: CONTROLLER (Backend Business Logic)                │
│                                                             │
│  JobControllers.js - createJob():                            │
│  1. Gets userId from req.user.userId (from middleware)     │
│  2. Adds userId to job: req.body.createdBy = req.user.userId │
│  3. Uses Model: const job = await Job.create(req.body)     │
│  4. Returns: res.json({ job })                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Controller uses Model
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 7: MODEL (Backend Database Schema)                    │
│                                                             │
│  jobModel.js:                                               │
│  1. Validates data (Company required, etc.)                │
│  2. Creates document in MongoDB                            │
│  3. Saves to "jobs" collection                             │
│  4. Returns created job document                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Database operation
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 8: DATABASE (MongoDB)                                 │
│                                                             │
│  Stores job document:                                       │
│  {                                                          │
│    _id: ObjectId("..."),                                    │
│    Company: "Google",                                       │
│    Position: "Software Engineer",                          │
│    createdBy: ObjectId("123"),  // Links to user            │
│    createdAt: Date,                                         │
│    updatedAt: Date                                          │
│  }                                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Returns saved document
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 9: RESPONSE (Backend → Frontend)                     │
│                                                             │
│  Controller returns:                                         │
│  res.status(201).json({ job: {...} })                       │
│                                                             │
│  HTTP Response:                                             │
│  Status: 201 Created                                        │
│  Body: { job: { Company: "Google", ... } }                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Response
                     │
┌────────────────────▼────────────────────────────────────────┐
│  STEP 10: FRONTEND UPDATE (Frontend)                       │
│                                                             │
│  action() receives response:                                │
│  const response = await customFetch.post("/jobs", data);   │
│  // response.data = { job: {...} }                          │
│                                                             │
│  Component updates:                                         │
│  - Shows success message                                    │
│  - Updates job list                                         │
│  - Redirects or refreshes data                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **KEY CONCEPTS SUMMARY** {#summary}

### **Frontend Concepts**

| **Concept**          | **What It Does**                    | **Example**                                |
| -------------------- | ----------------------------------- | ------------------------------------------ |
| **Components**       | Reusable UI parts                   | `<Button />`, `<Input />`                  |
| **Pages**            | Complete views                      | `<Login />`, `<Dashboard />`               |
| **Routes**           | URL → Component mapping             | `/login` → `<Login />`                     |
| **Actions**          | Handle form submissions             | Submit login form → Call API               |
| **Loaders**          | Fetch data before component renders | `loader: headerLoader` → `useLoaderData()` |
| **Direct API Calls** | Button clicks, user actions         | `onClick={() => customFetch.post(...)}`    |
| **Axios/Fetch**      | Make HTTP requests                  | `customFetch.post("/jobs", data)`          |

### **Backend Concepts**

| **Concept**     | **What It Does**         | **Example**                            |
| --------------- | ------------------------ | -------------------------------------- |
| **Models**      | Database schema          | `userModel.js` defines User structure  |
| **Controllers** | Business logic           | `login()` handles login process        |
| **Routes**      | URL → Controller mapping | `POST /auth/login` → `login()`         |
| **Middleware**  | Request processing       | `authenticateUser` checks if logged in |
| **Server.js**   | Entry point              | Starts server, connects routes         |

### **Connection Concepts**

| **Concept**        | **What It Does**    | **Example**                       |
| ------------------ | ------------------- | --------------------------------- |
| **HTTP Requests**  | Frontend → Backend  | `POST /api/v1/jobs`               |
| **HTTP Responses** | Backend → Frontend  | `{ job: {...} }`                  |
| **Cookies**        | Store JWT token     | `mytokenCookie = "eyJhbGc..."`    |
| **JWT**            | Encrypted user info | `{ userId: "123", role: "user" }` |

### **Security Concepts**

| **Concept**        | **What It Does**         | **Example**                   |
| ------------------ | ------------------------ | ----------------------------- |
| **Authentication** | Verify user is logged in | Check JWT token in cookie     |
| **Authorization**  | Check user permissions   | Admin only routes             |
| **Validation**     | Check data is valid      | Email format, password length |
| **Error Handling** | Catch and handle errors  | Return user-friendly messages |

---

## 🔄 **COMPLETE DATA FLOW**

```
USER ACTION
    ↓
FRONTEND COMPONENT (User sees form)
    ↓
USER SUBMITS FORM
    ↓
FRONTEND ACTION (Handles submission)
    ↓
AXIOS/FETCH (Makes HTTP request)
    ↓
HTTP REQUEST (With cookies)
    ↓
BACKEND SERVER.JS (Receives request)
    ↓
ROUTES (Matches URL to controller)
    ↓
MIDDLEWARE (Validates, authenticates)
    ↓
CONTROLLER (Business logic)
    ↓
MODEL (Database operations)
    ↓
MONGODB (Stores/retrieves data)
    ↓
MODEL (Returns data)
    ↓
CONTROLLER (Returns response)
    ↓
HTTP RESPONSE (JSON data)
    ↓
FRONTEND ACTION (Receives response)
    ↓
FRONTEND COMPONENT (Updates UI)
    ↓
USER SEES RESULT
```

---

## 📚 **ADDITIONAL IMPORTANT CONCEPTS**

### **1. Environment Variables (.env)**

**What it is:**

- Stores sensitive configuration
- Not committed to git
- Loaded by `dotenv`

**Example:**

```
MONGODB_CONNECTION_URL=mongodb://localhost:27017/jobify
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=1d
PORT=5200
```

**Purpose:**

- Keep secrets secure
- Different configs for dev/production
- Easy to change without code changes

---

### **2. CORS (Cross-Origin Resource Sharing)**

**What it is:**

- Allows frontend (port 5173) to call backend (port 5200)
- Different ports = different origins

**Example:**

```javascript
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
  })
);
```

**Purpose:**

- Security feature
- Prevents unauthorized domains from accessing API
- Allows cookies to be sent

---

### **3. Cookie Parser**

**What it is:**

- Middleware that reads cookies from requests
- Makes cookies available in `req.cookies`

**Example:**

```javascript
app.use(cookieParser());

// Now you can access:
req.cookies.mytokenCookie; // Gets JWT token
```

---

### **4. Express.json()**

**What it is:**

- Middleware that parses JSON request bodies
- Makes JSON data available in `req.body`

**Example:**

```javascript
app.use(express.json());

// Now you can access:
req.body.email; // From JSON request
req.body.password; // From JSON request
```

---

### **5. Morgan (Logging)**

**What it is:**

- Middleware that logs HTTP requests
- Shows: method, URL, status, response time

**Example:**

```javascript
app.use(morgan("dev"));

// Logs:
// POST /api/v1/auth/login 200 15.234 ms
```

---

### **6. withCredentials (Axios)**

**What it is:**

- Tells browser to send cookies with requests
- Required for authentication

**Example:**

```javascript
axios.create({
  baseURL: "http://localhost:5200/api/v1",
  withCredentials: true, // ← Sends cookies automatically
});
```

---

---

## 🔐 **FILE UPLOADS & SECURITY** {#security-upload}

### **1. Encryption (Password Hashing)**

**What it is:**

- Converting passwords into unreadable strings
- **Never** store plain text passwords in the database
- Uses `bcrypt.js` library

**How it works:**

1. **User Registers:**

   - User enters "secret123"
   - Backend hashes it: `$2b$10$X7...`
   - Stores hash in DB

2. **User Logs In:**
   - User enters "secret123"
   - Backend compares input with stored hash
   - If match → Login success

**Code Snippet:**

```javascript
// models/userModel.js
import bcrypt from "bcryptjs";

// Before saving user, hash password
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

---

### **2. Multer (File Upload Middleware)**

**What it is:**

- Middleware for handling `multipart/form-data`
- Used for uploading files (images, PDFs, etc.)
- Can save files to:
  - **Disk Storage:** Save to local folder (`public/uploads`)
  - **Memory Storage:** Keep in memory (for Cloudinary)

**Configuration (Disk Storage):**

```javascript
// middlewares/multerMiddleware.js
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Save to this folder
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    cb(null, fileName); // Keep original name
  },
});

const upload = multer({ storage });
export default upload;
```

**Usage in Route:**

```javascript
// routes/userRoutes.js
import upload from "../middlewares/multerMiddleware.js";

// 'avatar' matches the name attribute in frontend form input
router.patch("/update-user", upload.single("avatar"), updateUser);
```

---

### **3. Cloudinary (Image Hosting)**

**What it is:**

- Cloud service for storing and managing images
- Better than local storage for production apps
- Provides URL to access the image

**Configuration:**

```javascript
// server.js
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

**Upload Logic (Controller):**

```javascript
// controllers/userController.js
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

export const updateUser = async (req, res) => {
  // 1. Check if file exists
  if (req.file) {
    // 2. Upload to Cloudinary
    const response = await cloudinary.v2.uploader.upload(req.file.path);

    // 3. Delete local file
    await fs.unlink(req.file.path);

    // 4. Update user data with Cloudinary URL
    newUser.avatar = response.secure_url;
    newUser.avatar_public_id = response.public_id;
  }

  // ... update user in DB
};
```

---

## 🎓 **FINAL SUMMARY**

### **Frontend:**

1. **Components** = UI building blocks
2. **Pages** = Complete views (combine components)
3. **Routes** = URL → Component mapping
4. **Loaders** = Load data from DB to frontend (GET only, runs on page load, use `useLoaderData()` to access)
5. **Actions** = Send data to DB from frontend (POST/PUT/DELETE, runs on form submit, use `useActionData()` to access)
6. **Direct API Calls** = Any functionality triggered by events (any HTTP method, runs on button clicks/events)
7. **Axios** = Make HTTP requests to backend

### **Backend:**

1. **Models** = Database schema (what data looks like)
2. **Controllers** = Business logic (what happens)
3. **Routes** = URL → Controller mapping
4. **Middleware** = Request processing (auth, validation)
5. **Server.js** = Entry point (connects everything)

### **Connection:**

1. **Frontend** makes HTTP request (Axios)
2. **Backend** receives request (Express)
3. **Middleware** processes (auth, validation)
4. **Controller** executes business logic
5. **Model** talks to database
6. **Response** sent back to frontend
7. **Frontend** updates UI

### **Security:**

1. **JWT** = Encrypted token with user info
2. **Cookies** = Store JWT securely
3. **Authentication** = Verify user is logged in
4. **Validation** = Check data is valid
5. **Error Handling** = Catch and handle errors gracefully

---

## 📖 **QUICK REFERENCE**

### **Frontend Route vs Backend Route**

| **Frontend Route**           | **Backend Route**                      |
| ---------------------------- | -------------------------------------- |
| Maps URL to **Component**    | Maps URL to **Function**               |
| `/login` → Shows `<Login />` | `/api/v1/auth/login` → Calls `login()` |
| Handles **navigation**       | Handles **API requests**               |
| No page refresh              | Returns JSON data                      |

### **Request Flow**

```
Frontend Route → Loader (fetch data) → Component → useLoaderData() →
Action (form submit) OR Direct Call (button click) → Axios → HTTP Request →
Backend Route → Middleware → Controller → Model → Database →
Response → Frontend → Update UI
```

### **Three Patterns for Frontend-Backend Interaction**

**1. Loader Pattern (Load Data from DB - GET):**

```
Purpose: Load data from DB to frontend
When: Page loads (automatic)
HTTP Method: GET only
Connected: Route in App.jsx
Access: useLoaderData() hook

Flow:
User navigates to route → Loader runs automatically →
Fetches data (GET request) → Component renders with data
```

**2. Action Pattern (Send Data to DB - POST/PUT/DELETE):**

```
Purpose: Send data to DB from frontend
When: Form submits (automatic)
HTTP Method: POST, PUT, DELETE
Connected: Route in App.jsx
Access: useActionData() hook

Flow:
User submits form → Action runs → Processes form data →
Makes API call (POST/PUT/DELETE) → Returns result to component
```

**3. Direct Call Pattern (Any Functionality - Any HTTP Method):**

```
Purpose: Any functionality triggered by events
When: User clicks button/triggers event (manual)
HTTP Method: Any (GET, POST, PUT, DELETE)
Connected: Component function (not in App.jsx)
Access: Direct function call

Flow:
User clicks button → Function runs → Makes API call directly →
Shows feedback → Updates UI
```

### **File Structure**

```
Frontend:
- src/
  - components/     → Reusable UI parts
  - pages/          → Complete views
  - utils/          → Helper functions (customFetch)
  - App.jsx         → Route configuration

Backend:
- Models/          → Database schemas
- Controllers/     → Business logic
- Routes/          → URL mapping
- middlewares/     → Request processing
- utils/           → Helper functions (JWT, password)
- server.js        → Entry point
```

---

**🎉 This is the complete workflow of your MERN stack application!**
