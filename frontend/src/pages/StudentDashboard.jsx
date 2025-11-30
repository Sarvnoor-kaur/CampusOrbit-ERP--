import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Tabs, Button, Modal, Form, Input, message, Statistic, Progress, Tag, Space, Avatar } from 'antd';
import { FileTextOutlined, CalendarOutlined, DollarOutlined, BookOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const StudentDashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cgpa, setCgpa] = useState('0.00');

  useEffect(() => {
    fetchStudentData();
  }, [user?.id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, attendanceRes, resultsRes, feesRes] = await Promise.all([
        axios.get('/api/students/profile', { headers }).catch(() => ({ data: { student: null } })),
        axios.get(`/api/attendance/student/${user?.id}`, { headers }).catch(() => ({ data: {} })),
        axios.get('/api/students/results', { headers }).catch(() => ({ data: { results: [], cgpa: 0 } })),
        axios.get(`/api/fees/student/${user?.id}`, { headers }).catch(() => ({ data: { fees: null } })),
      ]);

      setProfile(profileRes.data.student);
      setAttendance(attendanceRes.data);
      setResults(resultsRes.data.results || []);
      setCgpa(resultsRes.data.cgpa || 0);
      setFees(feesRes.data.fees);
    } catch (error) {
      message.error('Failed to load dashboard data');
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const attendanceColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Subject',
      dataIndex: ['subject', 'subjectName'],
      key: 'subject',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag icon={text === 'present' ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={text === 'present' ? 'green' : 'red'}>
          {text?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text) => text || '-',
    },
  ];

  const resultsColumns = [
    {
      title: 'Subject',
      dataIndex: ['subject', 'subjectName'],
      key: 'subject',
    },
    {
      title: 'Marks Obtained',
      dataIndex: 'marksObtained',
      key: 'marks',
      render: (text, record) => `${text}/${record.totalMarks}`,
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => `${text}%`,
    },
    {
      title: 'Grade Points',
      dataIndex: 'gradePoints',
      key: 'gradePoints',
    },
  ];

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          </Col>
          <Col xs={24} md={18}>
            <h1>Welcome, {profile?.personalDetails?.firstName} {profile?.personalDetails?.lastName}!</h1>
            <p style={{ color: '#666', marginTop: 8 }}>
              Admission Number: <strong>{profile?.admissionNumber || 'N/A'}</strong>
            </p>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Admission Number"
              value={profile?.admissionNumber || 'N/A'}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="CGPA"
              value={cgpa}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Attendance %"
              value={attendance?.stats?.attendancePercentage || 0}
              suffix="%"
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Pending Fees"
              value={fees?.pendingDues || 0}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Tabs
          defaultActiveKey="attendance"
          items={[
            {
              key: 'profile',
              label: 'Profile Info',
              children: (
                <div>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <h3>Personal Details</h3>
                      <p><strong>Name:</strong> {profile?.personalDetails?.firstName} {profile?.personalDetails?.lastName}</p>
                      <p><strong>Email:</strong> {profile?.email}</p>
                      <p><strong>Phone:</strong> {profile?.personalDetails?.phone || profile?.mobileNumber || 'N/A'}</p>
                      <p><strong>DOB:</strong> {profile?.personalDetails?.dob ? new Date(profile.personalDetails.dob).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Gender:</strong> {profile?.personalDetails?.gender || 'N/A'}</p>
                      <p><strong>Blood Group:</strong> {profile?.personalDetails?.bloodGroup || 'N/A'}</p>
                    </Col>
                    <Col xs={24} md={12}>
                      <h3>Academic Details</h3>
                      <p><strong>Batch:</strong> {profile?.academicDetails?.batch || 'N/A'}</p>
                      <p><strong>Enrollment Status:</strong> <Tag color={profile?.academicDetails?.enrollmentStatus === 'active' ? 'green' : 'orange'}>{profile?.academicDetails?.enrollmentStatus?.toUpperCase()}</Tag></p>
                      <p><strong>CGPA:</strong> {profile?.academicDetails?.cgpa || cgpa}</p>
                      <p><strong>Current Semester:</strong> {profile?.academicDetails?.currentSemester || 'N/A'}</p>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: 'attendance',
              label: `Attendance (${attendance?.stats?.totalDays || 0})`,
              children: (
                <div>
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={6}>
                      <Card>
                        <Statistic title="Total Classes" value={attendance?.stats?.totalDays || 0} />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card>
                        <Statistic title="Present" value={attendance?.stats?.presentDays || 0} valueStyle={{ color: '#52c41a' }} />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card>
                        <Statistic title="Absent" value={attendance?.stats?.absentDays || 0} valueStyle={{ color: '#ff4d4f' }} />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <Card>
                        <Progress type="circle" percent={Math.round(attendance?.stats?.attendancePercentage || 0)} width={80} />
                      </Card>
                    </Col>
                  </Row>
                  <Table
                    columns={attendanceColumns}
                    dataSource={attendance?.attendance || []}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    rowKey={(record, idx) => idx}
                  />
                </div>
              ),
            },
            {
              key: 'results',
              label: `Results (${results.length})`,
              children: (
                <Table
                  columns={resultsColumns}
                  dataSource={results}
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                  rowKey={(record, idx) => idx}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default StudentDashboard;
