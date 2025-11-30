import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from './utils/api';
import { Layout, Spin, Menu, Button, Row, Col } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  BookOutlined, 
  TeamOutlined, 
  LoginOutlined,
  AppstoreOutlined,
  LockOutlined
} from '@ant-design/icons';

// Import Pages
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import ApplicationFormPage from './pages/ApplicationFormPage';
import AdmissionManagement from './pages/AdmissionManagement';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminTeachersPage from './pages/AdminTeachersPage';
import AdminCoursesPage from './pages/AdminCoursesPage';
import AdminSubjectsPage from './pages/AdminSubjectsPage';
import AdminAttendancePanel from './pages/AdminAttendancePanel';
import AdminFeesManagement from './pages/AdminFeesManagement';
import FeesPage from './pages/FeesPage';
import AttendancePage from './pages/AttendancePage';
import ExamsPage from './pages/ExamsPage';
import LMSPage from './pages/LMSPage';
import MessagesPage from './pages/MessagesPage';
import TimetablePage from './pages/TimetablePage';
import StudentProfile from './pages/StudentProfile';
import NoticesPage from './pages/NoticesPage';
import Sidebar from './components/Sidebar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await api.get('/auth/verify-token');
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Navigation bar component
  const NavBar = () => (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <h2>EduManage</h2>
          </Link>
        </div>
        <Menu mode="horizontal" className="nav-menu">
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="about" icon={<AppstoreOutlined />}>
            <Link to="/#features">Features</Link>
          </Menu.Item>
          <Menu.SubMenu key="login" title="Login" icon={<LoginOutlined />}>
            <Menu.Item key="student-login">
              <Link to="/login">Student Login</Link>
            </Menu.Item>
            <Menu.Item key="teacher-login">
              <Link to="/teacher/login">Teacher Login</Link>
            </Menu.Item>
            <Menu.Item key="admin-login">
              <Link to="/admin/login">Admin Login</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="register">
            <Button type="primary">
              <Link to="/register">Get Started</Link>
            </Button>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );

  return (
    <Router>
      {!user ? (
        <>
          <NavBar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<StudentLogin setUser={setUser} />} />
              <Route path="/teacher/login" element={<TeacherLogin setUser={setUser} />} />
              <Route path="/admin/login" element={<AdminLogin setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      ) : user.role === 'student' && user.applicationSubmitted === false ? (
        <Routes>
          <Route path="/application-form" element={<ApplicationFormPage user={user} />} />
          <Route path="/logout" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/application-form" />} />
        </Routes>
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar user={user} onLogout={handleLogout} />
          <Layout style={{ marginLeft: '200px' }}>
            <Routes>
              {user.role === 'student' && (
                <>
                  <Route path="/dashboard" element={<StudentDashboard user={user} />} />
                  <Route path="/profile" element={<StudentProfile user={user} />} />
                  <Route path="/attendance" element={<AttendancePage user={user} />} />
                  <Route path="/exams" element={<ExamsPage user={user} />} />
                  <Route path="/fees" element={<FeesPage user={user} />} />
                  <Route path="/lms" element={<LMSPage user={user} />} />
                  <Route path="/messages" element={<MessagesPage user={user} />} />
                  <Route path="/timetable" element={<TimetablePage user={user} />} />
                  <Route path="/notices" element={<NoticesPage user={user} />} />
                </>
              )}
              {user.role === 'teacher' && (
                <>
                  <Route path="/dashboard" element={<TeacherDashboard user={user} />} />
                  <Route path="/attendance" element={<AttendancePage user={user} />} />
                  <Route path="/exams" element={<ExamsPage user={user} />} />
                  <Route path="/lms" element={<LMSPage user={user} />} />
                  <Route path="/messages" element={<MessagesPage user={user} />} />
                  <Route path="/timetable" element={<TimetablePage user={user} />} />
                </>
              )}
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <>
                  <Route path="/dashboard" element={<AdminDashboard user={user} />} />
                  <Route path="/admissions" element={<AdmissionManagement user={user} />} />
                  <Route path="/students" element={<AdminStudentsPage user={user} />} />
                  <Route path="/teachers" element={<AdminTeachersPage user={user} />} />
                  <Route path="/courses" element={<AdminCoursesPage user={user} />} />
                  <Route path="/subjects" element={<AdminSubjectsPage user={user} />} />
                  <Route path="/attendance" element={<AdminAttendancePanel user={user} />} />
                  <Route path="/fees" element={<AdminFeesManagement user={user} />} />
                  <Route path="/exams" element={<ExamsPage user={user} />} />
                  <Route path="/messages" element={<MessagesPage user={user} />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Layout>
        </Layout>
      )}
    </Router>
  );
}

export default App;
