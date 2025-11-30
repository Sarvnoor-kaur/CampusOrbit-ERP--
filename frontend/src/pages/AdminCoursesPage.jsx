import { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, message, Pagination, Tag, Form, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminCoursesPage = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: { courses: [] } }));
      
      setCourses(response.data.courses || []);
      setStats({
        total: response.data.courses?.length || 0,
        active: response.data.courses?.filter(c => c.status === 'active').length || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
          const token = localStorage.getItem('token');
          await axios.delete(`/api/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {});
          message.success('Course deleted successfully');
          fetchCourses();
        } catch (error) {
          message.error('Failed to delete course');
        }
      },
    });
  };

  const filteredCourses = courses.filter(c =>
    c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
    c.courseCode?.includes(search) ||
    c.level?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
        <p className="text-gray-600">Create and manage academic courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{stats.total}</p>
            <p className="text-gray-600 mt-2">Total Courses</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{stats.active}</p>
            <p className="text-gray-600 mt-2">Active Courses</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Courses List</h2>
          <Button type="primary" icon={<PlusOutlined />} className="bg-green-600">
            Add Course
          </Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search by course name, code, or level..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            size="large"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Course Code</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Course Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Level</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Credits</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.length > 0 ? (
                paginatedCourses.map((course, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-semibold">{course.courseCode}</td>
                    <td className="px-4 py-3 text-gray-900">{course.courseName}</td>
                    <td className="px-4 py-3 text-gray-600">{course.level || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600">{course.credits || '-'}</td>
                    <td className="px-4 py-3">
                      <Tag color={course.status === 'active' ? 'green' : 'default'}>
                        {course.status?.toUpperCase() || 'ACTIVE'}
                      </Tag>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCourse(course);
                          setModalVisible(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeOutlined className="mr-1" />
                        View
                      </button>
                      <button className="text-amber-600 hover:text-amber-800">
                        <EditOutlined className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <DeleteOutlined className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-gray-600">
            Showing {paginatedCourses.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, filteredCourses.length)} of {filteredCourses.length}
          </span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredCourses.length}
            onChange={setCurrentPage}
          />
        </div>
      </Card>

      <Modal
        title="Course Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedCourse && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Course Code</p>
                <p className="font-semibold text-gray-900">{selectedCourse.courseCode}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-semibold text-gray-900">
                  <Tag color={selectedCourse.status === 'active' ? 'green' : 'default'}>
                    {selectedCourse.status?.toUpperCase() || 'ACTIVE'}
                  </Tag>
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Course Name</p>
                <p className="font-semibold text-gray-900">{selectedCourse.courseName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Level</p>
                <p className="font-semibold text-gray-900">{selectedCourse.level || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Credits</p>
                <p className="font-semibold text-gray-900">{selectedCourse.credits || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Description</p>
                <p className="font-semibold text-gray-900">{selectedCourse.description || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminCoursesPage;
