# 🎯 **COMPLETE CODEBASE EXPLANATION - JOBIFY**

## 📋 **TABLE OF CONTENTS**

1. [How to Open Terminal in Cursor](#terminal)
2. [Project Architecture Overview](#architecture)
3. [How Data Flows Through the System](#data-flow)
4. [Backend Explanation](#backend)
5. [Frontend Explanation](#frontend)
6. [How Modules Connect](#connections)
7. [Complete Request Flow Example](#request-flow)

---

## 🔧 **HOW TO OPEN TERMINAL IN CURSOR** {#terminal}

### **Method 1: Keyboard Shortcut (EASIEST)**

- **Mac**: Press `Cmd + `` (backtick key - usually above Tab)
- **Windows/Linux**: Press `Ctrl + ``

### **Method 2: Menu**

- Go to: **View** → **Terminal**

### **Method 3: Command Palette**

- Press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows)
- Type: "Terminal: Create New Terminal"
- Press Enter

### **Method 4: Bottom Panel**

- Look at the bottom of your Cursor window
- Click on the **"Terminal"** tab (if it's hidden, it will appear)

---

## 🏗️ **PROJECT ARCHITECTURE OVERVIEW** {#architecture}

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  Port: 5173  |  http://localhost:5173                   │
│  - User Interface                                        │
│  - Makes HTTP requests to backend                        │
└──────────────────┬───────────────────────────────────────┘
                   │ HTTP Requests (with cookies)
                   │
┌──────────────────▼───────────────────────────────────────┐
│                 BACKEND (Node.js/Express)                │
│  Port: 5200  |  http://localhost:5200                   │
│  - Receives requests                                      │
│  - Processes business logic                              │
│  - Talks to database                                      │
└──────────────────┬───────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────┐
│              DATABASE (MongoDB)                          │
│  - Stores Users                                          │
│  - Stores Jobs                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 **HOW DATA FLOWS THROUGH THE SYSTEM** {#data-flow}

### **Example: User Creates a Job**

```
1. USER ACTION
   ↓
   User fills form in React (AddJob.jsx)
   ↓
2. FRONTEND
   ↓
   Makes POST request to: http://localhost:5200/api/v1/jobs
   ↓
3. BACKEND SERVER (server.js)
   ↓
   Receives request → Checks route → Applies middleware
   ↓
4. AUTHENTICATION MIDDLEWARE (authMiddleware.js)
   ↓
   Checks if user is logged in (reads cookie)
   ↓
5. ROUTE HANDLER (jobRoutes.js)
   ↓
   Routes to correct controller function
   ↓
6. CONTROLLER (JobControllers.js)
   ↓
   createJob() function executes business logic
   ↓
7. MODEL (jobModel.js)
   ↓
   Creates job in MongoDB database
   ↓
8. RESPONSE
   ↓
   Returns JSON data back to frontend
   ↓
9. FRONTEND
   ↓
   Updates UI to show new job
```

---

## 🖥️ **BACKEND EXPLANATION** {#backend}

### **1. SERVER.JS - The Entry Point**

**Location**: `/server.js`

**What it does:**

- Starts the Express server
- Connects to MongoDB database
- Sets up all routes
- Configures middleware (CORS, cookies, JSON parsing)
- Handles errors

**Key Code Breakdown:**

```javascript
// 1. Import all routes
import jobRoutes from "./Routes/jobRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";

// 2. Set up middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Read cookies
app.use(cors()); // Allow frontend to connect

// 3. Connect routes
app.use("/api/v1/jobs", authenticateUser, jobRoutes);
//     ↑ URL path    ↑ Middleware  ↑ Route handler

// 4. Connect to database and start server
await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
app.listen(5200);
```

**Flow:**

```
Request comes in → Middleware runs → Route matches → Controller executes → Response sent
```

---

### **2. MODELS - Database Structure**

**What Models Do:**

- Define the structure of data in MongoDB
- Set validation rules
- Create relationships between data

#### **A. User Model** (`Models/userModel.js`)

**What it stores:**

```javascript
{
  firstName: "John",        // Required, 3-50 characters
  lastName: "Doe",          // Required, 1-50 characters
  email: "john@email.com",  // Required, unique, must be valid email
  password: "hashed...",     // Required, min 8 characters
  location: "New York",     // Optional, defaults to "my city"
  role: "user" or "admin",  // Either user or admin
  createdAt: Date,          // Auto-generated
  updatedAt: Date           // Auto-generated
}
```

**Purpose:** Defines what a user looks like in the database

#### **B. Job Model** (`Models/jobModel.js`)

**What it stores:**

```javascript
{
  Company: "Google",                    // Required, max 50 chars
  Position: "Software Engineer",        // Optional
  JobStatus: "pending" | "interview" | "declined",  // Default: pending
  JobType: "full-time" | "part-time" | "internship", // Default: full-time
  JobLocation: "San Francisco",         // Default: "my city"
  createdBy: ObjectId,                  // Links to User who created it
  createdAt: Date,                      // Auto-generated
  updatedAt: Date                       // Auto-generated
}
```

**Purpose:** Defines what a job application looks like in the database

**Key Relationship:**

- `createdBy` links to a User's `_id`
- This means: "This job belongs to this user"

---

### **3. CONTROLLERS - Business Logic**

**What Controllers Do:**

- Handle the actual work when a request comes in
- Talk to the database through Models
- Return responses to the client

#### **A. Auth Controllers** (`Controllers/authControllers.js`)

**Functions:**

**1. `register(req, res, next)`**

```javascript
// What happens:
1. Check if this is the first user → Make them admin
2. Hash the password (for security)
3. Create user in database
4. Return success message
```

**2. `login(req, res, next)`**

```javascript
// What happens:
1. Check if email and password provided
2. Find user by email in database
3. Compare password with hashed password
4. If correct:
   - Create JWT token
   - Store token in cookie (httpOnly, secure)
   - Return user data
5. If wrong: Return error
```

**3. `logout(req, res, next)`**

```javascript
// What happens:
1. Replace cookie with "logout" string
2. Set cookie to expire immediately
3. Return success message
```

#### **B. Job Controllers** (`Controllers/JobControllers.js`)

**Functions:**

**1. `getAllJobs(req, res, next)`**

```javascript
// What happens:
1. Get userId from req.user (set by auth middleware)
2. Find ALL jobs where createdBy = userId
3. Return jobs array
```

**2. `createJob(req, res, next)`**

```javascript
// What happens:
1. Get userId from req.user
2. Add userId to req.body.createdBy
3. Create job in database
4. Return created job
```

**3. `getJob(req, res, next)`**

```javascript
// What happens:
1. Get job id from URL params
2. Find job by id in database
3. Return job data
```

**4. `editJob(req, res, next)`**

```javascript
// What happens:
1. Get job id from URL params
2. Get updated data from req.body
3. Update job in database
4. Return updated job
```

**5. `deleteJob(req, res, next)`**

```javascript
// What happens:
1. Get job id from URL params
2. Delete job from database
3. Return success message
```

#### **C. User Controllers** (`Controllers/userController.js`)

**Functions:**

- `getCurrentUser` - Get logged-in user's data
- `updateUser` - Update logged-in user's profile
- `deleteUser` - Delete logged-in user's account
- `getAllUsers` - Admin only: Get all users
- `getApplicationStats` - Admin only: Get statistics

---

### **4. ROUTES - URL Mapping**

**What Routes Do:**

- Map URLs to controller functions
- Define which HTTP methods are allowed (GET, POST, PATCH, DELETE)

#### **A. Job Routes** (`Routes/jobRoutes.js`)

```javascript
// GET    /api/v1/jobs        → getAllJobs()
// POST   /api/v1/jobs        → createJob()
// GET    /api/v1/jobs/:id    → getJob()
// PATCH  /api/v1/jobs/:id    → editJob()
// DELETE /api/v1/jobs/:id    → deleteJob()
```

#### **B. Auth Routes** (`Routes/authRoutes.js`)

```javascript
// POST /api/v1/auth/register → register()
// POST /api/v1/auth/login    → login()
// POST /api/v1/auth/logout   → logout()
```

#### **C. User Routes** (`Routes/userRoutes.js`)

```javascript
// GET    /api/v1/users/current-user     → getCurrentUser()
// PATCH  /api/v1/users/update-user      → updateUser()
// DELETE /api/v1/users/delete-user      → deleteUser()
// GET    /api/v1/users/admin/users      → getAllUsers() [Admin only]
// GET    /api/v1/users/admin/app-stats   → getApplicationStats() [Admin only]
```

---

### **4B. FRONTEND ROUTES - Page/Component Mapping** (`front-end/src/App.jsx`)

**What Frontend Routes Do:**

- Map URLs to React components/pages
- Handle client-side navigation (no page refresh)
- Define which component shows for which URL path

**Key Difference from Backend Routes:**

- **Backend Routes**: Map URLs to **functions** (controllers) that process requests
- **Frontend Routes**: Map URLs to **React components** (pages) that users see

#### **Frontend Route Structure** (`App.jsx`)

```javascript
// Main Routes
/                    → <HomeLayout /> (wrapper)
  ├─ /              → <Landing /> (home page)
  ├─ /login         → <Login /> (login page)
  ├─ /register      → <Register /> (register page)
  └─ /dashboard     → <DashboardLayout /> (dashboard wrapper)
      ├─ /dashboard          → <AddJob /> (default dashboard page)
      ├─ /dashboard/stats    → <Stats /> (statistics page)
      ├─ /dashboard/all-jobs → <AllJobs /> (all jobs list)
      ├─ /dashboard/profile  → <Profile /> (user profile)
      └─ /dashboard/admin     → <Admin /> (admin page)
```

#### **How Frontend Routes Work:**

**1. URL Changes → Component Renders**

```javascript
// User visits: http://localhost:5173/login
// React Router sees: path = '/login'
// React Router renders: <Login /> component
```

**2. Nested Routes (Children)**

```javascript
// User visits: http://localhost:5173/dashboard/stats
// React Router:
//   1. Renders <DashboardLayout /> (parent)
//   2. Renders <Stats /> inside it (child via <Outlet />)
```

**3. Navigation Without Page Refresh**

```javascript
// When user clicks a link:
<Link to="/dashboard">Go to Dashboard</Link>

// React Router:
// - Changes URL in browser
// - Renders new component
// - NO page reload (faster, smoother)
```

#### **Complete Frontend Route Breakdown:**

**A. Home Layout Routes**

```javascript
// Base path: '/'
path: '/' → <HomeLayout />
  ├─ index: true → <Landing />        // Shows when URL is exactly '/'
  ├─ path: 'login' → <Login />         // Shows when URL is '/login'
  └─ path: 'register' → <Register />  // Shows when URL is '/register'
```

**B. Dashboard Routes (Nested)**

```javascript
// Base path: '/dashboard'
path: 'dashboard' → <DashboardLayout />
  ├─ index: true → <AddJob />              // Shows when URL is '/dashboard'
  ├─ path: 'stats' → <Stats />              // Shows when URL is '/dashboard/stats'
  ├─ path: 'all-jobs' → <AllJobs />         // Shows when URL is '/dashboard/all-jobs'
  ├─ path: 'profile' → <Profile />         // Shows when URL is '/dashboard/profile'
  └─ path: 'admin' → <Admin />             // Shows when URL is '/dashboard/admin'
```

#### **Frontend vs Backend Routes Comparison:**

| **Backend Routes**                           | **Frontend Routes**                           |
| -------------------------------------------- | --------------------------------------------- |
| Map URLs to **functions**                    | Map URLs to **components**                    |
| Process HTTP requests                        | Display UI pages                              |
| Return JSON data                             | Render React components                       |
| Handle GET, POST, PATCH, DELETE              | Handle URL navigation                         |
| Example: `GET /api/v1/jobs` → `getAllJobs()` | Example: `/dashboard` → `<DashboardLayout />` |

#### **How to Navigate in Frontend:**

**1. Using Link Component:**

```javascript
import { Link } from "react-router-dom";

<Link to="/dashboard">Go to Dashboard</Link>;
// When clicked: URL changes to '/dashboard', <DashboardLayout /> renders
```

**2. Using useNavigate Hook:**

```javascript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/dashboard"); // Programmatically navigate
```

**3. Using NavLink (for active states):**

```javascript
import { NavLink } from "react-router-dom";

<NavLink
  to="/dashboard"
  className={({ isActive }) => (isActive ? "active" : "")}
>
  Dashboard
</NavLink>;
// Automatically adds 'active' class when route matches
```

#### **Route Protection (Future Enhancement):**

Currently, routes are not protected. You could add:

```javascript
// Protected route example (not implemented yet)
{
  path: 'dashboard',
  element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
  // ProtectedRoute would check if user is logged in
}
```

---

### **5. MIDDLEWARE - Request Processing**

**What Middleware Does:**

- Runs BEFORE the controller
- Can modify the request
- Can block the request
- Can add data to the request

#### **A. Authentication Middleware** (`middlewares/authMiddleware.js`)

**`authenticateUser(req, res, next)`**

```javascript
// What happens:
1. Read cookie named "mytokenCookie"
2. If no cookie → Throw error (user not logged in)
3. Verify JWT token
4. Extract userId and role from token
5. Add to req.user = { userId, role }
6. Call next() to continue to controller
```

**Purpose:** Protects routes - only logged-in users can access

**`authorizePermissions(...roles)`**

```javascript
// What happens:
1. Check if user's role is in allowed roles
2. If yes → Continue
3. If no → Block request
```

**Purpose:** Protects admin routes - only admins can access

#### **B. Error Handling Middleware** (`middlewares/errorHandlingMiddleware.js`)

**What it does:**

- Catches all errors
- Sends consistent error responses
- Prevents server crashes

---

### **6. UTILITIES - Helper Functions**

#### **A. JWT Token** (`utils/jwtToken.js`)

- `token(payload)` - Creates JWT token
- `verifyToken(token)` - Verifies and decodes JWT token

#### **B. Password Utils** (`utils/passwordUtils.js`)

- `hashedPassword(password)` - Hashes password with bcrypt
- `comparePassword(password, hash)` - Compares password with hash

#### **C. Constants** (`utils/constants.js`)

- `JOB_STATUS` - pending, interview, declined
- `JOB_TYPE` - full-time, part-time, internship

---

## 🎨 **FRONTEND EXPLANATION** {#frontend}

### **1. APP.JSX - Main Router**

**What it does:**

- Sets up all routes/pages
- Defines which component shows for which URL
- Uses React Router DOM for client-side navigation

**Routes:**

```
/              → Landing page
/login         → Login page
/register      → Register page
/dashboard     → Dashboard (main app)
  ├─ /dashboard          → AddJob page
  ├─ /dashboard/stats    → Stats page
  ├─ /dashboard/all-jobs → AllJobs page
  ├─ /dashboard/profile  → Profile page
  └─ /dashboard/admin    → Admin page
```

**📌 For detailed explanation of how frontend routes work, see [Frontend Routes Section](#4b-frontend-routes---pagecomponent-mapping-front-endsrcappjsx) above.**

---

### **2. PAGES - Different Views**

#### **A. Landing Page** (`pages/Landing.jsx`)

- First page users see
- Has "Register" and "Login" buttons

#### **B. Login Page** (`pages/Login.jsx`)

- Form with email and password
- Submits to `/api/v1/auth/login`

#### **C. Register Page** (`pages/Register.jsx`)

- Form with user details
- Submits to `/api/v1/auth/register`

#### **D. Dashboard Layout** (`pages/DashboardLayout.jsx`)

- Wrapper for all dashboard pages
- Contains Sidebar and Header
- Shows different pages based on route

#### **E. AddJob Page** (`pages/AddJob.jsx`)

- Form to create new job
- Submits to `/api/v1/jobs` (POST)

#### **F. AllJobs Page** (`pages/AllJobs.jsx`)

- Lists all user's jobs
- Fetches from `/api/v1/jobs` (GET)

#### **G. Stats Page** (`pages/Stats.jsx`)

- Shows statistics about jobs
- Charts and graphs

#### **H. Profile Page** (`pages/Profile.jsx`)

- User profile management
- Update user info

#### **I. Admin Page** (`pages/Admin.jsx`)

- Admin-only features
- User management, statistics

---

### **3. COMPONENTS - Reusable UI Elements**

#### **A. Button** (`components/Button.jsx`)

- Reusable button component
- Used in forms

#### **B. Input** (`components/Input.jsx`)

- Reusable input field
- Used in forms

#### **C. Logo** (`components/Logo.jsx`)

- Company logo
- Used in header/sidebar

#### **D. Header** (`components/Header.jsx`)

- Top navigation bar
- Shows in dashboard

#### **E. Sidebar** (`components/Sidebar.jsx`)

- Left navigation menu
- Links to different pages
- Shows user info at bottom

#### **F. Navbar** (`components/Navbar.jsx`)

- Navigation links
- Used inside Sidebar

---

### **4. UTILITIES - Helper Functions**

#### **Custom Fetch** (`utils/customFetch.js`)

```javascript
// Creates axios instance with base URL
// All API calls use this
customFetch.get('/jobs')     → http://localhost:5200/api/v1/jobs
customFetch.post('/auth/login', data) → http://localhost:5200/api/v1/auth/login
```

**Features:**

- Automatically includes cookies (for authentication)
- Base URL already set
- Makes API calls easier

---

## 🔗 **HOW MODULES CONNECT** {#connections}

### **Connection Flow:**

```
┌─────────────┐
│   USER      │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Clicks "Add Job" button
       │
┌──────▼──────────────────────────────────────────┐
│           FRONTEND (React)                      │
│  ┌──────────────────────────────────────────┐  │
│  │  AddJob.jsx                              │  │
│  │  - User fills form                       │  │
│  │  - Calls: customFetch.post('/jobs', data) │  │
│  └──────────────┬───────────────────────────┘  │
│                 │                               │
│  ┌──────────────▼───────────────────────────┐  │
│  │  customFetch.js                          │  │
│  │  - Sends POST to:                        │  │
│  │    http://localhost:5200/api/v1/jobs    │  │
│  │  - Includes cookies (authentication)      │  │
│  └──────────────┬───────────────────────────┘  │
└─────────────────┼──────────────────────────────┘
                  │
                  │ 2. HTTP POST Request
                  │    (with cookie)
                  │
┌─────────────────▼──────────────────────────────┐
│         BACKEND (Express)                     │
│  ┌──────────────────────────────────────────┐ │
│  │  server.js                               │ │
│  │  - Receives request                      │ │
│  │  - Routes to: /api/v1/jobs               │ │
│  └──────────────┬───────────────────────────┘ │
│                 │                              │
│  ┌──────────────▼───────────────────────────┐ │
│  │  authMiddleware.js                       │ │
│  │  - Reads cookie                          │ │
│  │  - Verifies JWT token                    │ │
│  │  - Adds req.user = {userId, role}       │ │
│  └──────────────┬───────────────────────────┘ │
│                 │                              │
│  ┌──────────────▼───────────────────────────┐ │
│  │  jobRoutes.js                            │ │
│  │  - Matches POST /                        │ │
│  │  - Calls: createJob()                   │ │
│  └──────────────┬───────────────────────────┘ │
│                 │                              │
│  ┌──────────────▼───────────────────────────┐ │
│  │  JobControllers.js                      │ │
│  │  createJob() function:                  │ │
│  │  - Gets userId from req.user            │ │
│  │  - Adds createdBy: userId               │ │
│  │  - Calls: Job.create(req.body)          │ │
│  └──────────────┬───────────────────────────┘ │
│                 │                              │
│  ┌──────────────▼───────────────────────────┐ │
│  │  jobModel.js                             │ │
│  │  - Validates data                        │ │
│  │  - Saves to MongoDB                      │ │
│  └──────────────┬───────────────────────────┘ │
└─────────────────┼──────────────────────────────┘
                  │
                  │ 3. Database Operation
                  │
┌─────────────────▼──────────────────────────────┐
│         MONGODB DATABASE                      │
│  - Stores job in "jobs" collection            │
│  - Links to user via createdBy field         │
└───────────────────────────────────────────────┘
                  │
                  │ 4. Returns saved job
                  │
┌─────────────────▼──────────────────────────────┐
│         BACKEND (Express)                      │
│  - Returns JSON: {job: {...}}                 │
└─────────────────┬───────────────────────────────┘
                  │
                  │ 5. HTTP Response
                  │
┌─────────────────▼──────────────────────────────┐
│         FRONTEND (React)                      │
│  - Receives job data                          │
│  - Updates UI to show new job                 │
│  - User sees success message                  │
└───────────────────────────────────────────────┘
```

---

## 📝 **COMPLETE REQUEST FLOW EXAMPLE** {#request-flow}

### **Example: User Logs In**

**Step 1: User Action**

- User goes to `/login`
- Fills email and password
- Clicks "Login" button

**Step 2: Frontend**

```javascript
// Login.jsx
const response = await customFetch.post("/auth/login", {
  email: "user@email.com",
  password: "password123",
});
```

**Step 3: HTTP Request**

```
POST http://localhost:5200/api/v1/auth/login
Body: { email: 'user@email.com', password: 'password123' }
```

**Step 4: Backend - Server.js**

```javascript
// server.js receives request
// Routes to: app.use('/api/v1/auth', authRoutes)
```

**Step 5: Backend - Routes**

```javascript
// authRoutes.js
router.post("/login", login);
// Calls login() from authControllers.js
```

**Step 6: Backend - Controller**

```javascript
// authControllers.js - login()
1. Find user by email in database
2. Compare password
3. Create JWT token
4. Set cookie with token
5. Return { user, token }
```

**Step 7: Response**

```json
{
  "message": "user logged in",
  "user": { "firstName": "John", "email": "..." },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Step 8: Frontend**

- Receives response
- Stores user data (maybe in state/context)
- Redirects to `/dashboard`
- Cookie is automatically saved by browser

**Step 9: Future Requests**

- When user makes requests to protected routes
- Browser automatically sends cookie
- Backend reads cookie and verifies user
- User can access protected pages

---

## 🎯 **KEY CONCEPTS TO REMEMBER**

### **1. Models = Database Structure**

- Define what data looks like
- Set validation rules
- Create relationships

### **2. Controllers = Business Logic**

- Handle requests
- Talk to database through Models
- Return responses

### **3. Routes = URL Mapping**

- Map URLs to controller functions
- Define HTTP methods

### **4. Middleware = Request Processing**

- Runs before controllers
- Can modify or block requests
- Authentication happens here

### **5. Frontend = User Interface**

- Makes HTTP requests
- Displays data
- Handles user interactions

### **6. Flow = Request → Middleware → Route → Controller → Model → Database → Response**

---

## 🚀 **HOW TO RUN THE PROJECT**

### **1. Open Terminal in Cursor**

- Press `Cmd + `` (backtick)

### **2. Install Dependencies (if not done)**

```bash
npm install
cd front-end
npm install
cd ..
```

### **3. Set Up Environment Variables**

Create `.env` file in root:

```
MONGODB_CONNECTION_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
PORT=5200
```

### **4. Run Development Server**

```bash
npm run dev
```

This starts:

- Backend on http://localhost:5200
- Frontend on http://localhost:5173

### **5. Access Application**

- Open browser: http://localhost:5173
- Register a new user (first user becomes admin)
- Login and start using the app!

---

## 📚 **SUMMARY**

**Backend:**

- `server.js` - Entry point, connects everything
- `Models/` - Database structure
- `Controllers/` - Business logic
- `Routes/` - URL mapping
- `middlewares/` - Request processing
- `utils/` - Helper functions

**Frontend:**

- `App.jsx` - Router setup
- `pages/` - Different views/pages
- `components/` - Reusable UI elements
- `utils/` - Helper functions (API calls)

**Connection:**

- Frontend makes HTTP requests to Backend
- Backend processes requests and talks to Database
- Database stores and returns data
- Backend sends response to Frontend
- Frontend updates UI

---

## ❓ **COMMON QUESTIONS**

**Q: Why do I need middleware?**
A: Middleware protects routes, authenticates users, and processes requests before they reach controllers.

**Q: What's the difference between Model and Controller?**
A: Model = Database structure. Controller = Business logic that uses the Model.

**Q: How does authentication work?**
A: User logs in → Gets JWT token in cookie → Cookie sent with every request → Middleware verifies token → Adds user info to request.

**Q: Why can't I access certain pages?**
A: They're protected by `authenticateUser` middleware. You need to be logged in.

**Q: How do I make the frontend talk to backend?**
A: Use `customFetch` from `utils/customFetch.js`. It's already configured to point to the backend.

---

**🎉 You now understand how the entire codebase works!**
