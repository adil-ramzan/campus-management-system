import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StaffAssignments from "./pages/StaffAssignments";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentAssignments from "./pages/StudentAssignments";
import GradeAssignments from "./pages/GradeAssignments";
import ViewStudents from "./pages/ViewStudents";
import CreateCourse from "./pages/CreateCourse";
import EnrollStudent from "./pages/EnrollStudent";
import ManageCourses from "./pages/ManageCourses";
import InstructorList from "./pages/InstructorList";
import StudentList from "./pages/StudentList";
import UpdateCourse from "./pages/UpdateCourse";
import CourseDetails from "./pages/CourseDetails";
import StaffAttendance from "./pages/StaffAttendance";
import ViewAttendance from "./pages/ViewAttendance";
import SubmittedAssignments from "./pages/SubmittedAssignments";
import ViewSubmissions from "./pages/ViewSubmissions";
import StudentAttendance from "./pages/StudentAttendance";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import CreateUser from "./pages/CreateUser";
import EditStudent from "./pages/EditStudents";
import EditStaff from "./pages/EditStaff";
import Academics from "./pages/Academics";
import Administration from "./pages/Administration";
import Admissions from "./pages/Admissions";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollManager />
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/admin"
              element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/staff"
              element={<ProtectedRoute allowedRoles={["staff"]}><StaffDashboard /></ProtectedRoute>}
            />
            <Route
              path="/staff/assignments"
              element={<ProtectedRoute allowedRoles={["staff"]}><StaffAssignments /></ProtectedRoute>}
            />
            <Route
              path="/student"
              element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>}
            />
            <Route
              path="/student/assignments/:assignmentId/submit"
              element={<ProtectedRoute allowedRoles={["student"]}><StudentAssignments /></ProtectedRoute>}
            />
            <Route
              path="/staff/assignments/:assignmentId/grade"
              element={<ProtectedRoute allowedRoles={["staff"]}><GradeAssignments /></ProtectedRoute>}
            />
            <Route
              path="/staff/courses/:courseId/students"
              element={<ViewStudents />}
            />
            <Route
              path="/admin/create-course"
              element={<CreateCourse />}
            />
            <Route
              path="/admin/enroll-student"
              element={<EnrollStudent />}
            />
            <Route
              path="/admin/manage-courses"
              element={<ManageCourses />}
            />
            <Route
              path="/admin/instructors"
              element={<InstructorList />}
            />
            <Route
              path="/admin/students"
              element={<StudentList />}
            />
            <Route
              path="/admin/update-course/:courseId"
              element={<UpdateCourse />}
            />
            <Route
              path="/staff/course/:courseId/details"
              element={<CourseDetails />}
            />
            <Route
              path="/staff/courses/:courseId/attendance"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                <StaffAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/courses/:courseId/view-attendance"
              element={<ViewAttendance />}
            />
            <Route
              path="/staff/submitted-assignments"
              element={
                <ProtectedRoute allowedRoles={["staff"]}>
                <SubmittedAssignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/assignments/:assignmentId/submissions"
              element={<ViewSubmissions />}
            />
            <Route
              path="/student/courses/:courseId/attendance"
              element={<StudentAttendance />}
            />
            <Route
              path="/admin/announcements"
              element={<AdminAnnouncements />}
            />
            <Route
              path="/contact"
              element={<ContactUs />}
            />
            <Route
              path="/about"
              element={<AboutUs />}
            />
            <Route
              path="/admin/create-user"
              element={<ProtectedRoute allowedRoles={["admin"]}><CreateUser /></ProtectedRoute>}
            />
            <Route
              path="/admin/edit-student/:studentId"
              element={<ProtectedRoute allowedRoles={["admin"]}><EditStudent /></ProtectedRoute>}
            />
            <Route
              path="/admin/edit-staff/:staffId"
              element={<ProtectedRoute allowedRoles={["admin"]}><EditStaff /></ProtectedRoute>}
            />
            <Route
              path="/academics"
              element={<Academics />}
            />
            <Route
              path="/administration"
              element={<Administration />}
            />
            <Route
              path="/admissions"
              element={<Admissions />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
