import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PencilSquareIcon, TrashIcon, UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Button, Card, EmptyState, SearchInput, Select, Table, Td, Th, Tr } from "../components/ui";

function InstructorList() {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/instructors`, {
          withCredentials: true,
        });
        setInstructors(res.data);
        setFilteredInstructors(res.data);
      } catch (error) {
        console.error("Error fetching instructors", error);
      }
    };

    fetchInstructors();
  }, []);

  useEffect(() => {
    let filtered = instructors.filter((inst) =>
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.email.toLowerCase().includes(search.toLowerCase())
    );

    filtered = filtered.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
    setFilteredInstructors(filtered);
  }, [search, sortBy, instructors]);

  const handleDelete = async (staffId) => {
    if (!window.confirm("Are you sure you want to delete this staff member? This action cannot be undone!")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/staff/${staffId}`, { withCredentials: true });
      alert("Staff member deleted successfully!");
      setInstructors(instructors.filter(inst => inst._id !== staffId));
    } catch (error) {
      console.error("Error deleting staff", error);
    }
  };

  return (
    <PortalPage
      title="Instructors"
      description="Search teaching staff, edit their accounts or remove them."
      width="wide"
      actions={
        <Button to="/admin/create-user?role=staff" icon={UserPlusIcon}>
          Add staff
        </Button>
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:max-w-sm sm:flex-1">
          <SearchInput
            label="Search instructors"
            placeholder="Search instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          aria-label="Sort instructors"
          onChange={(e) => setSortBy(e.target.value)}
          value={sortBy}
          className="sm:w-44"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </Select>
        <p className="text-sm text-ink-secondary sm:ml-auto">
          {filteredInstructors.length} instructor{filteredInstructors.length === 1 ? "" : "s"}
        </p>
      </div>

      {filteredInstructors.length > 0 ? (
        <Table caption="Instructors">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map((inst) => (
              <Tr key={inst._id}>
                <Td className="whitespace-nowrap font-medium">{inst.name}</Td>
                <Td className="text-ink-secondary">{inst.email}</Td>
                <Td>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={PencilSquareIcon}
                      onClick={() => navigate(`/admin/edit-staff/${inst._id}`)}
                    >
                      Edit
                    </Button>
                    <Button variant="dangerQuiet" size="sm" icon={TrashIcon} onClick={() => handleDelete(inst._id)}>
                      Delete
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card>
          <EmptyState
            icon={UserGroupIcon}
            title="No instructors found."
            hint={search ? "Try a different name or email." : "Staff accounts appear here once they are created."}
          />
        </Card>
      )}
    </PortalPage>
  );
}

export default InstructorList;
