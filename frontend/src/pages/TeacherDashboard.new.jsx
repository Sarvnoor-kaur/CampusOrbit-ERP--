import { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Button, 
  Typography, 
  Avatar, 
  List, 
  Badge, 
  Tabs,
  Progress,
  Tag
} from 'antd';
import { 
  BookOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  TrophyOutlined,
  NotificationOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import axios from 'axios';
import './TeacherDashboard.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Sample data for demonstration
const recentActivities = [
  { id: 1, title: 'New assignment submitted', description: 'John Doe submitted Assignment 1', time: '10 minutes ago', type: 'submission' },
  { id: 2, title: 'New announcement', description: 'Midterm exam schedule updated', time: '2 hours ago', type: 'announcement' },
  { id: 3, title: 'New student enrolled', description: 'Sarah Wilson joined your Web Development class', time: '5 hours ago', type: 'enrollment' },
];

const upcomingClasses = [
  { id: 1, title: 'Web Development', time: '09:00 AM - 10:30 AM', date: '2023-11-28', type: 'lecture' },
  { id: 2, title: 'Database Systems', time: '11:00 AM - 12:30 PM', date: '2023-11-28', type: 'lab' },
  { id: 3, title: 'Software Engineering', time: '02:00 PM - 03:30 PM', date: '2023-11-28', type: 'lecture' },
];

const TeacherDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    assignmentsGraded: 0,
    announcements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // In a real app, you would fetch this data from your API
      // const response = await axios.get('/api/teacher/dashboard', { headers });
      // setStats(response.data.stats);
      
      // Mock data for demonstration
      setTimeout(() => {
        setStats({
          totalStudents: 142,
          activeCourses: 5,
          assignmentsGraded: 87,
          announcements: 3,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color = '#1890ff' }) => (
    <Card className="stat-card" hoverable>
      <div className="stat-icon" style={{ backgroundColor: `${color}15` }}>
        {icon}
      </div>
      <div className="stat-content">
        <Text type="secondary">{title}</Text>
        <Title level={3} style={{ margin: '5px 0 0', color }}>{value}</Title>
      </div>
    </Card>
  );

  const ActivityItem = ({ item }) => (
    <List.Item className="activity-item">
      <div className="activity-icon">
        {item.type === 'submission' && <FileTextOutlined style={{ color: '#52c41a' }} />}
        {item.type === 'announcement' && <NotificationOutlined style={{ color: '#1890ff' }} />}
        {item.type === 'enrollment' && <UserOutlined style={{ color: '#722ed1' }} />}
      </div>
      <div className="activity-content">
        <div className="activity-title">{item.title}</div>
        <div className="activity-description">{item.description}</div>
        <div className="activity-time">{item.time}</div>
      </div>
    </List.Item>
  );

  const ClassItem = ({ item }) => (
    <List.Item className="class-item">
      <div className="class-time">
        <div className="class-time-text">{item.time}</div>
        <Tag color={item.type === 'lecture' ? 'blue' : 'purple'}>{item.type}</Tag>
      </div>
      <div className="class-content">
        <div className="class-title">{item.title}</div>
        <div className="class-date">{item.date}</div>
      </div>
      <Button type="primary" size="small">Join</Button>
    </List.Item>
  );

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <Title level={2} style={{ margin: 0 }}>Welcome back, {user?.name || 'Teacher'}!</Title>
          <Text type="secondary">Here's what's happening with your classes today</Text>
        </div>
        <Button type="primary" icon={<CalendarOutlined />}>View Calendar</Button>
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard 
            icon={<TeamOutlined />} 
            title="Total Students" 
            value={stats.totalStudents} 
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard 
            icon={<BookOutlined />} 
            title="Active Courses" 
            value={stats.activeCourses} 
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard 
            icon={<CheckCircleOutlined />} 
            title="Assignments Graded" 
            value={stats.assignmentsGraded} 
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard 
            icon={<NotificationOutlined />} 
            title="New Announcements" 
            value={stats.announcements} 
            color="#faad14"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} xl={16}>
          <Card 
            className="dashboard-card"
            title={
              <div className="card-header">
                <Title level={4} style={{ margin: 0 }}>Upcoming Classes</Title>
                <Button type="link">View All</Button>
              </div>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={upcomingClasses}
              renderItem={item => <ClassItem item={item} />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card 
            className="dashboard-card"
            title={
              <div className="card-header">
                <Title level={4} style={{ margin: 0 }}>Recent Activities</Title>
                <Button type="link">View All</Button>
              </div>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={item => <ActivityItem item={item} />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            className="dashboard-card"
            title={
              <div className="card-header">
                <Title level={4} style={{ margin: 0 }}>Course Progress</Title>
                <Button type="link">View Details</Button>
              </div>
            }
          >
            <div className="course-progress">
              <div className="course-progress-item">
                <div className="course-info">
                  <Title level={5} style={{ margin: 0 }}>Web Development</Title>
                  <Text type="secondary">CS101 - Spring 2023</Text>
                </div>
                <div className="progress-container">
                  <Progress percent={75} strokeColor="#1890ff" />
                  <Text type="secondary">15/20 weeks completed</Text>
                </div>
              </div>
              <div className="course-progress-item">
                <div className="course-info">
                  <Title level={5} style={{ margin: 0 }}>Database Systems</Title>
                  <Text type="secondary">CS201 - Spring 2023</Text>
                </div>
                <div className="progress-container">
                  <Progress percent={60} strokeColor="#52c41a" />
                  <Text type="secondary">12/20 weeks completed</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard;
