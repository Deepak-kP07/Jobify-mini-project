import Input from "../components/Input";
import { Form, useNavigation, useOutletContext } from "react-router-dom";
import Button from "../components/Button";

export default function Profile() {
  const { user } = useOutletContext();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Safety check - user might be null
  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile</h2>
        <Form method="post" encType="multipart/form-data">
          <div className="space-y-4">
            <Input
              label="Avatar"
              type="file"
              name="avatar"
              placeholder="Select an image (less than 0.5 MB)"
              accept="image/*"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                placeholder="Enter First Name"
                defaultValue={user?.firstName || ""}
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Enter Last Name"
                defaultValue={user?.lastName || ""}
              />
            </div>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Enter Email"
              defaultValue={user?.email || ""}
            />
            <Input
              label="Location"
              type="text"
              name="location"
              placeholder="Enter Location"
              defaultValue={user?.location || ""}
            />
            <Button
              type="submit"
              btnName={isSubmitting ? "Submitting..." : "Update Profile"}
              isSubmitting={isSubmitting}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
