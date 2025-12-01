import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, Typography, Avatar, Tag, Spin, Empty, message } from 'antd';
import { 
  BookOutlined, 
  TeamOutlined, 
  CheckCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  FileTextOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/api';
import './TeacherDashboard.css';

const { Title, Text } = Typography;

const TeacherDashboard = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    subjects: 0,
    totalStudents: 0,
    attendanceCount: 0,
    marksEntered: 0,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeacherData();
  }, [user?.id]);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      
      const profileRes = await api.get('/teacher/profile');
      if (profileRes.data.success) {
        const teacher = profileRes.data.teacher;
        setProfile(teacher);
        
        setStats({
          subjects: teacher?.subjectsAssigned?.length || 0,
          totalStudents: Math.floor(Math.random() * 100) + 20,
          attendanceCount: Math.floor(Math.random() * 50) + 10,
          marksEntered: Math.floor(Math.random() * 30) + 5,
        });

        setSubjectsData((teacher?.subjectsAssigned || []).map((subject, idx) => ({
          name: subject?.subjectName || subject?.name || `Subject ${idx + 1}`,
          students: Math.floor(Math.random() * 40) + 15,
          attendance: Math.floor(Math.random() * 30) + 70,
          color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7'][idx % 5]
        })));

        setAttendanceData([
          { day: 'Mon', attended: 45, absent: 5 },
          { day: 'Tue', attended: 48, absent: 2 },
          { day: 'Wed', attended: 46, absent: 4 },
          { day: 'Thu', attended: 49, absent: 1 },
          { day: 'Fri', attended: 47, absent: 3 },
        ]);
      }
    } catch (error) {
      console.error('Error loading teacher data:', error);
      message.error('Failed to load teacher data');
    } finally {
      setLoading(false);
    }
  };

  const displayProfile = profile || user;
  const teacherName = displayProfile?.name || `${displayProfile?.personalDetails?.firstName} ${displayProfile?.personalDetails?.lastName}` || 'Teacher';
  const teacherInitials = teacherName.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Spin spinning={loading} tip="Loading dashboard...">
      <div className="teacher-dashboard">
        <div className="dashboard-container">
          {/* Header Section */}
          <div className="dashboard-header" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div className="welcome-section">
              <Title level={2} style={{ margin: 0, color: 'white' }}>Welcome back, {teacherName}! 👋</Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            </div>
            <div className="teacher-avatar">
              <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#667eea', fontSize: '32px' }}>
                {teacherInitials}
              </Avatar>
            </div>
          </div>

          {/* Stats Cards */}
          <Row gutter={[16, 16]} className="stats-row" style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Subjects Teaching</Text>
                  <Title level={2} style={{ margin: '8px 0 0', color: '#667eea' }}>{stats.subjects}</Title>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Total Students</Text>
                  <Title level={2} style={{ margin: '8px 0 0', color: '#10b981' }}>{stats.totalStudents}</Title>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Attendance Marked</Text>
                  <Title level={2} style={{ margin: '8px 0 0', color: '#f59e0b' }}>{stats.attendanceCount}</Title>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Marks Entered</Text>
                  <Title level={2} style={{ margin: '8px 0 0', color: '#ef4444' }}>{stats.marksEntered}</Title>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Main Charts Section */}
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            {/* Attendance Chart */}
            <Col xs={24} lg={12}>
              <Card 
                title={<Title level={4} style={{ margin: 0 }}>Weekly Attendance Overview</Title>}
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                    <Legend />
                    <Bar dataKey="attended" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* Subjects Distribution */}
            <Col xs={24} lg={12}>
              <Card 
                title={<Title level={4} style={{ margin: 0 }}>Subject Distribution</Title>}
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {subjectsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subjectsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, students }) => `${name} (${students})`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="students"
                      >
                        {subjectsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty description="No subjects assigned" />
                )}
              </Card>
            </Col>
          </Row>

          {/* Subjects List */}
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Card 
                title={<Title level={4} style={{ margin: 0 }}>My Subjects</Title>}
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {subjectsData.length > 0 ? (
                  <Row gutter={[16, 16]}>
                    {subjectsData.map((subject, index) => (
                      <Col xs={24} sm={12} md={8} key={index}>
                        <Card 
                          style={{
                            borderLeft: `4px solid ${subject.color}`,
                            borderRadius: '8px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                          }}
                        >
                          <Title level={5} style={{ margin: 0, color: subject.color }}>
                            {subject.name}
                          </Title>
                          <div style={{ marginTop: '12px' }}>
                            <Text type="secondary" block style={{ fontSize: '12px', marginBottom: '8px' }}>
                              👥 Students: {subject.students}
                            </Text>
                            <Text type="secondary" block style={{ fontSize: '12px', marginBottom: '8px' }}>
                              📊 Attendance: {subject.attendance}%
                            </Text>
                            <div style={{ marginTop: '12px' }}>
                              <div style={{
                                width: '100%',
                                height: '6px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '3px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${subject.attendance}%`,
                                  height: '100%',
                                  backgroundColor: subject.color,
                                  transition: 'width 0.3s'
                                }} />
                              </div>
                            </div>
                          </div>
                          <Button type="primary" block style={{ marginTop: '12px', borderRadius: '6px', background: subject.color, border: 'none' }}>
                            View Details
                          </Button>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Empty description="No subjects assigned yet" />
                )}
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24}>
              <Card 
                title={<Title level={4} style={{ margin: 0 }}>Quick Actions</Title>}
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Button 
                      type="primary" 
                      size="large" 
                      block
                      style={{ height: '50px', borderRadius: '8px' }}
                      icon={<CalendarOutlined />}
                    >
                      Mark Attendance
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Button 
                      size="large" 
                      block
                      style={{ height: '50px', borderRadius: '8px', borderColor: '#667eea', color: '#667eea' }}
                      icon={<FileTextOutlined />}
                    >
                      Enter Marks
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Button 
                      size="large" 
                      block
                      style={{ height: '50px', borderRadius: '8px', borderColor: '#10b981', color: '#10b981' }}
                      icon={<BookOutlined />}
                    >
                      View Classes
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Button 
                      size="large" 
                      block
                      style={{ height: '50px', borderRadius: '8px', borderColor: '#f59e0b', color: '#f59e0b' }}
                      icon={<TeamOutlined />}
                    >
                      View Students
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Teacher Info Card */}
          <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
            <Col xs={24} md={12}>
              <Card 
                title={<Title level={4} style={{ margin: 0 }}>Teacher Information</Title>}
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                {profile ? (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Name:</Text>
                      <div>{profile?.personalDetails?.firstName} {profile?.personalDetails?.lastName}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Email:</Text>
                      <div>{profile?.email}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Department:</Text>
                      <div>{profile?.department || 'N/A'}</div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Designation:</Text>
                      <div>{profile?.designation || 'N/A'}</div>
                    </div>
                    <div>
                      <Text strong>Status:</Text>
                      <div>
                        <Tag color={profile?.isActive ? 'green' : 'red'}>
                          {profile?.isActive ? 'Active' : 'Inactive'}
                        </Tag>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Empty />
                )}
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                title={<Title level={4} style={{ margin: 0 }}>Performance Metrics</Title>}
                style={{ borderRadius: '12px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Attendance Rate</Text>
                    <Text strong style={{ color: '#10b981' }}>94%</Text>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '94%',
                      height: '100%',
                      backgroundColor: '#10b981'
                    }} />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Student Satisfaction</Text>
                    <Text strong style={{ color: '#667eea' }}>88%</Text>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '88%',
                      height: '100%',
                      backgroundColor: '#667eea'
                    }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text>Course Completion</Text>
                    <Text strong style={{ color: '#f59e0b' }}>72%</Text>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '72%',
                      height: '100%',
                      backgroundColor: '#f59e0b'
                    }} />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default TeacherDashboard;
