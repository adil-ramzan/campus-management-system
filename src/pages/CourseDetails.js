import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipboardDocumentCheckIcon, DocumentTextIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState, SectionCard } from "../components/ui";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/course/${courseId}`, {
          withCredentials: true,
        });
        setCourse(res.data);
      } catch (err) {
        setError("Failed to fetch course details.");
      }
      setLoading(false);
    };

    fetchCourseDetails();
  }, [courseId]);

  return (
    <PortalPage
      title={course?.title || "Course Details"}
      description={course?.description}
      back={{ label: "Dashboard", to: "/staff" }}
      actions={
        course && (
          <Button variant="secondary" to={`/staff/courses/${courseId}/attendance`} icon={ClipboardDocumentCheckIcon}>
            Attendance
          </Button>
        )
      }
    >
      {loading ? (
        <LoadingState label="Loading course details..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <Card className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-medium text-ink-secondary">Instructor</h2>
              <p className="truncate text-base font-semibold text-ink">{course.instructor?.name || "Not Assigned"}</p>
            </div>
          </Card>

          <SectionCard title="Enrolled Students" description={`${course.studentsEnrolled.length} enrolled`}>
            {course.studentsEnrolled.length > 0 ? (
              <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {course.studentsEnrolled
                  .filter((entry) => entry.student)
                  .map((student) => (
                    <li key={student.student._id} className="min-w-0 rounded-lg border border-line px-4 py-3">
                      <span className="block truncate text-sm font-medium text-ink">{student.student.name}</span>
                      <span className="block truncate text-sm text-ink-secondary">{student.student.email}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <EmptyState icon={UserGroupIcon} title="No students enrolled." />
            )}
          </SectionCard>

          <SectionCard title="Assignments" description={`${course.assignments.length} in this course`}>
            {course.assignments.length > 0 ? (
              <ul className="-my-4 divide-y divide-line">
                {course.assignments.map((assignment) => {
                  const ungradedSubmissions = assignment.submissions.length - assignment.submissions.filter((sub) => sub.grade).length;
                  return (
                    <li key={assignment._id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{assignment.title}</p>
                        <p className="text-sm text-ink-secondary">
                          {assignment.submissions.length} submission{assignment.submissions.length === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <Badge tone={ungradedSubmissions > 0 ? "warning" : "success"}>
                          {ungradedSubmissions > 0 ? `Ungraded: ${ungradedSubmissions}` : "All Graded"}
                        </Badge>

                        {assignment.submissions.length > 0 && (
                          <Button size="sm" onClick={() => navigate(`/staff/assignments/${assignment._id}/grade`)}>
                            Grade
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState icon={DocumentTextIcon} title="No assignments yet." />
            )}
          </SectionCard>
        </>
      )}
    </PortalPage>
  );
}

export default CourseDetails;
