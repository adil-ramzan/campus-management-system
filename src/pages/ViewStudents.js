import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Card, EmptyState, ErrorState, LoadingState, SearchInput, Table, Td, Th, Tr } from "../components/ui";

function ViewStudents() {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/staff/${courseId}/students`, {
          withCredentials: true,
        });
        setStudents(res.data.enrolledStudents);
        setFilteredStudents(res.data.enrolledStudents);
      } catch (err) {
        setError("Failed to load students.");
      }
      setLoading(false);
    };

    fetchStudents();
  }, [courseId]);

  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  return (
    <PortalPage
      title="Enrolled Students"
      description="Students enrolled in this course."
      back={{ label: "Dashboard", to: "/staff" }}
    >
      {loading ? (
        <LoadingState label="Loading students..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="sm:w-80">
              <SearchInput
                label="Search students"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="text-sm text-ink-secondary">
              {filteredStudents.length} student{filteredStudents.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredStudents.length > 0 ? (
            <Table caption="Enrolled students">
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <Tr key={student.studentId}>
                    <Td className="whitespace-nowrap font-medium">{student.name}</Td>
                    <Td className="text-ink-secondary">{student.email}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Card>
              <EmptyState icon={UserGroupIcon} title="No students enrolled." />
            </Card>
          )}
        </>
      )}
    </PortalPage>
  );
}

export default ViewStudents;
