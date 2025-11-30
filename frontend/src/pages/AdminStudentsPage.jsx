import { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, message, Pagination, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminStudentsPage = ({ user }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.students || []);
      setStats({
        total: response.data.students?.length || 0,
        active: response.data.students?.filter(s => s.status === 'active').length || 0,
        suspended: response.data.students?.filter(s => s.status === 'suspended').length || 0,
      });
    } catch (error) {
      message.error('Failed to fetch students');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    Modal.confirm({
      title: 'Delete Student',
      content: 'Are you sure you want to delete this student? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      async onOk() {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`/api/students/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success('Student deleted successfully');
          fetchStudents();
        } catch (error) {
          message.error('Failed to delete student');
        }
      },
    });
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.admissionNumber?.includes(search) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
        <p className="text-gray-600">View and manage all enrolled students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-indigo-600">{stats.total}</p>
            <p className="text-gray-600 mt-2">Total Students</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600">{stats.active}</p>
            <p className="text-gray-600 mt-2">Active</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-red-600">{stats.suspended}</p>
            <p className="text-gray-600 mt-2">Suspended</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Students List</h2>
          <Button type="primary" icon={<PlusOutlined />} className="bg-indigo-600">
            Add Student
          </Button>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search by name, admission number, or email..."
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
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Admission Number</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{student.admissionNumber}</td>
                    <td className="px-4 py-3 text-gray-900">{student.name}</td>
                    <td className="px-4 py-3 text-gray-600">{student.email}</td>
                    <td className="px-4 py-3">
                      <Tag color={student.status === 'active' ? 'green' : 'red'}>
                        {student.status?.toUpperCase()}
                      </Tag>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
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
                        onClick={() => handleDelete(student._id)}
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
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-gray-600">
            Showing {paginatedStudents.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, filteredStudents.length)} of {filteredStudents.length}
          </span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredStudents.length}
            onChange={setCurrentPage}
          />
        </div>
      </Card>

      <Modal
        title="Student Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Admission Number</p>
                <p className="font-semibold text-gray-900">{selectedStudent.admissionNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-semibold text-gray-900">
                  <Tag color={selectedStudent.status === 'active' ? 'green' : 'red'}>
                    {selectedStudent.status?.toUpperCase()}
                  </Tag>
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-semibold text-gray-900">{selectedStudent.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold text-gray-900">{selectedStudent.email}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-semibold text-gray-900">{selectedStudent.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Date of Birth</p>
                <p className="font-semibold text-gray-900">{selectedStudent.dob || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminStudentsPage;
