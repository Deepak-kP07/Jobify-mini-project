import { Outlet, Link } from "react-router-dom";
import ToastWrapper from "../components/ToastWrapper";

export default function HomeLayout() {
  return (
    <>
      {/* <h1> Nav bar </h1>
     <nav>
         <Link to='/login' > Login Page </Link>
         <Link to='/register' > register </Link>
     </nav> */}
      <Outlet />
      <ToastWrapper />
    </>
  );
}
