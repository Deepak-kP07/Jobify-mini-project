
import main from "../assets/images/main.svg";
import { Link } from "react-router-dom";
import Logo from "../components/Logo"; 

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="p-6 mt-8 pl-[10%]">
        <Logo/>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-6 lg:px-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl w-full">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl font-bold mb-6 leading-snug">
              Job <span className="text-teal-600">Tracking</span> App
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              I'm baby wayfarers hoodie next level taiyaki brooklyn cliche blue
              bottle. Aesthetic post-ironic venmo, quinoa lo-fi tote bag
              adaptogen everyday carry meggings +1 brunch narwhal.
            </p>
            <div className="flex gap-4">
              <Link
                to="/register"
                className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition"
              >
                Login / Demo User
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="hidden md:flex">
            <img
              src={main}
              alt="landing-page illustration"
              className="w-full max-w-lg"
            />
          </div>
        </div>
      </section>
    </main> 
  
  )
}
