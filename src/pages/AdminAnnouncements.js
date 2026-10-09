import React, { useState, useEffect } from "react";
import axios from "axios";
import { MegaphoneIcon, TrashIcon } from "@heroicons/react/24/outline";
import { API_URL } from "../config";
import { PortalPage } from "../components/PortalLayout";
import { Alert, Button, EmptyState, Field, Input, SectionCard, Textarea } from "../components/ui";

function AdminAnnouncements() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/announcements`, { withCredentials: true });
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/admin/announcements`,
        { title, content, dueDate },
        { withCredentials: true }
      );

      setMessage({ type: "success", text: res.data.message });
      setTitle("");
      setContent("");
      setDueDate("");
      fetchAnnouncements();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create announcement" });
    }

    setLoading(false);
  };

  const handleDelete = async (announcementId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/announcements/${announcementId}`, { withCredentials: true });
      setAnnouncements(announcements.filter((ann) => ann._id !== announcementId));
    } catch (error) {
      console.error("Error deleting announcement", error);
    }
  };

  return (
    <PortalPage
      title="Announcements"
      description="Post announcements for students and remove ones that no longer apply."
      width="wide"
    >
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <SectionCard title="Create Announcement" className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {message && <Alert tone={message.type === "success" ? "success" : "error"}>{message.text}</Alert>}

            <Field label="Title">
              <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Field>

            <Field label="Content">
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} required />
            </Field>

            <Field label="Due Date" hint="The announcement expires on this date.">
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </Field>

            <Button type="submit" className="w-full" loading={loading} loadingLabel="Creating...">
              Create Announcement
            </Button>
          </form>
        </SectionCard>

        <SectionCard
          title="All Announcements"
          description={`${announcements.length} active`}
          className="lg:col-span-3"
        >
          {announcements.length > 0 ? (
            <ul className="-my-4 divide-y divide-line">
              {announcements.map((announcement) => (
                <li key={announcement._id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink">{announcement.title}</h3>
                    <p className="mt-1 break-words text-sm leading-6 text-ink-secondary">{announcement.content}</p>
                    <p className="mt-1.5 text-xs text-ink-secondary">
                      Expires on: {new Date(announcement.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="dangerQuiet"
                    size="icon"
                    className="shrink-0"
                    onClick={() => handleDelete(announcement._id)}
                    aria-label={`Delete announcement: ${announcement.title}`}
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={MegaphoneIcon}
              title="No active announcements."
              hint="Announcements you create are shown to students until they expire."
            />
          )}
        </SectionCard>
      </div>
    </PortalPage>
  );
}

export default AdminAnnouncements;
