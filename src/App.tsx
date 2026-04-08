import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login.tsx';
import StudentDashboard from './pages/StudentDashboard.tsx';
import FacultyDashboard from './pages/FacultyDashboard.tsx';
import AiChatbot from './pages/AiChatbot.tsx';
import Announcements from './pages/Announcements.tsx';
import Requests from './pages/Requests.tsx';
import ManageTeachers from './pages/ManageTeachers.tsx';
import ManageStudents from './pages/ManageStudents.tsx';
import ManagePasswords from './pages/ManagePasswords.tsx';
import AttendanceManagement from './pages/AttendanceManagement.tsx';
import AssignmentManagement from './pages/AssignmentManagement.tsx';
import StudentRoster from './pages/StudentRoster.tsx';
import AcademicMaterials from './pages/AcademicMaterials.tsx';
import Reports from './pages/Reports.tsx';
import EventCalendar from './pages/EventCalendar.tsx';

function App() {
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setRole={setRole} setUserName={setUserName} setUserEmail={setUserEmail} />} />

        {/* Protected Routes wrapped in Layout */}
        <Route path="/" element={<Layout role={role} setRole={setRole} userName={userName} userEmail={userEmail} />}>
          <Route index element={<Navigate to={role?.startsWith('faculty') ? "/faculty" : "/student"} replace />} />
          <Route path="student" element={<StudentDashboard userName={userName} userEmail={userEmail} />} />
          <Route path="faculty" element={<FacultyDashboard userName={userName} role={role ?? ''} />} />
          <Route path="announcements" element={<Announcements role={role ?? ''} />} />
          <Route path="requests" element={<Requests userName={userName} userEmail={userEmail} role={role ?? ''} />} />
          <Route path="ai-chat" element={<AiChatbot />} />
          
          {/* Academic Portal */}
          <Route path="materials" element={<AcademicMaterials />} />
          
          {/* Admin Pages */}
          <Route path="manage-teachers" element={<ManageTeachers />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-passwords" element={<ManagePasswords />} />
          <Route path="reports" element={<Reports />} />
          
          {/* Teacher Pages */}
          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="faculty-materials" element={<AssignmentManagement userName={userName} />} />
          <Route path="student-directory" element={<StudentRoster />} />
          
          {/* HOD Pages */}
          <Route path="event-calendar" element={<EventCalendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
