import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Input, Select, message, Statistic, Tag, Space, Tabs } from 'antd';
import { FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, BookOutlined } from '@ant-design/icons';
import axios from 'axios';

const ExamsPage = ({ user }) => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [stats, setStats] = useState({
    totalExams: 0,
    completed: 0,
    pending: 0,
    averageMarks: 0,
  });

  useEffect(() => {
    fetchExamsData();
  }, []);

  const fetchExamsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [examsRes, resultsRes] = await Promise.all([
        axios.get('/api/exams', { headers }),
        axios.get('/api/exams/results', { headers }).catch(() => ({ data: { results: [] } })),
      ]);

      setExams(examsRes.data.exams || []);
      setResults(resultsRes.data.results || []);

      const totalExams = examsRes.data.exams?.length || 0;
      const completed = resultsRes.data.results?.length || 0;
      const avgMarks = completed > 0
        ? Math.round(resultsRes.data.results.reduce((sum, r) => sum + (r.marksObtained || 0), 0) / completed)
        : 0;

      setStats({
        totalExams,
        completed,
        pending: totalExams - completed,
        averageMarks: avgMarks,
      });
    } catch (error) {
      message.error('Failed to load exams data');
    } finally {
      setLoading(false);
    }
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const examDate = new Date(exam.examDate);
    if (examDate < now) {
      return { color: 'green', text: 'Completed' };
    } else if (examDate - now < 7 * 24 * 60 * 60 * 1000) {
      return { color: 'orange', text: 'Upcoming' };
    }
    return { color: 'blue', text: 'Scheduled' };
  };

  const examColumns = [
    {
      title: 'Exam Name',
      dataIndex: 'examName',
      key: 'name',
    },
    {
      title: 'Subject',
      dataIndex: ['subject', 'subjectName'],
      key: 'subject',
    },
    {
      title: 'Date',
      dataIndex: 'examDate',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Time',
      dataIndex: 'examTime',
      key: 'time',
      render: (text) => text || '-',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (text) => `${text} mins`,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = getExamStatus(record);
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
  ];

  const resultColumns = [
    {
      title: 'Exam',
      dataIndex: ['exam', 'examName'],
      key: 'exam',
    },
    {
      title: 'Subject',
      dataIndex: ['subject', 'subjectName'],
      key: 'subject',
    },
    {
      title: 'Marks',
      key: 'marks',
      render: (_, record) => `${record.marksObtained}/${record.totalMarks}`,
    },
    {
      title: 'Percentage',
      key: 'percentage',
      render: (_, record) => {
        const percentage = Math.round((record.marksObtained / record.totalMarks) * 100);
        const color = percentage >= 75 ? 'green' : percentage >= 60 ? 'orange' : 'red';
        return <Tag color={color}>{percentage}%</Tag>;
      },
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Exams"
              value={stats.totalExams}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Marks"
              value={stats.averageMarks}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        style={{ marginTop: '20px' }}
        items={[
          {
            key: '1',
            label: 'Upcoming Exams',
            children: (
              <Card loading={loading}>
                <Table
                  columns={examColumns}
                  dataSource={exams.map((item, idx) => ({ ...item, key: idx }))}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
          {
            key: '2',
            label: 'Results',
            children: (
              <Card loading={loading}>
                <Table
                  columns={resultColumns}
                  dataSource={results.map((item, idx) => ({ ...item, key: idx }))}
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ExamsPage;
