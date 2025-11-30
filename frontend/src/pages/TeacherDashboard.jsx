import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, Typography, Divider, Avatar } from 'antd';
import { 
  BookOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  FileDoneOutlined, 
  CheckCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './TeacherDashboard.css';

const { Title, Text } = Typography;

const TeacherDashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    assignments: 0,
    attendance: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const profileRes = await axios.get('/api/teachers/profile', { headers });
        setProfile(profileRes.data.teacher);
        setStats({
          subjects: profileRes.data.teacher?.subjectsAssigned?.length || 0,
          students: 50,
          assignments: 5,
          announcements: 12,
        });
      } catch (error) {
        console.log('Profile fetch failed:', error.message);
        setProfile(user);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayProfile = profile || user;

  // Get teacher's name from profile or user object
  const teacherName = displayProfile?.name || user?.name || 'Teacher';
  const teacherInitials = teacherName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <Title level={2} style={{ margin: 0 }}>Welcome back, {teacherName}</Title>
            <Text type="secondary">Here's what's happening with your classes today</Text>
          </div>
          <div className="teacher-avatar">
            <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
              {teacherInitials}
            </Avatar>
          </div>
        </div>

        <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(22, 163, 74, 0.1)' }}>
              <BookOutlined style={{ color: '#16a34a', fontSize: '24px' }} />
            </div>
            <div className="stat-content">
              <Text type="secondary">My Classes</Text>
              <Title level={3} style={{ margin: '4px 0 0', color: '#16a34a' }}>{stats.classes}</Title>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <TeamOutlined style={{ color: '#3b82f6', fontSize: '24px' }} />
            </div>
            <div className="stat-content">
              <Text type="secondary">Total Students</Text>
              <Title level={3} style={{ margin: '4px 0 0', color: '#3b82f6' }}>{stats.students}</Title>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}>
              <FileDoneOutlined style={{ color: '#f97316', fontSize: '24px' }} />
            </div>
            <div className="stat-content">
              <Text type="secondary">Assignments to Grade</Text>
              <Title level={3} style={{ margin: '4px 0 0', color: '#f97316' }}>{stats.assignments}</Title>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
              <CheckCircleOutlined style={{ color: '#a855f7', fontSize: '24px' }} />
            </div>
            <div className="stat-content">
              <Text type="secondary">Attendance to Take</Text>
              <Title level={3} style={{ margin: '4px 0 0', color: '#a855f7' }}>{stats.attendance}</Title>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="dashboard-content">
        <Col xs={24} lg={16}>
          <Card className="dashboard-card" title={
            <div className="card-header">
              <Title level={4} style={{ margin: 0 }}>Upcoming Classes</Title>
              <Button type="link">View All</Button>
            </div>
          }>
            <div className="class-list">
              {[1, 2, 3].map((item) => (
                <div key={item} className="class-item">
                  <div className="class-time">
                    <span className="class-time-text">10:00 AM</span>
                    <span className="class-date">Today</span>
                  </div>
                  <div className="class-content">
                    <h4 className="class-title">Mathematics - Grade 10</h4>
                    <div className="class-meta">
                      <span><TeamOutlined /> 25 Students</span>
                      <span><ClockCircleOutlined /> 1 hour</span>
                      <span>Room 201</span>
                    </div>
                  </div>
                  <Button type="primary">Start Class</Button>
                </div>
              ))}
            </div>
          </Card>

          <Card 
            className="dashboard-card" 
            title={
              <div className="card-header">
                <Title level={4} style={{ margin: 0 }}>Recent Activities</Title>
              </div>
            }
            style={{ marginTop: '24px' }}
          >
            <div className="activity-list">
              {[1, 2, 3].map((item) => (
                <div key={item} className="activity-item">
                  <div className="activity-icon" style={{ color: item % 2 === 0 ? '#10b981' : '#3b82f6' }}>
                    {item % 2 === 0 ? <CheckCircleOutlined /> : <FileDoneOutlined />}
                  </div>
                  <div className="activity-content">
                    <h4 className="activity-title">
                      {item % 2 === 0 ? 'Assignment Graded' : 'New Assignment Submitted'}
                    </h4>
                    <p className="activity-description">
                      {item % 2 === 0 
                        ? 'You graded 15 Math assignments' 
                        : 'John Doe submitted the Algebra assignment'}
                    </p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            className="dashboard-card" 
            title={
              <div className="card-header">
                <Title level={4} style={{ margin: 0 }}>Course Progress</Title>
              </div>
            }
          >
            <div className="course-progress">
              {['Mathematics', 'Physics', 'Chemistry'].map((subject, index) => (
                <div key={index} className="course-progress-item">
                  <div className="course-info">
                    <h4>{subject}</h4>
                    <Text type="secondary">Grade 10 - Section A</Text>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${70 + (index * 10)}%`,
                          backgroundColor: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'
                        }}
                      ></div>
                    </div>
                    <Text>{70 + (index * 10)}% completed</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats Section */}
      <Card className="quick-stats">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <div className="quick-stat">
              <BarChartOutlined className="stat-icon" />
              <div>
                <Text type="secondary">Average Class Performance</Text>
                <Title level={4} style={{ margin: '4px 0 0' }}>87%</Title>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="quick-stat">
              <TeamOutlined className="stat-icon" />
              <div>
                <Text type="secondary">Total Students</Text>
                <Title level={4} style={{ margin: '4px 0 0' }}>142</Title>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="quick-stat">
              <CheckCircleOutlined className="stat-icon" />
              <div>
                <Text type="secondary">Attendance This Month</Text>
                <Title level={4} style={{ margin: '4px 0 0' }}>94%</Title>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
