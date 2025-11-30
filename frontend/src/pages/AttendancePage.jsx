import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Statistic, Progress, Tag, message, Button, Modal, Form, Select } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, CalendarOutlined, AlertOutlined } from '@ant-design/icons';
import axios from 'axios';

const AttendancePage = ({ user }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    percentage: 0,
  });
  const [markModal, setMarkModal] = useState(false);
  const [markForm] = Form.useForm();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`/api/attendance/student/${user?.id}`, { headers });
      setAttendance(response.data.attendance || []);

      const totalDays = response.data.attendance?.length || 0;
      const presentDays = response.data.attendance?.filter((a) => a.status === 'present').length || 0;
      const absentDays = totalDays - presentDays;
      const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

      setStats({ totalDays, presentDays, absentDays, percentage });
    } catch (error) {
      message.error('Failed to load attendance data');
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
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
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
        <Tag
          icon={text === 'present' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={text === 'present' ? 'green' : 'red'}
        >
          {text?.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Present', value: 'present' },
        { text: 'Absent', value: 'absent' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text) => text || '-',
    },
  ];

  const getAttendanceStatus = () => {
    if (stats.percentage >= 75) {
      return { color: '#52c41a', text: 'Good' };
    } else if (stats.percentage >= 60) {
      return { color: '#faad14', text: 'Needs Improvement' };
    } else {
      return { color: '#ff4d4f', text: 'Critical' };
    }
  };

  const status = getAttendanceStatus();

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Classes"
              value={stats.totalDays}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Present"
              value={stats.presentDays}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Absent"
              value={stats.absentDays}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Attendance %"
              value={stats.percentage}
              suffix="%"
              valueStyle={{ color: status.color }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="Attendance Progress" loading={loading}>
            <Progress
              type="circle"
              percent={stats.percentage}
              width={150}
              strokeColor={status.color}
              format={(percent) => `${percent}%`}
            />
            <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold', color: status.color }}>
              Status: {status.text}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Attendance Rules" icon={<AlertOutlined />}>
            <ul style={{ lineHeight: '1.8' }}>
              <li>Minimum 75% attendance is required</li>
              <li>Medical certificates accepted for sick leave</li>
              <li>Attendance below 60% may result in warnings</li>
              <li>Approval required for leave requests</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Card title="Attendance Record" style={{ marginTop: '20px' }} loading={loading}>
        <Table
          columns={attendanceColumns}
          dataSource={attendance.map((item, idx) => ({ ...item, key: idx }))}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </div>
  );
};

export default AttendancePage;
