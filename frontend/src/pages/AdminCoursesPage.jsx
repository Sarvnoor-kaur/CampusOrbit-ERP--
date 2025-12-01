import { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, message, Pagination, Tag, Row, Col, Form, Select, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../utils/api';

const AdminCoursesPage = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, [currentPage, search]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/courses', {
        params: { page: currentPage, limit: pageSize },
      });
      
      setCourses(response.data.courses || []);
      setStats({
        total: response.data.pagination?.total || 0,
      });
    } catch (error) {
      message.error('Failed to fetch courses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (values) => {
    try {
      setSubmitting(true);
      
      const payload = {
        courseName: values.courseName,
        courseCode: values.courseCode,
        department: values.department,
        totalSemesters: values.totalSemesters || 4,
      };

      await api.post('/admin/course/create', payload);

      message.success('Course created successfully!');
      form.resetFields();
      setAddModalVisible(false);
      fetchCourses();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courseId) => {
    Modal.confirm({
      title: 'Delete Course',
      content: 'Are you sure you want to delete this course? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      async onOk() {
        try {
          await api.delete(`/admin/course/${courseId}`).catch(() => {});
          message.success('Course deleted successfully');
          fetchCourses();
        } catch (error) {
          message.error('Failed to delete course');
        }
      },
    });
  };

  return (
    <Spin spinning={loading} tip="Loading courses...">
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Course Management</h1>
          <p style={{ color: '#666' }}>Create and manage academic courses</p>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e', marginBottom: '8px' }}>
                  {stats.total}
                </p>
                <p style={{ color: '#666' }}>Total Courses</p>
              </div>
            </Card>
          </Col>
        </Row>

        <Card bordered={false} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Courses List</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
              Add Course
            </Button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Input
              placeholder="Search by course name or code..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              size="large"
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>
                    Course Code
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>
                    Course Name
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>
                    Department
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>
                    Semesters
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 16px', color: '#333', fontWeight: '500' }}>{course.courseCode}</td>
                      <td style={{ padding: '12px 16px', color: '#333' }}>{course.courseName}</td>
                      <td style={{ padding: '12px 16px', color: '#666' }}>{course.department || 'N/A'}</td>
                      <td style={{ padding: '12px 16px', color: '#666' }}>{course.totalSemesters || 'N/A'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Button
                          type="link"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            setSelectedCourse(course);
                            setViewModalVisible(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          type="link"
                          size="small"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => handleDelete(course._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#666' }}>
              Showing {courses.length} of {stats.total}
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={stats.total}
              onChange={setCurrentPage}
            />
          </div>
        </Card>

        <Modal
          title="Course Details"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={600}
        >
          {selectedCourse && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ color: '#666', fontSize: '12px' }}>Course Code</p>
                <p style={{ fontWeight: 'bold', color: '#333' }}>{selectedCourse.courseCode}</p>
              </div>
              <div>
                <p style={{ color: '#666', fontSize: '12px' }}>Total Semesters</p>
                <p style={{ fontWeight: 'bold', color: '#333' }}>{selectedCourse.totalSemesters || 'N/A'}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ color: '#666', fontSize: '12px' }}>Course Name</p>
                <p style={{ fontWeight: 'bold', color: '#333' }}>{selectedCourse.courseName}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ color: '#666', fontSize: '12px' }}>Department</p>
                <p style={{ fontWeight: 'bold', color: '#333' }}>{selectedCourse.department || 'N/A'}</p>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          title="Add New Course"
          open={addModalVisible}
          onCancel={() => {
            setAddModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddCourse}
            autoComplete="off"
          >
            <Form.Item
              label="Course Code"
              name="courseCode"
              rules={[{ required: true, message: 'Please enter course code' }]}
            >
              <Input placeholder="e.g., CS101" />
            </Form.Item>

            <Form.Item
              label="Course Name"
              name="courseName"
              rules={[{ required: true, message: 'Please enter course name' }]}
            >
              <Input placeholder="e.g., Introduction to Computer Science" />
            </Form.Item>

            <Form.Item
              label="Department"
              name="department"
              rules={[{ required: true, message: 'Please select department' }]}
            >
              <Select placeholder="Select department">
                <Select.Option value="Computer Science">Computer Science</Select.Option>
                <Select.Option value="Mathematics">Mathematics</Select.Option>
                <Select.Option value="Physics">Physics</Select.Option>
                <Select.Option value="Chemistry">Chemistry</Select.Option>
                <Select.Option value="Biology">Biology</Select.Option>
                <Select.Option value="English">English</Select.Option>
                <Select.Option value="History">History</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Total Semesters"
              name="totalSemesters"
              initialValue={4}
            >
              <Select placeholder="Select total semesters">
                <Select.Option value={2}>2 Semesters</Select.Option>
                <Select.Option value={4}>4 Semesters</Select.Option>
                <Select.Option value={6}>6 Semesters</Select.Option>
                <Select.Option value={8}>8 Semesters</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
                Create Course
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default AdminCoursesPage;
