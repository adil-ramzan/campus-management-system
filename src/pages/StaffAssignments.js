import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Alert, Button, EmptyState, Field, FormActions, Input, LoadingState, SectionCard, Select, Textarea } from "../components/ui";

function StaffAssignments() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/dashboard`, {
          withCredentials: true,
        });
        setCourses(res.data);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load courses." });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/api/assignments/create`,
        formData,
        { withCredentials: true }
      );
      setAssignments([...assignments, res.data.assignment]);
      setMessage({ type: "success", text: "Assignment Created Successfully!" });
      setTimeout(() => navigate("/staff"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: "Error creating assignment." });
    }
  };

  return (
    <PortalPage
      title="Assignments"
      description="Create assignments for the courses you teach."
      width="wide"
    >
      {loading ? (
        <LoadingState label="Loading assignments..." />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-5">
          <SectionCard title="Create New Assignment" className="lg:col-span-3">
            <form onSubmit={createAssignment} className="space-y-5">
              {message && <Alert tone={message.type === "success" ? "success" : "error"}>{message.text}</Alert>}

              <Field label="Course">
                <Select name="courseId" value={formData.courseId} onChange={handleInputChange} required>
                  <option value="">Select a Course</option>
                  {courses.map((course) => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseTitle}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Title">
                <Input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </Field>

              <Field label="Description">
                <Textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </Field>

              <Field label="Due Date">
                <Input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required />
              </Field>

              <FormActions>
                <Button variant="secondary" to="/staff">
                  Cancel
                </Button>
                <Button type="submit">Create Assignment</Button>
              </FormActions>
            </form>
          </SectionCard>

          <SectionCard title="Existing Assignments" description="Created in this session" className="lg:col-span-2">
            {assignments.length > 0 ? (
              <ul className="-my-4 divide-y divide-line">
                {assignments.map((assignment) => (
                  <li key={assignment._id} className="py-4">
                    <h3 className="text-sm font-semibold text-ink">{assignment.title}</h3>
                    <p className="mt-1 break-words text-sm leading-6 text-ink-secondary">{assignment.description}</p>
                    <p className="mt-1.5 text-xs text-ink-secondary">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={DocumentPlusIcon} title="No assignments yet." hint="Assignments you create appear here." />
            )}
          </SectionCard>
        </div>
      )}
    </PortalPage>
  );
}

export default StaffAssignments;
