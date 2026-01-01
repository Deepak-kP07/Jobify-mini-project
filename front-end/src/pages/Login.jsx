import Button from "../components/Button";
import Input from "../components/Input";
import Logo from "../components/Logo";
import { Link, Form, useNavigation, useActionData } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function Login() {
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";

  // Show toast notifications
  useEffect(() => {
    if (actionData?.success) {
      toast.success("Login successful! Redirecting to dashboard...");
      // Redirect after showing toast
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else if (actionData?.error) {
      // Small delay to ensure ToastContainer is ready
      const timer = setTimeout(() => {
        toast.error(actionData.error);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  return (
    <>
      <div className="border p-4 mx-auto max-w-[70%] w-full border-gray-300 shadow-[2px_2px_30px_gray] border-t-4 border-t-[#2EB0BC] rounded-xl mt-[10%] mb-12">
        <div className="mx-auto mb-4 w-32">
          <Logo />
        </div>
        <h4 className="text-xl mb-4 text-center text-stone-600">Login</h4>

        {/* Display error message */}
        {actionData?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {actionData.error}
          </div>
        )}

        <Form method="post">
          <Input
            label={"Email"}
            type={"email"}
            placeholder={"Enter Your Email ID"}
            name={"email"}
          />
          <Input
            label={"Password"}
            placeholder={"Enter Password"}
            type={"password"}
            name={"password"}
          />
          <Button
            btnName={isSubmitting ? "Logging in..." : "Login"}
            isSubmitting={isSubmitting}
          />

          <p className="text-center mb-4 text-sm">
            Not a member yet?
            <Link to="/register">
              <span className="text-[#2EB0BC] text-center ml-2">
                Register ?
              </span>
            </Link>
          </p>
        </Form>
      </div>
    </>
  );
}
