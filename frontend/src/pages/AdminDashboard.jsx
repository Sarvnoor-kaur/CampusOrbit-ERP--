import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    approved: 0, 
    rejected: 0,
    students: 0,
    teachers: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, studentsRes, teachersRes] = await Promise.all([
        axios.get('/api/admissions/stats', { headers }).catch(() => ({ data: { stats: {} } })),
        axios.get('/api/students', { headers }).catch(() => ({ data: { students: [] } })),
        axios.get('/api/teachers', { headers }).catch(() => ({ data: { teachers: [] } })),
      ]);

      setStats({
        total: statsRes.data.stats?.total || 0,
        pending: statsRes.data.stats?.pending || 0,
        approved: statsRes.data.stats?.approved || 0,
        rejected: statsRes.data.stats?.rejected || 0,
        students: studentsRes.data.students?.length || 0,
        teachers: teachersRes.data.teachers?.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of system statistics and management options</p>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={4}>
          <Card loading={loading}>
            <Statistic
              title="Total Applications"
              value={stats.total}
              prefix={<FileTextOutlined className="text-blue-600" />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card loading={loading}>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<ClockCircleOutlined className="text-amber-600" />}
              valueStyle={{ color: '#b45309' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card loading={loading}>
            <Statistic
              title="Approved"
              value={stats.approved}
              prefix={<CheckCircleOutlined className="text-green-600" />}
              valueStyle={{ color: '#22c55e' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card loading={loading}>
            <Statistic
              title="Rejected"
              value={stats.rejected}
              prefix={<CloseCircleOutlined className="text-red-600" />}
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card loading={loading}>
            <Statistic
              title="Total Students"
              value={stats.students}
              prefix={<UserOutlined className="text-indigo-600" />}
              valueStyle={{ color: '#6366f1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Card loading={loading}>
            <Statistic
              title="Total Teachers"
              value={stats.teachers}
              prefix={<TeamOutlined className="text-purple-600" />}
              valueStyle={{ color: '#a855f7' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <h2 className="text-2xl font-bold mb-4">System Management Overview</h2>
        <p className="text-gray-600 mb-6">
          Use the sidebar menu to access different management modules. Each option provides dedicated tools for managing that specific area.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-600 pl-4 py-2">
            <h3 className="font-semibold text-gray-900">📋 Admission Management</h3>
            <p className="text-sm text-gray-600">Review and process student applications</p>
          </div>
          <div className="border-l-4 border-indigo-600 pl-4 py-2">
            <h3 className="font-semibold text-gray-900">👥 Students</h3>
            <p className="text-sm text-gray-600">View and manage enrolled students</p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4 py-2">
            <h3 className="font-semibold text-gray-900">👨‍🏫 Teachers</h3>
            <p className="text-sm text-gray-600">Manage faculty members and assignments</p>
          </div>
          <div className="border-l-4 border-green-600 pl-4 py-2">
            <h3 className="font-semibold text-gray-900">📚 Courses & Subjects</h3>
            <p className="text-sm text-gray-600">Create and manage academic programs</p>
          </div>
          <div className="border-l-4 border-amber-600 pl-4 py-2">
            <h3 className="font-semibold text-gray-900">📅 Attendance</h3>
            <p className="text-sm text-gray-600">Monitor class attendance records</p>
          </div>
          <div className="border-l-4 border-red-600 pl-4 py-2">
            <h3 className="font-semibold text-gray-900">💰 Fees Management</h3>
            <p className="text-sm text-gray-600">Handle fees collection and tracking</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
