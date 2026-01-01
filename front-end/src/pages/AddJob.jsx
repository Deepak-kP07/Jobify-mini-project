import {
  Form,
  useNavigation,
  useActionData,
  useNavigate,
} from "react-router-dom";
import Input from "../components/Input";
import { JOB_TYPE, JOB_STATUS } from "../../../utils/constants";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function AddJob() {
  const navigation = useNavigation();
  const actionData = useActionData();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";

  // Show toast notifications and handle redirect
  useEffect(() => {
    if (actionData?.success) {
      toast.success("Job added successfully!");
      // Redirect after showing toast
      const timer = setTimeout(() => {
        navigate(actionData.redirect || "/dashboard/all-jobs");
      }, 1500);
      return () => clearTimeout(timer);
    } else if (actionData?.error) {
      // Small delay to ensure ToastContainer is ready
      const timer = setTimeout(() => {
        toast.error(actionData.error);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [actionData, navigate]);
  return (
    <>
      <div className="max-w-4xl mx-auto border p-4  shadow-[2px_2px_30px_gray] border-t-4 border-t-[#2EB0BC] rounded-xl mt-[8%] mb-10">
        <h3 className="text-2xl font-bold  mb-4 text-stone-500">Add Jobs</h3>
        <Form method="post">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 ">
            <Input
              label={"Position"}
              name={"position"}
              placeholder={"Enter Position"}
              type={"text"}
              // error={getFieldError("position")}
              defaultValue={""}
            />

            <Input
              label={"Company"}
              name={"company"}
              placeholder={"Enter Company Name"}
              type={"text"}
              // error={getFieldError("company")}
              defaultValue={""}
            />

            <Input
              label={"Job Location"}
              name={"jobLocation"}
              placeholder={"Enter Job Location"}
              type={"text"}
              // error={getFieldError("jobLocation")}
              defaultValue={""}
            />

            <Input
              label={"Job Status"}
              name={"jobStatus"}
              placeholder={"Select Job Status"}
              type="dropdown"
              list={Object.values(JOB_STATUS)}
              // error={getFieldError("jobStatus")}
              defaultValue={JOB_STATUS.PENDING}
            />
            <Input
              label={"Job Type"}
              name={"jobType"}
              placeholder={"Select Job Type"}
              type="dropdown"
              list={Object.values(JOB_TYPE)}
              // error={getFieldError("jobType")}
              defaultValue={JOB_TYPE.FULL_TIME}
            />
          </div>

          <Button
            type="submit"
            btnName={isSubmitting ? "Submitting..." : "Submit"}
            isSubmitting={isSubmitting}
          />
        </Form>
      </div>
    </>
  );
}
