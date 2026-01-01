// import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
import { Form, useNavigation, Link, useActionData } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function Register() {
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";

  // Show toast notifications
  useEffect(() => {
    if (actionData?.success) {
      toast.success("Registration successful! Redirecting to login...");
      // Redirect after showing toast
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else if (actionData?.errors) {
      // Small delay to ensure ToastContainer is ready
      const timer = setTimeout(() => {
        // Show toast for general errors
        const generalError = actionData.errors.find(
          (err) => err.field === "general"
        );
        if (generalError) {
          toast.error(generalError.message);
        }
        // Show toast for validation errors (first one)
        else if (actionData.errors.length > 0) {
          toast.error(actionData.errors[0].message);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  // Get errors for specific fields
  const getFieldError = (fieldName) => {
    if (!actionData?.errors) return null;
    const error = actionData.errors.find((err) => err.field === fieldName);
    return error?.message || null;
  };

  return (
    <>
      <div className="border  rounded-md-lg p-4 mx-auto max-w-[70%] w-full border-gray-300 shadow-[2px_2px_30px_gray] border-t-4 border-t-[#2EB0BC] rounded-xl  mt-[10%] mb-12">
        <div className="mx-auto mb-4 w-32">
          <Logo />
        </div>
        <h4 className="text-xl mb-4 text-center text-stone-600">Register</h4>

        {/* Display general errors */}
        {actionData?.errors &&
          actionData.errors.some((err) => err.field === "general") && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {
                actionData.errors.find((err) => err.field === "general")
                  ?.message
              }
            </div>
          )}

        <Form action="" method="post">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-12 ">
            <div>
              <Input
                label={"Name"}
                placeholder={" Enter Name"}
                type={"text"}
                name={"firstName"}
                error={getFieldError("firstName")}
              />
              <Input
                label={"Last Name"}
                placeholder={" Enter Last Name"}
                type={"text"}
                name={"lastName"}
                error={getFieldError("lastName")}
              />
              <Input
                label={"Location"}
                placeholder={" Enter Location"}
                type={"text"}
                name={"location"}
                error={getFieldError("location")}
              />
            </div>
            <div>
              <Input
                label={"Email"}
                placeholder={" Enter Email"}
                type={"email"}
                name={"email"}
                error={getFieldError("email")}
              />
              <Input
                label={"Password"}
                placeholder={" Enter Password"}
                type={"password"}
                name={"password"}
                error={getFieldError("password")}
              />
              <Input
                label={"Confirm Password"}
                placeholder={" Enter Confirm Password"}
                type={"password"}
                name={"confirmPassword"}
                error={getFieldError("confirmPassword")}
              />
            </div>
          </div>
          {/* <button className="bg-[#2EB0BC] px-2 py-1 w-full  mx-auto rounded-md hover:bg-teal-300 mb-2 text-stone-50 md:w-[60%] md:ml-[20%]" type="submit">submit</button> */}
          <Button btnName={"Submit"} isSubmitting={isSubmitting} />
          <p className="text-center mb-4 text-sm">
            Already registered?
            <Link to="/login">
              <span className="text-[#2EB0BC] text-center ml-2"> Login </span>
            </Link>
          </p>
        </Form>
      </div>
    </>
  );
}
