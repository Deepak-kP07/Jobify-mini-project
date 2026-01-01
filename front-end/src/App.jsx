// import { createBrowserRouter , RouterProvider} from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomeLayout,
  Register,
  Login,
  AllJobs,
  AddJob,
  DashboardLayout,
  DeleteJob,
  EditJob,
  Error,
  Landing,
  Profile,
  Stats,
  Admin,
} from "./pages";
import { registerAction } from "./actions/registerAction";
import { loginAction } from "./actions/loginAction";
import { headerLoader } from "./actions/headerLoader";
import { addJobAction } from "./actions/addJobAction";
import { allJobsLoader } from "./actions/allJobsLoader";
import { editJobLoader } from "./actions/editJobLoader";
import { editJobAction } from "./actions/editJobAction";
import { adminStatsLoader } from "./actions/adminStatsLoader";
import { updateUserAction } from "./actions/updateUserAction";
import { statsLoader } from "./actions/statsLoader";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <HomeLayout />,
        errorElement: <Error />,
        children: [
          { index: true, element: <Landing /> },
          { path: "login", element: <Login />, action: loginAction },
          { path: "register", element: <Register />, action: registerAction },
          {
            path: "dashboard",
            element: <DashboardLayout />,
            loader: headerLoader,
            children: [
              { index: true, element: <AddJob />, action: addJobAction },
              { path: "stats", element: <Stats />, loader: statsLoader },
              {
                path: "all-jobs",
                element: <AllJobs />,
                loader: allJobsLoader,
              },
              {
                path: "edit-job/:id",
                element: <EditJob />,
                loader: editJobLoader,
                action: editJobAction,
              },
              {
                path: "profile",
                element: <Profile />,
                action: updateUserAction,
              },
              { path: "admin", element: <Admin />, loader: adminStatsLoader },
            ],
          },
        ],
      },
    ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );
  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2EB0BC] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    />
  );
}
