import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LockClosedIcon, TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Button, Card, Field, FormActions, IconInput } from "../components/ui";

const EditStudent = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/students/${studentId}`, { withCredentials: true });
        setFormData({ name: res.data.name });
      } catch (error) {
        console.error("Error fetching student", error);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/api/admin/students/${studentId}`, formData, { withCredentials: true });
      alert("Student updated successfully!");
      navigate("/admin/students");
    } catch (error) {
      console.error("Error updating student", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone!")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/students/${studentId}`, { withCredentials: true });
      alert("Student deleted successfully!");
      navigate("/admin/students");
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  return (
    <PortalPage
      title="Edit Student"
      description="Change the account name or set a new password."
      back={{ label: "Students", to: "/admin/students" }}
      width="narrow"
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Student name">
            <IconInput icon={UserIcon} type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Field>

          <Field label="Current password" hint="Passwords are stored securely and cannot be shown.">
            <IconInput icon={LockClosedIcon} type="text" value="**********" disabled />
          </Field>

          <Field label="New password" hint="Leave blank to keep the current password.">
            <IconInput
              icon={LockClosedIcon}
              type="password"
              name="newPassword"
              autoComplete="new-password"
              value={formData.newPassword || ""}
              onChange={handleChange}
              placeholder="Enter new password (optional)"
            />
          </Field>

          <FormActions className="sm:justify-between">
            <Button variant="dangerQuiet" icon={TrashIcon} onClick={handleDelete}>
              Delete student
            </Button>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button variant="secondary" to="/admin/students">
                Cancel
              </Button>
              <Button type="submit">Update student</Button>
            </div>
          </FormActions>
        </form>
      </Card>
    </PortalPage>
  );
};

export default EditStudent;
