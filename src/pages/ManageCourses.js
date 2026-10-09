import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BookOpenIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Button, Card, EmptyState, ErrorState, LoadingState, Pagination, Table, Td, Th, Tr } from "../components/ui";

function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/courses`, {
          withCredentials: true,
        });
        setCourses(res.data);
      } catch (err) {
        setError("Failed to fetch courses.");
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/courses/${courseId}`, {
        withCredentials: true,
      });
      const remaining = courses.filter((course) => course._id !== courseId);
      setCourses(remaining);
      setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(remaining.length / coursesPerPage))));
    } catch (err) {
      console.error("Error deleting course:", err);
      setError("Failed to delete course.");
    }
  };

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
    <PortalPage
      title="Manage Courses"
      description="Update course details or remove courses that are no longer offered."
      width="wide"
      actions={
        <Button to="/admin/create-course" icon={PlusIcon}>
          Create course
        </Button>
      }
    >
      {loading ? (
        <LoadingState label="Loading courses..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : courses.length > 0 ? (
        <>
          <Table caption="Courses">
            <thead>
              <tr>
                <Th>Course</Th>
                <Th>Instructor</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course) => (
                <Tr key={course._id}>
                  <Td className="min-w-[16rem]">
                    <p className="font-medium text-ink">{course.title}</p>
                    <p className="mt-0.5 line-clamp-2 max-w-xl text-ink-secondary">{course.description}</p>
                  </Td>
                  <Td className="whitespace-nowrap text-ink-secondary">
                    {course.instructor ? course.instructor.name || "N/A" : "Not assigned"}
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={PencilSquareIcon}
                        onClick={() => navigate(`/admin/update-course/${course._id}`)}
                      >
                        Update
                      </Button>
                      <Button variant="dangerQuiet" size="sm" icon={TrashIcon} onClick={() => handleDelete(course._id)}>
                        Delete
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-secondary">
              Showing {indexOfFirstCourse + 1}–{Math.min(indexOfLastCourse, courses.length)} of {courses.length} course
              {courses.length === 1 ? "" : "s"}
            </p>
            <Pagination
              page={currentPage}
              pageCount={Math.ceil(courses.length / coursesPerPage)}
              onChange={setCurrentPage}
              label="Course pages"
            />
          </div>
        </>
      ) : (
        <Card>
          <EmptyState
            icon={BookOpenIcon}
            title="No courses available."
            hint="Create a course to start enrolling students."
            to="/admin/create-course"
            cta="Create a course"
          />
        </Card>
      )}
    </PortalPage>
  );
}

export default ManageCourses;
