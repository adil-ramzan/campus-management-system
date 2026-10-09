import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Alert, Button, Card, Field, FormActions, Input, Select, Textarea } from "../components/ui";

function UpdateCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", description: "", instructor: "" });
  const [instructors, setInstructors] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/courses`);
        const course = res.data.find((c) => c._id === courseId);
        if (course) {
          setFormData({
            title: course.title,
            description: course.description,
            instructor: course.instructor ? course.instructor._id : "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch course details", error);
      }
    };

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

    fetchCourseDetails();
    fetchInstructors();
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/admin/courses/${courseId}`, formData, {
        withCredentials: true,
      });
      setMessage({ type: "success", text: res.data.message });
      setTimeout(() => navigate("/admin/manage-courses"), 1000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update course",
      });
    }
  };

  return (
    <PortalPage
      title="Update Course"
      description="Edit the course details or change its instructor."
      back={{ label: "Manage Courses", to: "/admin/manage-courses" }}
      width="narrow"
    >
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {message && <Alert tone={message.type === "success" ? "success" : "error"}>{message.text}</Alert>}

          <Field label="Title">
            <Input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </Field>

          <Field label="Description">
            <Textarea name="description" value={formData.description} onChange={handleChange} required />
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

          <FormActions>
            <Button variant="secondary" to="/admin/manage-courses">
              Cancel
            </Button>
            <Button type="submit">Update Course</Button>
          </FormActions>
        </form>
      </Card>
    </PortalPage>
  );
}

export default UpdateCourse;
