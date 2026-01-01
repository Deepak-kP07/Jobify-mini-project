import {
  Form,
  useLoaderData,
  useNavigation,
  useActionData,
  useNavigate,
} from "react-router-dom";
import Input from "../components/Input";
import { JOB_STATUS } from "../../../utils/constants";
import { JOB_TYPE } from "../../../utils/constants";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function EditJob() {
  const { job } = useLoaderData(); // we have job ActionLoader from that we getting this 
  const actionData = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Show toast notifications and handle redirect
  useEffect(() => {
    if (actionData?.success) {
      toast.success("Job updated successfully!");
      const timer = setTimeout(() => {
        navigate(actionData.redirect || "/dashboard/all-jobs");
      }, 1500);
      return () => clearTimeout(timer);
    } else if (actionData?.error) {
      const timer = setTimeout(() => {
        toast.error(actionData.error);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [actionData, navigate]);
  return (
    <>
      <div className="max-w-4xl mx-auto border p-4  shadow-[2px_2px_30px_gray] border-t-4 border-t-[#2EB0BC] rounded-xl mt-[8%] mb-10">
        <h3 className="text-2xl font-bold  mb-4 text-stone-500">Edit Jobs</h3>
        <Form method="post">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 ">
            <Input
              label={"Position"}
              name={"position"}
              placeholder={"Enter Position"}
              type={"text"}
              // error={getFieldError("position")}
              defaultValue={job?.position || ""}
            />

            <Input
              label={"Company"}
              name={"company"}
              placeholder={"Enter Company Name"}
              type={"text"}
              defaultValue={job?.company || ""}
            />

            <Input
              label={"Job Location"}
              name={"jobLocation"}
              placeholder={"Enter Job Location"}
              type={"text"}
              defaultValue={job?.jobLocation || ""}
            />

            <Input
              label={"Job Status"}
              name={"jobStatus"}
              placeholder={"Select Job Status"}
              type="dropdown"
              defaultValue={job?.jobStatus || JOB_STATUS.PENDING}
              list={Object.values(JOB_STATUS)}
            />
            <Input
              label={"Job Type"}
              name={"jobType"}
              placeholder={"Select Job Type"}
              type="dropdown"
              list={Object.values(JOB_TYPE)}
              defaultValue={job?.jobType || JOB_TYPE.FULL_TIME}
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
