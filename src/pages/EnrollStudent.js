import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Alert, Button, Card, Field, FormActions, Select } from "../components/ui";

function EnrollStudent() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudentsAndCourses = async () => {
      try {
        const studentsRes = await axios.get(`${API_URL}/api/admin/students`, {
          withCredentials: true,
        });
        const coursesRes = await axios.get(`${API_URL}/api/admin/courses`, {
          withCredentials: true,
        });

        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudentsAndCourses();
  }, []);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) {
      setMessage({ type: "error", text: "Please select a student and a course." });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/admin/courses/${selectedCourse}/enroll/${selectedStudent}`,
        {},
        { withCredentials: true }
      );

      setMessage({ type: "success", text: res.data.message });
      setTimeout(() => navigate("/admin"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to enroll student" });
    }
    setLoading(false);
  };

  return (
    <PortalPage
      title="Enroll Student"
      description="Add a registered student to a course."
      width="narrow"
    >
      <Card>
        <form onSubmit={handleEnroll} className="space-y-5">
          {message && <Alert tone={message.type === "success" ? "success" : "error"}>{message.text}</Alert>}

          <Field label="Select Student">
            <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} required>
              <option value="">-- Choose Student --</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Select Course">
            <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
              <option value="">-- Choose Course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </Select>
          </Field>

          <FormActions>
            <Button variant="secondary" to="/admin">
              Cancel
            </Button>
            <Button type="submit" loading={loading} loadingLabel="Enrolling...">
              Enroll Student
            </Button>
          </FormActions>
        </form>
      </Card>
    </PortalPage>
  );
}

export default EnrollStudent;
