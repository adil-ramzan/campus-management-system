import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AcademicCapIcon, PencilSquareIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Button, Card, EmptyState, SearchInput, Select, Table, Td, Th, Tr } from "../components/ui";

const notSet = <span className="text-ink-secondary">Not set</span>;

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/students`, { withCredentials: true });

        setStudents(res.data);
        setFilteredStudents(res.data);
      } catch (error) {
        console.error("Error fetching students", error);
      }
    };

    fetchStudents();
  }, []);


  useEffect(() => {
    let filtered = students.filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
    );

    filtered = filtered.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    setFilteredStudents(filtered);
  }, [search, sortBy, students]);

  return (
    <PortalPage
      title="Students"
      description="Search registered students and edit their accounts."
      width="wide"
      actions={
        <Button to="/admin/create-user?role=student" icon={UserPlusIcon}>
          Add student
        </Button>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:max-w-sm sm:flex-1">
          <SearchInput
            label="Search students"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          aria-label="Sort students"
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
          className="sm:w-44"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </Select>
        <p className="text-sm text-ink-secondary sm:ml-auto">
          {filteredStudents.length} student{filteredStudents.length === 1 ? "" : "s"}
        </p>
      </div>

      {filteredStudents.length > 0 ? (
        <Table caption="Students">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Course</Th>
              <Th>Session</Th>
              <Th>Semester</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <Tr key={student._id}>
                <Td className="whitespace-nowrap font-medium">{student.name}</Td>
                <Td className="text-ink-secondary">{student.email}</Td>
                <Td className="whitespace-nowrap">{student.course || notSet}</Td>
                <Td className="whitespace-nowrap">{student.session || notSet}</Td>
                <Td className="whitespace-nowrap">{student.semester || notSet}</Td>
                <Td className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={PencilSquareIcon}
                    onClick={() => navigate(`/admin/edit-student/${student._id}`)}
                  >
                    Edit
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card>
          <EmptyState
            icon={AcademicCapIcon}
            title="No students found."
            hint={search ? "Try a different name or email." : "Students appear here once they are registered."}
          />
        </Card>
      )}
    </PortalPage>
  );
}

export default StudentList;
