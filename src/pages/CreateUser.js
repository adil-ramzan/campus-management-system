import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Alert, Button, Card, Field, FormActions, Input, Select } from "../components/ui";

const ROLES = ["admin", "staff", "student"];

const CreateUser = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // A link may preselect the role, for example /admin/create-user?role=staff.
  const requestedRole = searchParams.get("role");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ROLES.includes(requestedRole) ? requestedRole : "student",
    course: "",
    session: "",
    semester: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === "session") {
      let semester = "";
      if (value === "21-25") semester = "8th";
      else if (value === "22-26") semester = "6th";
      else if (value === "23-27") semester = "4th";
      else if (value === "24-28") semester = "2nd";

      updatedFormData = { ...updatedFormData, semester };
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.role === "student" && formData.session === "20-24") {
      setError("Cannot create students for session 20-24.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/create-user`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      setSuccess("User created successfully!");
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalPage
      title="Create User"
      description="Add an administrator, staff member or student account."
      width="narrow"
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <Alert tone="error">{error}</Alert>}
          {success && <Alert tone="success">{success}</Alert>}

          <div role="group" aria-labelledby="account-details" className="space-y-5">
            <h2 id="account-details" className="text-base font-semibold text-ink">
              Account details
            </h2>
            <Field label="Name">
              <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Field>

            <Field label="Email">
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Role">
              <Select name="role" value={formData.role} onChange={handleChange} required>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="student">Student</option>
              </Select>
            </Field>
          </div>

          {formData.role === "student" && (
            <div role="group" aria-labelledby="academic-details" className="space-y-5 border-t border-line pt-6">
              <h2 id="academic-details" className="text-base font-semibold text-ink">
                Academic details
              </h2>
              <Field label="Course">
                <Select name="course" value={formData.course} onChange={handleChange} required>
                  <option value="">Select Course</option>
                  <option value="BSSE">BS Software Engineering</option>
                  <option value="BSCS">BS Computer Science</option>
                </Select>
              </Field>

              <Field label="Session">
                <Select name="session" value={formData.session} onChange={handleChange} required>
                  <option value="">Select Session</option>
                  <option value="20-24">2020-2024</option>
                  <option value="21-25">2021-2025</option>
                  <option value="22-26">2022-2026</option>
                  <option value="23-27">2023-2027</option>
                  <option value="24-28">2024-2028</option>
                </Select>
              </Field>

              {formData.session && formData.session !== "20-24" && (
                <Field label="Semester">
                  <Select name="semester" value={formData.semester} onChange={handleChange} required>
                    <option value="">{`Select Semester (${formData.semester})`}</option>
                    {formData.session === "21-25" && <option value="8th">8th Semester</option>}
                    {formData.session === "22-26" && <option value="6th">6th Semester</option>}
                    {formData.session === "23-27" && <option value="4th">4th Semester</option>}
                    {formData.session === "24-28" && <option value="2nd">2nd Semester</option>}
                  </Select>
                </Field>
              )}
            </div>
          )}

          <FormActions>
            <Button variant="secondary" to="/admin">
              Cancel
            </Button>
            <Button type="submit" loading={loading} loadingLabel="Creating...">
              Create User
            </Button>
          </FormActions>
        </form>
      </Card>
    </PortalPage>
  );
};

export default CreateUser;
