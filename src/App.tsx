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
import Reports from './pages/Reports.tsx';

function App() {
  const [role, setRole] = useState<string | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setRole={setRole} />} />

        {/* Protected Routes wrapped in Layout */}
        <Route path="/" element={<Layout role={role} setRole={setRole} />}>
          <Route index element={<Navigate to={role?.startsWith('faculty') ? "/faculty" : "/student"} replace />} />
          <Route path="student" element={<StudentDashboard />} />
          <Route path="faculty" element={<FacultyDashboard />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="requests" element={<Requests />} />
          <Route path="ai-chat" element={<AiChatbot />} />
          {/* Admin Pages */}
          <Route path="manage-teachers" element={<ManageTeachers />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
