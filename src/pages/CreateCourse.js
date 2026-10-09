import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Alert, Button, Card, Field, FormActions, Input, Select, Textarea } from "../components/ui";

function CreateCourse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    startDate: "",
    creditHours: "",
  });
  const [message, setMessage] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/instructors`, {
          withCredentials: true,
        });
        setInstructors(res.data);
      } catch (error) {
        console.error("Failed to fetch instructors", error);
      }
    };
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.title || !formData.description || !formData.instructor || !formData.startDate || !formData.creditHours) {
      setMessage({ type: "error", text: "All fields, including Credit Hours, are required." });
      setLoading(false);
      return;
    }

    const validCreditHours = ["3", "4"];
    if (!validCreditHours.includes(formData.creditHours)) {
      setMessage({ type: "error", text: "Invalid Credit Hours selected." });
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/admin/courses`, formData, {
        withCredentials: true,
      });

      setMessage({ type: "success", text: res.data.message });
      setTimeout(() => navigate("/admin"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to create course" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalPage
      title="Create Course"
      description="Set up a new course and assign its instructor."
      width="narrow"
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {message && <Alert tone={message.type === "success" ? "success" : "error"}>{message.text}</Alert>}

          <Field label="Title">
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter course title"
            />
          </Field>

          <Field label="Description">
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter course description"
            />
          </Field>

          <Field label="Instructor">
            <Select name="instructor" value={formData.instructor} onChange={handleChange} required>
              <option value="">Select an instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Start Date">
              <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            </Field>

            <Field label="Credit Hours">
              <Select name="creditHours" value={formData.creditHours} onChange={handleChange} required>
                <option value="">Select credit hours</option>
                <option value="3">3 Hours</option>
                <option value="4">4 Hours</option>
              </Select>
            </Field>
          </div>

          <FormActions>
            <Button variant="secondary" to="/admin/manage-courses">
              Cancel
            </Button>
            <Button type="submit" loading={loading} loadingLabel="Creating...">
              Create Course
            </Button>
          </FormActions>
        </form>
      </Card>
    </PortalPage>
  );
}

export default CreateCourse;
