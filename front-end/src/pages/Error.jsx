import error from "../assets/images/not-found.svg";
import {Link} from "react-router-dom";
import { useRouteError } from "react-router-dom";
export default function  Error() {
    const err  =  useRouteError();
    return <>
    <div className="min-h-screen flex flex-col items-center justify-center ">
    <div className="flex flex-col items-center justify-center min-h-screen max-w-6xl w-full mx-auto">
    <img src={error} alt="error" className="w-40 sm:w-60 md:w-[60%] mb-4 mx-auto"  />
    <h3 className="text-2xl font-bold mb-4">Ohh! page not found</h3>
    <p className="text-gray-600 mb-4">We can't seem to find the page you're looking for</p>
    <Link to='/dashboard' className="bg-[#2EB0BC] text-white px-6 py-2 rounded-md hover:bg-[#2EB0BC] transition">back home</Link>
    </div>
    </div>
    </>
}